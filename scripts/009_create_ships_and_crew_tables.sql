-- Create ships table
CREATE TABLE IF NOT EXISTS ships (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  port VARCHAR(200) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create crew_members table
CREATE TABLE IF NOT EXISTS crew_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  ship_id INTEGER REFERENCES ships(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_crew_members_ship_id ON crew_members(ship_id);
CREATE INDEX IF NOT EXISTS idx_crew_members_role ON crew_members(role);

-- Insert sample data
INSERT INTO ships (name, port, image_url) VALUES
  ('La Perla del Mar', 'Puerto Vallarta', '/placeholder.svg?height=200&width=300'),
  ('El Veloz', 'Mazatlán', '/placeholder.svg?height=200&width=300'),
  ('Estrella del Sur', 'Cabo San Lucas', '/placeholder.svg?height=200&width=300'),
  ('El Pescador', 'Paita', '/placeholder.svg?height=200&width=300'),
  ('Esperanza', 'Callao', '/placeholder.svg?height=200&width=300'),
  ('Mar Azul', 'Chimbote', '/placeholder.svg?height=200&width=300'),
  ('Nuevo Amanecer', 'Ilo', '/placeholder.svg?height=200&width=300')
ON CONFLICT (name) DO NOTHING;

-- Insert crew members
INSERT INTO crew_members (name, role, ship_id, avatar_url) VALUES
  ('Mateo Rodriguez', 'Captain', (SELECT id FROM ships WHERE name = 'La Perla del Mar'), '/placeholder.svg?height=40&width=40'),
  ('Sofia Ramirez', 'Engineer', (SELECT id FROM ships WHERE name = 'La Perla del Mar'), '/placeholder.svg?height=40&width=40'),
  ('Carlos Lopez', 'Captain', (SELECT id FROM ships WHERE name = 'El Veloz'), '/placeholder.svg?height=40&width=40'),
  ('Isabella Torres', 'Deckhand', (SELECT id FROM ships WHERE name = 'El Veloz'), '/placeholder.svg?height=40&width=40'),
  ('Diego Vargas', 'Navigator', (SELECT id FROM ships WHERE name = 'Estrella del Sur'), '/placeholder.svg?height=40&width=40'),
  ('Ricardo Gomez', 'Captain', (SELECT id FROM ships WHERE name = 'El Pescador'), '/placeholder.svg?height=40&width=40'),
  ('Mateo Flores', 'Deckhand', (SELECT id FROM ships WHERE name = 'El Pescador'), '/placeholder.svg?height=40&width=40'),
  ('Sofia Martinez', 'Engineer', (SELECT id FROM ships WHERE name = 'Esperanza'), '/placeholder.svg?height=40&width=40')
ON CONFLICT DO NOTHING;
