'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { EnhancedWeatherOverlay } from './enhanced-weather-overlay';

interface FishingHotspot {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'high' | 'medium' | 'low';
  species: string[];
  probability?: number;
}

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'windy' | 'rainy';
  windDirection:
    | 'north'
    | 'northeast'
    | 'east'
    | 'southeast'
    | 'south'
    | 'southwest'
    | 'west'
    | 'northwest';
  windSpeed: number;
  coordinates: [number, number];
}

interface EnhancedWeatherData {
  id: string;
  condition: 'sunny' | 'cloudy' | 'windy' | 'rainy';
  windDirection:
    | 'north'
    | 'northeast'
    | 'east'
    | 'southeast'
    | 'south'
    | 'southwest'
    | 'west'
    | 'northwest';
  windSpeed: number;
  temperature: number;
  coordinates: [number, number];
  intensity: 'high' | 'medium' | 'low';
}

interface MapboxFishingMapProps {
  hotspots?: FishingHotspot[];
  weather?: WeatherData[];
  showWeather?: boolean;
  className?: string;
}

export function MapboxFishingMap({
  hotspots = [],
  weather = [],
  showWeather = true,
  className = '',
}: MapboxFishingMapProps) {
  const [zoom, setZoom] = useState(8); // Start with wider view to see Peru coastline
  const [center, setCenter] = useState<[number, number]>([-81.1, -5.1]); // Paita, Peru
  const [mapImageUrl, setMapImageUrl] = useState('');
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    x: number;
    y: number;
    center: [number, number];
  } | null>(null);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>([
    -81.1, -5.1,
  ]); // For real-time dragging
  const [isLoading, setIsLoading] = useState(true);
  const [aiHotspots, setAiHotspots] = useState<FishingHotspot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Sync currentCenter with center when not dragging
  useEffect(() => {
    if (!isDragging) {
      setCurrentCenter(center);
    }
  }, [center, isDragging]);

  // Debounced map image fetching - only fetch when not dragging and after a delay
  useEffect(() => {
    if (isDragging) return; // Don't fetch while dragging

    const timeoutId = setTimeout(() => {
      const fetchMapImage = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/map-image?lng=${center[0]}&lat=${center[1]}&zoom=${zoom}&width=800&height=600`,
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch map image: ${response.statusText}`,
            );
          }

          const data = await response.json();
          if (data.url) {
            setMapImageUrl(data.url);
            setError(null);
          }
        } catch (error) {
          console.error('[v0] Failed to fetch map image:', error);
          setError('Failed to load map image');
          setMapImageUrl('/placeholder.svg?height=600&width=800');
        } finally {
          setIsLoading(false);
        }
      };

      fetchMapImage();
    }, 150); // Small delay to avoid too frequent updates

    return () => clearTimeout(timeoutId);
  }, [center, zoom, isDragging]);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await fetch('/predictions/2024-W28.geojson');

        if (!response.ok) {
          throw new Error(`Failed to fetch hotspots: ${response.statusText}`);
        }

        const geojsonData = await response.json();

        if (geojsonData && geojsonData.features) {
          const hotspots: FishingHotspot[] = geojsonData.features
            .filter((feature: any) => feature.properties.p > 0.5)
            .map((feature: any, index: number) => ({
              id: `ai-hotspot-${index}`,
              name: `Hotspot ${index + 1}`,
              coordinates: feature.geometry.coordinates as [number, number],
              type:
                feature.properties.p > 0.8
                  ? 'high'
                  : feature.properties.p > 0.6
                  ? 'medium'
                  : 'low',
              species: ['Anchoveta'],
              probability: feature.properties.p,
            }));

          setAiHotspots(hotspots);
        }
      } catch (error) {
        console.error('[v0] Failed to fetch AI hotspots:', error);
      }
    };

    fetchHotspots();
  }, []);

  const defaultHotspots: FishingHotspot[] = [
    {
      id: '1',
      name: 'Bote Gavel',
      coordinates: [-81.3, -5.0], // Offshore from Paita, Peru
      type: 'high',
      species: ['Anchovy', 'Sardine'],
    },
    {
      id: '2',
      name: 'Boso de Sal Resort',
      coordinates: [-81.4, -5.1], // Further offshore from Paita
      type: 'high',
      species: ['Mackerel', 'Tuna'],
    },
    {
      id: '3',
      name: 'Playa Audaz',
      coordinates: [-81.5, -5.3], // Offshore southwest of Paita
      type: 'medium',
      species: ['Anchovy', 'Bonito'],
    },
    {
      id: '4',
      name: 'Playa Las Gaviotas',
      coordinates: [-81.6, -5.4], // Further offshore southwest
      type: 'medium',
      species: ['Sardine', 'Mackerel'],
    },
  ];

  const activeHotspots =
    aiHotspots.length > 0
      ? aiHotspots
      : hotspots.length > 0
      ? hotspots
      : defaultHotspots;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 1));
  };

  const getHotspotColor = (type: string) => {
    switch (type) {
      case 'high':
        return 'bg-pink-500';
      case 'medium':
        return 'bg-green-600';
      case 'low':
        return 'bg-blue-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getHotspotPosition = (coordinates: [number, number]) => {
    const mapWidth = 100;
    const mapHeight = 100;

    // Calculate the visible map bounds based on zoom level
    // Adjust range based on zoom - higher zoom = smaller visible area
    const lonRange = 1.0 / Math.pow(2, zoom - 6); // More accurate range calculation
    const latRange = 1.0 / Math.pow(2, zoom - 6);

    // Use currentCenter during dragging for smooth movement
    const activeCenter = isDragging ? currentCenter : center;

    // Calculate relative position within the visible bounds
    const relativeX =
      (coordinates[0] - (activeCenter[0] - lonRange / 2)) / lonRange;
    const relativeY =
      (activeCenter[1] + latRange / 2 - coordinates[1]) / latRange;

    // Convert to percentage (clamp to ensure visibility)
    const x = Math.max(0, Math.min(100, relativeX * mapWidth));
    const y = Math.max(0, Math.min(100, relativeY * mapHeight));

    return { x: `${x}%`, y: `${y}%` };
  };

  // Use currentCenter during dragging for consistent UI positioning
  const activeCenter = isDragging ? currentCenter : center;

  // Calculate map bounds that match the Mapbox static image
  const lonRange = 1.0 / Math.pow(2, zoom - 6);
  const latRange = 1.0 / Math.pow(2, zoom - 6);

  const mapBounds = {
    north: activeCenter[1] + latRange / 2,
    south: activeCenter[1] - latRange / 2,
    east: activeCenter[0] + lonRange / 2,
    west: activeCenter[0] - lonRange / 2,
  };

  const enhancedWeather: EnhancedWeatherData[] = [
    {
      id: 'weather-1',
      condition: 'windy',
      windDirection: 'northwest',
      windSpeed: 15,
      temperature: 22,
      coordinates: [-81.3, -5.0], // Offshore near first hotspot
      intensity: 'high',
    },
    {
      id: 'weather-2',
      condition: 'sunny',
      windDirection: 'west',
      windSpeed: 8,
      temperature: 25,
      coordinates: [-81.5, -5.2], // Offshore mid-range
      intensity: 'medium',
    },
    {
      id: 'weather-3',
      condition: 'cloudy',
      windDirection: 'southwest',
      windSpeed: 12,
      temperature: 20,
      coordinates: [-81.4, -5.4], // Offshore southern area
      intensity: 'medium',
    },
    {
      id: 'weather-4',
      condition: 'rainy',
      windDirection: 'northeast',
      windSpeed: 18,
      temperature: 18,
      coordinates: [-81.6, -5.1], // Further offshore
      intensity: 'high',
    },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, center: [...center] });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !mapRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const mapWidth = mapRef.current.offsetWidth;
    const mapHeight = mapRef.current.offsetHeight;

    const degreesPerPixelLng = 1.0 / Math.pow(2, zoom - 6) / mapWidth;
    const degreesPerPixelLat = 1.0 / Math.pow(2, zoom - 6) / mapHeight;

    const newCenter: [number, number] = [
      dragStart.center[0] - deltaX * degreesPerPixelLng,
      dragStart.center[1] + deltaY * degreesPerPixelLat,
    ];

    // Update currentCenter for real-time UI movement
    setCurrentCenter(newCenter);
  };

  const handleMouseUp = () => {
    if (isDragging && currentCenter) {
      // Finalize the center position
      setCenter(currentCenter);
    }
    setIsDragging(false);
    setDragStart(null);
  };

  const handleMouseLeave = () => {
    if (isDragging && currentCenter) {
      // Finalize the center position
      setCenter(currentCenter);
    }
    setIsDragging(false);
    setDragStart(null);
  };

  return (
    <div
      ref={mapRef}
      className={`relative h-96 bg-slate-900 rounded-lg overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {isLoading && (
        <div className='absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center'>
          <div className='text-white text-sm'>Loading map...</div>
        </div>
      )}

      {error && !isLoading && (
        <div className='absolute top-16 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-xs px-3 py-2 rounded-lg z-50'>
          {error}
        </div>
      )}

      <div className='absolute top-4 right-4 z-10 flex flex-col gap-2'>
        <Button
          size='icon'
          variant='outline'
          className='bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700'
          onClick={handleZoomIn}
        >
          <Plus className='h-4 w-4' />
        </Button>
        <Button
          size='icon'
          variant='outline'
          className='bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm hover:bg-slate-700'
          onClick={handleZoomOut}
        >
          <Minus className='h-4 w-4' />
        </Button>
      </div>

      <img
        src={mapImageUrl || '/placeholder.svg?height=600&width=800'}
        alt='Fishing map'
        className='absolute inset-0 w-full h-full object-cover pointer-events-none'
      />

      {activeHotspots.map((hotspot) => {
        const position = getHotspotPosition(hotspot.coordinates);
        const isVisible =
          hotspot.coordinates[0] >= mapBounds.west &&
          hotspot.coordinates[0] <= mapBounds.east &&
          hotspot.coordinates[1] >= mapBounds.south &&
          hotspot.coordinates[1] <= mapBounds.north;

        // Debug logging for first hotspot
        if (hotspot.id === '1' || hotspot.id === 'ai-hotspot-0') {
          console.log('[v0] Hotspot debug:', {
            id: hotspot.id,
            coordinates: hotspot.coordinates,
            position,
            isVisible,
            mapBounds,
            activeCenter,
          });
        }

        if (!isVisible) return null;

        return (
          <div
            key={hotspot.id}
            className='absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none'
            style={{ left: position.x, top: position.y }}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-150 ${getHotspotColor(
                hotspot.type,
              )} animate-pulse pointer-events-auto`}
              style={{
                boxShadow:
                  '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px currentColor',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotspot(
                  selectedHotspot === hotspot.id ? null : hotspot.id,
                );
              }}
              onMouseDown={(e) => e.stopPropagation()}
            />
            {selectedHotspot === hotspot.id && (
              <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800/95 backdrop-blur-sm rounded-lg p-2 text-white text-xs whitespace-nowrap shadow-xl z-40 pointer-events-auto'>
                <div className='font-semibold mb-1'>{hotspot.name}</div>
                <div className='text-slate-300'>
                  Species: {hotspot.species.join(', ')}
                </div>
                <div className='text-slate-300'>Priority: {hotspot.type}</div>
                {hotspot.probability && (
                  <div className='text-slate-300'>
                    Probability: {(hotspot.probability * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {showWeather && (
        <EnhancedWeatherOverlay
          weatherPoints={enhancedWeather}
          mapBounds={mapBounds}
        />
      )}

      <div className='absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-white text-xs z-10 pointer-events-none'>
        <div className='font-semibold mb-2'>Fishing Hotspots</div>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <div
              className='w-4 h-4 rounded-full bg-pink-500 border-2 border-white shadow-lg'
              style={{ boxShadow: '0 0 8px rgba(236, 72, 153, 0.6)' }}
            />
            <span>High Priority</span>
          </div>
          <div className='flex items-center gap-2'>
            <div
              className='w-4 h-4 rounded-full bg-green-600 border-2 border-white shadow-lg'
              style={{ boxShadow: '0 0 8px rgba(22, 163, 74, 0.6)' }}
            />
            <span>Medium Priority</span>
          </div>
          <div className='flex items-center gap-2'>
            <div
              className='w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg'
              style={{ boxShadow: '0 0 8px rgba(37, 99, 235, 0.6)' }}
            />
            <span>Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
