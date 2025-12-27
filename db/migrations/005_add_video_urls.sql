-- Add video_urls column to cars to support uploaded listing videos
ALTER TABLE IF EXISTS cars
ADD COLUMN IF NOT EXISTS video_urls text[];

-- No backfill here; videos are optional and added on upload
