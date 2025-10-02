-- Add realistic price data based on the AI-generated forecasts from public/prices folder

-- Insert realistic market prices for Anchoveta at Callao port
-- Based on the AI forecast showing price around S/ 2.315 per kg

INSERT INTO market_prices (species, port, price_per_kg, change_percentage, recorded_at)
VALUES
  -- Current week prices (around the forecast baseline)
  ('Anchoveta', 'Callao', 2.35, 1.5, NOW() - INTERVAL '1 hour'),
  ('Anchoveta', 'Callao', 2.32, -1.3, NOW() - INTERVAL '6 hours'),
  ('Anchoveta', 'Callao', 2.38, 2.6, NOW() - INTERVAL '12 hours'),
  ('Anchoveta', 'Callao', 2.31, -2.9, NOW() - INTERVAL '1 day'),
  ('Anchoveta', 'Callao', 2.40, 3.9, NOW() - INTERVAL '2 days'),
  ('Anchoveta', 'Callao', 2.28, -5.0, NOW() - INTERVAL '3 days'),
  ('Anchoveta', 'Callao', 2.42, 6.1, NOW() - INTERVAL '4 days'),
  ('Anchoveta', 'Callao', 2.25, -7.0, NOW() - INTERVAL '5 days'),
  ('Anchoveta', 'Callao', 2.45, 8.9, NOW() - INTERVAL '6 days'),
  ('Anchoveta', 'Callao', 2.20, -10.2, NOW() - INTERVAL '7 days'),
  
  -- Add prices for other ports
  ('Anchoveta', 'Paita', 2.28, 0.9, NOW() - INTERVAL '1 hour'),
  ('Anchoveta', 'Paita', 2.25, -1.3, NOW() - INTERVAL '6 hours'),
  ('Anchoveta', 'Paita', 2.30, 2.2, NOW() - INTERVAL '12 hours'),
  ('Anchoveta', 'Paita', 2.22, -3.5, NOW() - INTERVAL '1 day'),
  
  ('Anchoveta', 'Chimbote', 2.40, 2.1, NOW() - INTERVAL '1 hour'),
  ('Anchoveta', 'Chimbote', 2.37, -1.3, NOW() - INTERVAL '6 hours'),
  ('Anchoveta', 'Chimbote', 2.43, 2.5, NOW() - INTERVAL '12 hours'),
  ('Anchoveta', 'Chimbote', 2.35, -3.3, NOW() - INTERVAL '1 day'),
  
  -- Add other species with realistic prices
  ('Bonito', 'Callao', 8.50, 1.2, NOW() - INTERVAL '1 hour'),
  ('Bonito', 'Callao', 8.45, -0.6, NOW() - INTERVAL '6 hours'),
  ('Bonito', 'Callao', 8.60, 1.8, NOW() - INTERVAL '12 hours'),
  
  ('Jurel', 'Callao', 6.75, 0.7, NOW() - INTERVAL '1 hour'),
  ('Jurel', 'Callao', 6.70, -0.7, NOW() - INTERVAL '6 hours'),
  ('Jurel', 'Callao', 6.80, 1.5, NOW() - INTERVAL '12 hours'),
  
  ('Caballa', 'Callao', 5.20, -0.4, NOW() - INTERVAL '1 hour'),
  ('Caballa', 'Callao', 5.25, 1.0, NOW() - INTERVAL '6 hours'),
  ('Caballa', 'Callao', 5.15, -1.9, NOW() - INTERVAL '12 hours')
ON CONFLICT DO NOTHING;

-- Insert realistic price forecasts based on AI model predictions
INSERT INTO price_forecasts (species, region, forecast_date, price, confidence_level, trend, created_at)
VALUES
  -- Anchoveta forecasts (based on AI prediction: S/ 2.315, direction: Down, confidence: 100%)
  ('Anchoveta', 'Callao', CURRENT_DATE + INTERVAL '1 day', 2.315, 100, 'down', NOW()),
  ('Anchoveta', 'Callao', CURRENT_DATE + INTERVAL '2 days', 2.295, 98, 'down', NOW()),
  ('Anchoveta', 'Callao', CURRENT_DATE + INTERVAL '3 days', 2.280, 95, 'down', NOW()),
  ('Anchoveta', 'Callao', CURRENT_DATE + INTERVAL '4 days', 2.270, 92, 'stable', NOW()),
  ('Anchoveta', 'Callao', CURRENT_DATE + INTERVAL '5 days', 2.265, 88, 'stable', NOW()),
  ('Anchoveta', 'Callao', CURRENT_DATE + INTERVAL '6 days', 2.275, 85, 'up', NOW()),
  ('Anchoveta', 'Callao', CURRENT_DATE + INTERVAL '7 days', 2.290, 82, 'up', NOW()),
  
  -- Other regions
  ('Anchoveta', 'Paita', CURRENT_DATE + INTERVAL '1 day', 2.25, 95, 'down', NOW()),
  ('Anchoveta', 'Paita', CURRENT_DATE + INTERVAL '2 days', 2.23, 92, 'down', NOW()),
  ('Anchoveta', 'Paita', CURRENT_DATE + INTERVAL '3 days', 2.22, 88, 'stable', NOW()),
  
  ('Anchoveta', 'Chimbote', CURRENT_DATE + INTERVAL '1 day', 2.38, 96, 'down', NOW()),
  ('Anchoveta', 'Chimbote', CURRENT_DATE + INTERVAL '2 days', 2.36, 93, 'down', NOW()),
  ('Anchoveta', 'Chimbote', CURRENT_DATE + INTERVAL '3 days', 2.35, 90, 'stable', NOW()),
  
  -- Other species forecasts
  ('Bonito', 'Callao', CURRENT_DATE + INTERVAL '1 day', 8.65, 88, 'up', NOW()),
  ('Bonito', 'Callao', CURRENT_DATE + INTERVAL '2 days', 8.75, 85, 'up', NOW()),
  ('Bonito', 'Callao', CURRENT_DATE + INTERVAL '3 days', 8.80, 82, 'up', NOW()),
  
  ('Jurel', 'Callao', CURRENT_DATE + INTERVAL '1 day', 6.85, 90, 'up', NOW()),
  ('Jurel', 'Callao', CURRENT_DATE + INTERVAL '2 days', 6.90, 87, 'up', NOW()),
  ('Jurel', 'Callao', CURRENT_DATE + INTERVAL '3 days', 6.95, 84, 'stable', NOW()),
  
  ('Caballa', 'Callao', CURRENT_DATE + INTERVAL '1 day', 5.15, 85, 'down', NOW()),
  ('Caballa', 'Callao', CURRENT_DATE + INTERVAL '2 days', 5.10, 82, 'down', NOW()),
  ('Caballa', 'Callao', CURRENT_DATE + INTERVAL '3 days', 5.08, 80, 'stable', NOW())
ON CONFLICT DO NOTHING;

-- Insert fish availability forecasts based on GeoJSON hotspot predictions
-- High probability areas (p > 0.8) = High availability
-- Medium probability areas (0.6 < p < 0.8) = Medium availability
-- Lower probability areas (0.5 < p < 0.6) = Low availability

INSERT INTO fish_availability_forecasts (species, region, forecast_date, availability_percentage, confidence_level, created_at)
VALUES
  -- Week 28 forecasts (based on 2024-W28.geojson data)
  ('Anchoveta', 'Paita Bay', CURRENT_DATE + INTERVAL '1 day', 85, 'High', NOW()),
  ('Anchoveta', 'Paita Bay', CURRENT_DATE + INTERVAL '2 days', 88, 'High', NOW()),
  ('Anchoveta', 'Paita Bay', CURRENT_DATE + INTERVAL '3 days', 82, 'High', NOW()),
  ('Anchoveta', 'Paita Bay', CURRENT_DATE + INTERVAL '4 days', 80, 'Medium', NOW()),
  ('Anchoveta', 'Paita Bay', CURRENT_DATE + INTERVAL '5 days', 78, 'Medium', NOW()),
  ('Anchoveta', 'Paita Bay', CURRENT_DATE + INTERVAL '6 days', 75, 'Medium', NOW()),
  ('Anchoveta', 'Paita Bay', CURRENT_DATE + INTERVAL '7 days', 73, 'Medium', NOW()),
  
  -- Other regions
  ('Anchoveta', 'North Pacific', CURRENT_DATE + INTERVAL '1 day', 72, 'Medium', NOW()),
  ('Anchoveta', 'North Pacific', CURRENT_DATE + INTERVAL '2 days', 75, 'Medium', NOW()),
  ('Anchoveta', 'North Pacific', CURRENT_DATE + INTERVAL '3 days', 70, 'Medium', NOW()),
  
  ('Anchoveta', 'South Pacific', CURRENT_DATE + INTERVAL '1 day', 65, 'Medium', NOW()),
  ('Anchoveta', 'South Pacific', CURRENT_DATE + INTERVAL '2 days', 68, 'Medium', NOW()),
  ('Anchoveta', 'South Pacific', CURRENT_DATE + INTERVAL '3 days', 62, 'Low', NOW()),
  
  -- Other species
  ('Bonito', 'Paita Bay', CURRENT_DATE + INTERVAL '1 day', 70, 'Medium', NOW()),
  ('Bonito', 'Paita Bay', CURRENT_DATE + INTERVAL '2 days', 72, 'Medium', NOW()),
  ('Bonito', 'Paita Bay', CURRENT_DATE + INTERVAL '3 days', 68, 'Medium', NOW()),
  
  ('Jurel', 'Paita Bay', CURRENT_DATE + INTERVAL '1 day', 78, 'High', NOW()),
  ('Jurel', 'Paita Bay', CURRENT_DATE + INTERVAL '2 days', 80, 'High', NOW()),
  ('Jurel', 'Paita Bay', CURRENT_DATE + INTERVAL '3 days', 75, 'Medium', NOW()),
  
  ('Caballa', 'Paita Bay', CURRENT_DATE + INTERVAL '1 day', 68, 'Medium', NOW()),
  ('Caballa', 'Paita Bay', CURRENT_DATE + INTERVAL '2 days', 70, 'Medium', NOW()),
  ('Caballa', 'Paita Bay', CURRENT_DATE + INTERVAL '3 days', 65, 'Medium', NOW())
ON CONFLICT DO NOTHING;
