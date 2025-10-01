-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  ship_name VARCHAR(100) NOT NULL,
  image_url TEXT,
  departure_time TIME NOT NULL,
  return_time TIME NOT NULL,
  location VARCHAR(200) NOT NULL,
  target_species VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('On Time', 'Delayed', 'In Progress', 'Completed', 'Cancelled')),
  trip_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_trips_date ON trips(trip_date DESC);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
