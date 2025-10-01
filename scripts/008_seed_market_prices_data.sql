-- Seed market prices data with historical data for the past 7 days
INSERT INTO market_prices (species, port, price_per_kg, change_percentage, recorded_at) VALUES
-- Today's prices
('Anchoveta', 'Paita', 12.50, 2.5, CURRENT_TIMESTAMP),
('Bonito', 'Paita', 15.80, -1.2, CURRENT_TIMESTAMP),
('Jurel', 'Paita', 18.20, 0.8, CURRENT_TIMESTAMP),
('Mackerel', 'Paita', 14.50, 1.5, CURRENT_TIMESTAMP),
('Tuna', 'Paita', 25.00, 3.2, CURRENT_TIMESTAMP),
('Anchoveta', 'Chimbote', 11.80, 1.8, CURRENT_TIMESTAMP),
('Bonito', 'Chimbote', 16.20, -0.5, CURRENT_TIMESTAMP),
('Jurel', 'Chimbote', 17.50, 1.2, CURRENT_TIMESTAMP),
('Mackerel', 'Chimbote', 13.90, 0.9, CURRENT_TIMESTAMP),

-- Yesterday
('Anchoveta', 'Paita', 12.20, 1.8, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('Bonito', 'Paita', 16.00, 0.5, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('Jurel', 'Paita', 18.05, -0.3, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('Mackerel', 'Paita', 14.28, 2.1, CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- 2 days ago
('Anchoveta', 'Paita', 11.98, -0.5, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('Bonito', 'Paita', 15.92, 1.2, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('Jurel', 'Paita', 18.10, 0.6, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('Mackerel', 'Paita', 13.99, -1.0, CURRENT_TIMESTAMP - INTERVAL '2 days'),

-- 3 days ago
('Anchoveta', 'Paita', 12.04, 0.8, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('Bonito', 'Paita', 15.73, -0.8, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('Jurel', 'Paita', 17.99, 1.5, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('Mackerel', 'Paita', 14.13, 0.3, CURRENT_TIMESTAMP - INTERVAL '3 days'),

-- 4 days ago
('Anchoveta', 'Paita', 11.95, 1.2, CURRENT_TIMESTAMP - INTERVAL '4 days'),
('Bonito', 'Paita', 15.86, 0.9, CURRENT_TIMESTAMP - INTERVAL '4 days'),
('Jurel', 'Paita', 17.72, -0.4, CURRENT_TIMESTAMP - INTERVAL '4 days'),
('Mackerel', 'Paita', 14.09, 1.8, CURRENT_TIMESTAMP - INTERVAL '4 days'),

-- 5 days ago
('Anchoveta', 'Paita', 11.81, -0.3, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('Bonito', 'Paita', 15.72, 0.4, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('Jurel', 'Paita', 17.79, 0.7, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('Mackerel', 'Paita', 13.84, -0.6, CURRENT_TIMESTAMP - INTERVAL '5 days'),

-- 6 days ago
('Anchoveta', 'Paita', 11.85, 0.5, CURRENT_TIMESTAMP - INTERVAL '6 days'),
('Bonito', 'Paita', 15.66, -1.1, CURRENT_TIMESTAMP - INTERVAL '6 days'),
('Jurel', 'Paita', 17.67, 0.2, CURRENT_TIMESTAMP - INTERVAL '6 days'),
('Mackerel', 'Paita', 13.92, 1.3, CURRENT_TIMESTAMP - INTERVAL '6 days');
