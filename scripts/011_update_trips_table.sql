-- Add additional columns to trips table for detailed trip information
ALTER TABLE trips ADD COLUMN IF NOT EXISTS captain VARCHAR(100);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS crew_members TEXT[];
ALTER TABLE trips ADD COLUMN IF NOT EXISTS estimated_income DECIMAL(10, 2);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS duration_days INTEGER;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS fishing_zone VARCHAR(100);

-- Create index for captain
CREATE INDEX IF NOT EXISTS idx_trips_captain ON trips(captain);
