-- Add state and city columns to cars for normalized location storage
ALTER TABLE IF EXISTS cars
ADD COLUMN IF NOT EXISTS state text;

ALTER TABLE IF EXISTS cars
ADD COLUMN IF NOT EXISTS city text;

-- Backfill simple cases using comma-separated `location` values: 'City, State'
UPDATE cars
SET city = NULLIF(trim(split_part(location, ',', 1)), ''),
    state = NULLIF(trim(split_part(location, ',', 2)), '')
WHERE location IS NOT NULL AND (city IS NULL OR state IS NULL);

-- For remaining rows, heuristically match common states
UPDATE cars SET state = 'Lagos' WHERE state IS NULL AND location ILIKE '%lagos%';
UPDATE cars SET state = 'Abuja' WHERE state IS NULL AND (location ILIKE '%abuja%' OR location ILIKE '%fct%');
UPDATE cars SET state = 'Kano' WHERE state IS NULL AND location ILIKE '%kano%';
UPDATE cars SET state = 'Kaduna' WHERE state IS NULL AND location ILIKE '%kaduna%';
UPDATE cars SET state = 'Rivers' WHERE state IS NULL AND location ILIKE '%port harcourt%' OR location ILIKE '%portharcourt%';

-- If city is missing but location contained a single token, set city=location
UPDATE cars SET city = trim(location) WHERE city IS NULL AND state IS NULL AND location IS NOT NULL;
