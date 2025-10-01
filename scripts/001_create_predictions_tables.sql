-- Create fish availability forecasts table
CREATE TABLE IF NOT EXISTS fish_availability_forecasts (
  id SERIAL PRIMARY KEY,
  species VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  forecast_date DATE NOT NULL,
  availability_percentage INTEGER NOT NULL CHECK (availability_percentage >= 0 AND availability_percentage <= 100),
  confidence_level VARCHAR(20) NOT NULL CHECK (confidence_level IN ('High', 'Medium', 'Low')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create price forecasts table
CREATE TABLE IF NOT EXISTS price_forecasts (
  id SERIAL PRIMARY KEY,
  species VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  forecast_date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  confidence_level INTEGER NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
  trend VARCHAR(20) NOT NULL CHECK (trend IN ('up', 'down', 'stable')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_availability_species ON fish_availability_forecasts(species);
CREATE INDEX IF NOT EXISTS idx_availability_region ON fish_availability_forecasts(region);
CREATE INDEX IF NOT EXISTS idx_availability_date ON fish_availability_forecasts(forecast_date);
CREATE INDEX IF NOT EXISTS idx_price_species ON price_forecasts(species);
CREATE INDEX IF NOT EXISTS idx_price_region ON price_forecasts(region);
CREATE INDEX IF NOT EXISTS idx_price_date ON price_forecasts(forecast_date);
