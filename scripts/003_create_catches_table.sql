-- Create catch_logs table
CREATE TABLE IF NOT EXISTS catch_logs (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  vessel VARCHAR(100) NOT NULL,
  species VARCHAR(100) NOT NULL,
  total_kg DECIMAL(10, 2) NOT NULL,
  price_per_kg DECIMAL(10, 2) NOT NULL,
  total_value DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_catch_logs_date ON catch_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_catch_logs_species ON catch_logs(species);
CREATE INDEX IF NOT EXISTS idx_catch_logs_vessel ON catch_logs(vessel);
