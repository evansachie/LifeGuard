import React, { useEffect } from 'react';
import { Source, Layer, useMap } from 'react-map-gl';
import { pollutionZones } from '../../data/pollution-data';
import { getPollutionColor } from '../../utils/getPollutionColor';
import { PollutionZone } from '../../types/pollutionTracker.types';

interface PollutionZonesProps {
  onZoneClick: (zone: PollutionZone) => void;
}

const PollutionZones: React.FC<PollutionZonesProps> = ({ onZoneClick }) => {
  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: mapboxgl.MapMouseEvent): void => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: pollutionZones.map(zone => `zone-${zone.id}`)
      });
      
      if (features.length > 0) {
        const zoneId = features[0].layer.id.replace('zone-', '');
        const clickedZone = pollutionZones.find(zone => `zone-${zone.id}` === features[0].layer.id);
        if (clickedZone) {
          onZoneClick(clickedZone);
        }
      }
    };

    map.on('click', handleMapClick);
    
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onZoneClick]);

  return (
    <>
      {pollutionZones.map((zone) => (
        <Source
          key={zone.id}
          type="geojson"
          data={{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [zone.coordinates[1], zone.coordinates[0]],
            },
            properties: {
              level: zone.level,
            },
          }}
        >
          <Layer
            id={`zone-${zone.id}`}
            type="circle"
            paint={{
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10,
                zone.radius / 100,
                15,
                zone.radius / 50,
              ],
              'circle-color': getPollutionColor(zone.level),
              'circle-opacity': 0.6,
              'circle-blur': 0.5,
            }}
          />
        </Source>
      ))}
    </>
  );
};

export default PollutionZones;
