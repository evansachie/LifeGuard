import React from 'react';
import { Source, Layer } from 'react-map-gl';
import { pollutionZones } from '../../data/pollution-data';
import { getPollutionColor } from '../../utils/getPollutionColor';

const PollutionZones = ({ onZoneClick }) => {
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
              coordinates: [zone.coordinates[1], zone.coordinates[0]]
            },
            properties: {
              level: zone.level
            }
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
                10, zone.radius / 100,
                15, zone.radius / 50
              ],
              'circle-color': getPollutionColor(zone.level),
              'circle-opacity': 0.6,
              'circle-blur': 0.5,
            }}
            // Note: Layer components don’t directly support onClick.
            // For actual feature selection, you’d typically add a click handler on the Map
            // and query the rendered features.
            onClick={() => onZoneClick(zone)}
          />
        </Source>
      ))}
    </>
  );
};

export default PollutionZones;
