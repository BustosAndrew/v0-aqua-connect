-- Seed fish availability forecasts
INSERT INTO fish_availability_forecasts (species, region, forecast_date, availability_percentage, confidence_level) VALUES
-- Tuna forecasts
('Tuna', 'North Pacific', CURRENT_DATE, 85, 'High'),
('Tuna', 'North Pacific', CURRENT_DATE + INTERVAL '7 days', 78, 'High'),
('Tuna', 'North Pacific', CURRENT_DATE + INTERVAL '14 days', 72, 'Medium'),
('Tuna', 'South Pacific', CURRENT_DATE, 65, 'Medium'),
('Tuna', 'South Pacific', CURRENT_DATE + INTERVAL '7 days', 70, 'Medium'),
('Tuna', 'Atlantic', CURRENT_DATE, 55, 'Medium'),
('Tuna', 'Atlantic', CURRENT_DATE + INTERVAL '7 days', 60, 'Low'),

-- Salmon forecasts
('Salmon', 'North Pacific', CURRENT_DATE, 92, 'High'),
('Salmon', 'North Pacific', CURRENT_DATE + INTERVAL '7 days', 88, 'High'),
('Salmon', 'North Pacific', CURRENT_DATE + INTERVAL '14 days', 85, 'High'),
('Salmon', 'Atlantic', CURRENT_DATE, 75, 'High'),
('Salmon', 'Atlantic', CURRENT_DATE + INTERVAL '7 days', 80, 'Medium'),

-- Mackerel forecasts
('Mackerel', 'North Pacific', CURRENT_DATE, 70, 'Medium'),
('Mackerel', 'North Pacific', CURRENT_DATE + INTERVAL '7 days', 65, 'Medium'),
('Mackerel', 'South Pacific', CURRENT_DATE, 80, 'High'),
('Mackerel', 'Atlantic', CURRENT_DATE, 60, 'Low'),

-- Sardine forecasts
('Sardine', 'South Pacific', CURRENT_DATE, 88, 'High'),
('Sardine', 'South Pacific', CURRENT_DATE + INTERVAL '7 days', 85, 'High'),
('Sardine', 'Atlantic', CURRENT_DATE, 70, 'Medium'),

-- Cod forecasts
('Cod', 'North Pacific', CURRENT_DATE, 45, 'Low'),
('Cod', 'Atlantic', CURRENT_DATE, 82, 'High'),
('Cod', 'Atlantic', CURRENT_DATE + INTERVAL '7 days', 78, 'High');

-- Seed price forecasts
INSERT INTO price_forecasts (species, region, forecast_date, price, confidence_level, trend) VALUES
-- Tuna prices
('Tuna', 'North Pacific', CURRENT_DATE, 12.50, 85, 'up'),
('Tuna', 'North Pacific', CURRENT_DATE + INTERVAL '7 days', 13.20, 80, 'up'),
('Tuna', 'North Pacific', CURRENT_DATE + INTERVAL '14 days', 13.80, 75, 'up'),
('Tuna', 'South Pacific', CURRENT_DATE, 11.80, 78, 'stable'),
('Tuna', 'Atlantic', CURRENT_DATE, 12.00, 70, 'down'),

-- Salmon prices
('Salmon', 'North Pacific', CURRENT_DATE, 15.75, 90, 'up'),
('Salmon', 'North Pacific', CURRENT_DATE + INTERVAL '7 days', 16.20, 88, 'up'),
('Salmon', 'Atlantic', CURRENT_DATE, 14.50, 85, 'stable'),

-- Mackerel prices
('Mackerel', 'North Pacific', CURRENT_DATE, 8.30, 75, 'down'),
('Mackerel', 'South Pacific', CURRENT_DATE, 8.80, 80, 'stable'),
('Mackerel', 'Atlantic', CURRENT_DATE, 7.90, 65, 'down'),

-- Sardine prices
('Sardine', 'South Pacific', CURRENT_DATE, 6.50, 88, 'up'),
('Sardine', 'Atlantic', CURRENT_DATE, 6.20, 75, 'stable'),

-- Cod prices
('Cod', 'North Pacific', CURRENT_DATE, 10.20, 60, 'down'),
('Cod', 'Atlantic', CURRENT_DATE, 11.50, 85, 'up');
