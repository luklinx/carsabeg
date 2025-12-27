-- 015_create_inspection_slots.sql
-- Add table `inspection_slots` and columns to `inspections` to reference slots and scheduled_time
BEGIN;

CREATE TABLE IF NOT EXISTS inspection_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  capacity integer NOT NULL DEFAULT 1,
  created_by uuid NULL,
  created_at timestamptz DEFAULT now()
);

-- Add slot_id and scheduled_time to inspections for normalized scheduling
ALTER TABLE IF EXISTS inspections
  ADD COLUMN IF NOT EXISTS slot_id uuid NULL,
  ADD COLUMN IF NOT EXISTS scheduled_time timestamptz NULL;

-- Ensure FK constraint for slot_id exists (drop then add to be idempotent)
ALTER TABLE IF EXISTS inspections
  DROP CONSTRAINT IF EXISTS fk_inspections_slot;
ALTER TABLE IF EXISTS inspections
  ADD CONSTRAINT fk_inspections_slot
  FOREIGN KEY (slot_id) REFERENCES inspection_slots(id) ON DELETE SET NULL;

-- Helper RPC to count bookings per slot
CREATE OR REPLACE FUNCTION count_bookings_by_slot(slot_ids uuid[])
RETURNS TABLE(slot_id uuid, count bigint) LANGUAGE sql AS $$
  SELECT slot_id, COUNT(*)::bigint
  FROM inspections
  WHERE slot_id = ANY(slot_ids) AND status != 'cancelled'
  GROUP BY slot_id;
$$;

-- Trigger to enforce slot capacity at insert/update time
CREATE OR REPLACE FUNCTION enforce_slot_capacity()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  var_count integer := 0;
  var_capacity integer;
BEGIN
  IF NEW.slot_id IS NULL THEN
    RETURN NEW;
  END IF;

  PERFORM 1 FROM inspection_slots WHERE id = NEW.slot_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Slot % not found', NEW.slot_id;
  END IF;

  -- Count existing non-cancelled bookings for this slot
  SELECT COUNT(*) INTO var_count FROM inspections WHERE slot_id = NEW.slot_id AND status != 'cancelled';

  -- If updating an existing record that already belongs to this slot, exclude it from the count
  IF TG_OP = 'UPDATE' AND (OLD.slot_id IS NOT NULL AND OLD.slot_id = NEW.slot_id) THEN
    var_count := var_count - 1;
  END IF;

  SELECT capacity INTO var_capacity FROM inspection_slots WHERE id = NEW.slot_id;
  IF var_capacity IS NULL THEN
    var_capacity := 1;
  END IF;

  IF var_count >= var_capacity THEN
    RAISE EXCEPTION 'Slot % is already full', NEW.slot_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger
DROP TRIGGER IF EXISTS trg_enforce_slot_capacity ON inspections;
CREATE TRIGGER trg_enforce_slot_capacity
BEFORE INSERT OR UPDATE ON inspections
FOR EACH ROW
WHEN (NEW.slot_id IS NOT NULL)
EXECUTE FUNCTION enforce_slot_capacity();

COMMIT;