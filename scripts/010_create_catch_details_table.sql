-- Create catch_details table for detailed catch information by ship
CREATE TABLE IF NOT EXISTS catch_details (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  ship_name VARCHAR(100) NOT NULL,
  crew_count INTEGER NOT NULL,
  species VARCHAR(100) NOT NULL,
  kg_caught DECIMAL(10, 2) NOT NULL,
  price_per_kg DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_catch_details_date ON catch_details(date DESC);
CREATE INDEX IF NOT EXISTS idx_catch_details_ship ON catch_details(ship_name);

-- Insert sample data
INSERT INTO catch_details (date, ship_name, crew_count, species, kg_caught, price_per_kg, subtotal) VALUES
  ('2024-07-15', 'El Sol', 4, 'Anchoveta', 1500, 2.5, 3750.0),
  ('2024-07-15', 'La Perla', 3, 'Bonito', 450, 3.8, 1710.0),
  ('2024-07-15', 'La Perla', 3, 'Jurel', 200, 2.5, 500.0),
  ('2024-07-14', 'El Pescador', 5, 'Anchoveta', 2000, 2.5, 5000.0),
  ('2024-07-14', 'Mar Azul', 4, 'Sardina', 800, 3.2, 2560.0)
ON CONFLICT DO NOTHING;
