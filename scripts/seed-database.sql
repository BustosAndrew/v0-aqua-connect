-- Seed script for AquaConnect database
-- This script will populate the database with initial data for development

-- Insert Ports
INSERT INTO ports (name) VALUES 
('Callao'),
('Chimbote'), 
('Paita'),
('Ilo'),
('Pisco');

-- Insert Fish Species
INSERT INTO fish_species (name) VALUES
('Anchoveta'),
('Sardine'),
('Mackerel'),
('Tuna'),
('Bonito'),
('Octopus'),
('Scallops');

-- Insert Ships
INSERT INTO ships (name, port_id) VALUES
('Esperanza', 1),
('Mar Azul', 2),
('Nuevo Amanecer', 3),
('La Perla del Mar', 1),
('El Veloz', 2),
('Estrella del Sur', 4);

-- Insert Crew Members
INSERT INTO crew_members (name, role, ship_id) VALUES
('Ricardo Gomez', 'Captain', 1),
('Mateo Flores', 'Deckhand', 1),
('Sofia Ramirez', 'Engineer', 1),
('Carlos Lopez', 'Captain', 2),
('Isabella Torres', 'Deckhand', 2),
('Diego Vargas', 'Navigator', 2),
('Mateo Rodriguez', 'Captain', 4),
('Ana Martinez', 'Deckhand', 4);

-- Insert Sample Real-Time Market Data
INSERT INTO real_time_market_data (port_id, species_id, price_per_kg, kg, updated_at) VALUES
(1, 1, 12.50, 1500, NOW()), -- Callao - Anchoveta
(1, 3, 8.75, 800, NOW()),   -- Callao - Mackerel  
(1, 4, 15.20, 500, NOW()),  -- Callao - Tuna
(2, 1, 11.80, 2000, NOW()), -- Chimbote - Anchoveta
(2, 2, 9.50, 1200, NOW()),  -- Chimbote - Sardine
(3, 4, 16.00, 600, NOW());  -- Paita - Tuna

-- Insert Sample Trips
INSERT INTO trips (ship_id, port_id, species_id, kg_caught, date, income_result, location_x, location_y, departure_time, return_time, status) VALUES
(1, 1, 4, 500, '2024-07-26', 7600, -77.1167, -12.0500, '2024-07-26 06:00:00', '2024-07-26 16:00:00', 'completed'),
(2, 2, 3, 800, '2024-07-25', 7000, -78.5833, -9.0833, '2024-07-25 07:30:00', '2024-07-25 17:30:00', 'completed'),
(3, 3, 1, 1200, '2024-07-24', 15000, -81.1167, -5.2000, '2024-07-24 08:00:00', '2024-07-24 18:00:00', 'in-progress');

-- Insert Sample Catch Logs
INSERT INTO catch_logs (date, trip_id, species_id, total_kg, vessel, price_per_kg, total_value) VALUES
('2024-07-26', 1, 1, 1500, 'El Sol', 2.50, 3750),
('2024-07-25', 2, 3, 800, 'La Luna', 3.00, 2400),
('2024-07-24', 3, 2, 1200, 'El Sol', 2.00, 2400),
('2024-07-23', NULL, 4, 500, 'La Luna', 5.00, 2500),
('2024-07-22', NULL, 1, 1800, 'El Sol', 2.50, 4500);

-- Insert Sample Co-op Income Data
INSERT INTO coop_incomes (date, total_income, port_id, port_income) VALUES
('2024-07-01', 125000, 1, 56250),
('2024-07-01', 125000, 2, 31250),
('2024-07-01', 125000, 3, 18750),
('2024-07-01', 125000, 4, 12500),
('2024-07-01', 125000, 5, 6250);

-- Insert Sample Price Predictions
INSERT INTO price_predictions (date, species_id, price_per_kg, kg) VALUES
(NOW() + INTERVAL '1 day', 1, 13.00, 1600),
(NOW() + INTERVAL '1 day', 3, 9.25, 850),
(NOW() + INTERVAL '1 day', 4, 15.80, 520);

-- Insert Sample Fish Availability
INSERT INTO fish_availability (species_id, estimated_kg_available, approximate_location_x, approximate_location_y) VALUES
(1, 5000, -77.1167, -12.0500), -- Anchoveta near Callao
(4, 1200, -81.1167, -5.2000),  -- Tuna near Paita
(3, 3000, -78.5833, -9.0833);  -- Mackerel near Chimbote

-- Insert Sample Fishing Hotspot Forecasts
INSERT INTO fishing_hotspot_forecasts (date, location_x, location_y, species_id, expected_kg_available) VALUES
(NOW(), -77.1167, -12.0500, 1, 2500), -- Anchoveta hotspot near Callao
(NOW(), -81.1167, -5.2000, 4, 800),   -- Tuna hotspot near Paita
(NOW(), -78.5833, -9.0833, 3, 1500);  -- Mackerel hotspot near Chimbote
