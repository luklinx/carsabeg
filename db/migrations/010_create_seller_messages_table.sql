-- 010_create_seller_messages_table.sql
-- Create table to store messages users send to sellers

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS seller_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL,
  message TEXT NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(32),
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Foreign key reference to cars(id) if the column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cars') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'fk_seller_messages_car_id' AND table_name = 'seller_messages'
    ) THEN
      ALTER TABLE seller_messages
      ADD CONSTRAINT fk_seller_messages_car_id FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE;
    END IF;
  END IF;
END$$;

-- Optional foreign key to users
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'fk_seller_messages_user_id' AND table_name = 'seller_messages'
    ) THEN
      ALTER TABLE seller_messages
      ADD CONSTRAINT fk_seller_messages_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_seller_messages_car_id ON seller_messages(car_id);
CREATE INDEX IF NOT EXISTS idx_seller_messages_user_id ON seller_messages(user_id);
