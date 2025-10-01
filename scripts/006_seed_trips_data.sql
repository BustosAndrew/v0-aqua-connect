-- Seed trips data
INSERT INTO trips (ship_name, image_url, departure_time, return_time, location, target_species, status, trip_date) VALUES
('Esperanza', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screen-Hsb7dUftmGoYy0BskOedC7r3Aoaklu.png', '06:00:00', '16:00:00', 'Máncora', 'Tuna', 'On Time', CURRENT_DATE),
('Mar Azul', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screen-Hsb7dUftmGoYy0BskOedC7r3Aoaklu.png', '07:30:00', '17:30:00', 'Cabo Blanco', 'Mackerel', 'Delayed', CURRENT_DATE),
('Nuevo Amanecer', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screen-Hsb7dUftmGoYy0BskOedC7r3Aoaklu.png', '08:00:00', '18:00:00', 'El Ñuro', 'Mahi-mahi', 'In Progress', CURRENT_DATE),
('La Perla', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screen-Hsb7dUftmGoYy0BskOedC7r3Aoaklu.png', '05:30:00', '15:30:00', 'Paita', 'Bonito', 'On Time', CURRENT_DATE),
('El Dorado', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screen-Hsb7dUftmGoYy0BskOedC7r3Aoaklu.png', '06:45:00', '16:45:00', 'Talara', 'Jurel', 'In Progress', CURRENT_DATE);
