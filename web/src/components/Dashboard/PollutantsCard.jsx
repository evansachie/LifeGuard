import React from 'react';
import { WiDust } from 'react-icons/wi';
import DataCard from './DataCard';

const PollutantsCard = ({ pollutionData, formatValue }) => {
    return (
        <DataCard title="Pollutants" icon={WiDust} className="pollutants-card">
            <div className="pollutants-grid">
                <div className="pollutant">
                    <span>PM2.5</span>
                    <span>{formatValue(pollutionData.pm25)} µg/m³</span>
                </div>
                <div className="pollutant">
                    <span>PM10</span>
                    <span>{formatValue(pollutionData.pm10)} µg/m³</span>
                </div>
                <div className="pollutant">
                    <span>NO₂</span>
                    <span>{formatValue(pollutionData.no2)} ppb</span>
                </div>
            </div>
        </DataCard>
    );
};

export default PollutantsCard;
