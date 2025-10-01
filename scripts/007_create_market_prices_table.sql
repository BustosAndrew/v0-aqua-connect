-- Create market_prices table
CREATE TABLE IF NOT EXISTS market_prices (
  id SERIAL PRIMARY KEY,
  species VARCHAR(100) NOT NULL,
  port VARCHAR(100) NOT NULL,
  price_per_kg DECIMAL(10, 2) NOT NULL,
  change_percentage DECIMAL(5, 2),
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_market_prices_species ON market_prices(species);
CREATE INDEX IF NOT EXISTS idx_market_prices_port ON market_prices(port);
CREATE INDEX IF NOT EXISTS idx_market_prices_recorded_at ON market_prices(recorded_at DESC);
