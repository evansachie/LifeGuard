import React, { useRef } from 'react';
import { FaTemperatureHigh } from 'react-icons/fa';
import { IoFootstepsOutline } from "react-icons/io5";
import { MdCo2, MdAir } from "react-icons/md";
import { WiBarometer, WiHumidity } from "react-icons/wi";
import { formatValue, getAQIColor } from '../../utils/dataUtils';
import './Dashboard.css';

// Components
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import FloatingHealthAssistant from '../../components/HealthAssistant/FloatingHealthAssistant';
import { Steps } from 'intro.js-react';
import { dashboardSteps } from '../../utils/tourSteps';
import { useBLE } from '../../contexts/BLEContext';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import DataCard from '../../components/Dashboard/DataCard';
import QuoteCard from '../../components/Dashboard/QuoteCard';
import RemindersCard from '../../components/Dashboard/RemindersCard';
import PollutantsCard from '../../components/Dashboard/PollutantsCard';
import AlertsSection from '../../components/Dashboard/AlertsSection';
import { alerts } from '../../data/alerts';
import BluetoothButton from '../../components/Dashboard/BluetoothButton';

// Custom hooks
import useUserData from '../../hooks/useUserData';
import useQuoteData from '../../hooks/useQuoteData';
import useMemoData from '../../hooks/useMemoData';
import usePollutionData from '../../hooks/usePollutionData';
import useDashboardTour from '../../hooks/useDashboardTour';

function Dashboard({ isDarkMode }) {
    // BLE Context
    const { bleDevice, isConnecting, sensorData, connectToDevice, disconnectDevice } = useBLE();
    
    const { userData, isLoading: dataLoading } = useUserData();
    const { quote, isLoading: quotesLoading } = useQuoteData();
    const { memos: savedMemos, isLoading: memosLoading } = useMemoData();
    const pollutionData = usePollutionData(sensorData);
    const { showTour: showDashboardTour, handleTourExit } = useDashboardTour();
    
    const dashboardRef = useRef(null);

    return (
        <div ref={dashboardRef} className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <DashboardHeader userData={userData} dataLoading={dataLoading} />

            <div className="dashboard-grid">
                <DataCard 
                    title="Atmospheric Temperature"
                    icon={FaTemperatureHigh}
                    value={formatValue(pollutionData.temperature)}
                    unit="°C"
                    className="temperature-card"
                />

                <DataCard 
                    title="Humidity" 
                    icon={WiHumidity}
                    value={formatValue(pollutionData.humidity, 0)} 
                    unit="%"
                    className="humidity-card" 
                />

                <DataCard 
                    title="Atmospheric Pressure" 
                    icon={WiBarometer}
                    value={formatValue(pollutionData.pressure, 0)} 
                    unit=" hPa" 
                    className="pressure-card"
                />

                <DataCard 
                    title="Activities" 
                    icon={IoFootstepsOutline}
                    value={formatValue(pollutionData.steps)} 
                    unit=" K steps"
                    className="wind-card" 
                />

                <QuoteCard 
                    quote={quote} 
                    loading={quotesLoading} 
                    isDarkMode={isDarkMode} 
                />

                <RemindersCard 
                    memos={savedMemos} 
                    loading={memosLoading} 
                    isDarkMode={isDarkMode} 
                />

                <DataCard 
                    title="Air Quality Index" 
                    icon={MdAir}
                    value={formatValue(pollutionData.aqi, 0)} 
                    unit=" ppm"
                    valueColor={getAQIColor(pollutionData.aqi)}
                    className="aqi-card" 
                />

                <DataCard 
                    title="Carbon Dioxide (CO2)" 
                    icon={MdCo2}
                    value={formatValue(pollutionData.co2, 0)} 
                    unit=" ppm" 
                    className="pressure-card"
                />

                <PollutantsCard 
                    pollutionData={pollutionData} 
                    formatValue={formatValue} 
                />
            </div>

            <AlertsSection alerts={alerts} />

            <QuickAccess isDarkMode={isDarkMode} />
            
            <FloatingHealthAssistant isDarkMode={isDarkMode} />            

            <Steps
                enabled={showDashboardTour}
                steps={dashboardSteps}
                initialStep={0}
                onExit={handleTourExit}
                options={{
                    dontShowAgain: false,
                    tooltipClass: isDarkMode ? 'dark-mode' : '',
                    nextLabel: 'Next →',
                    prevLabel: '← Back',
                    doneLabel: 'Got it!',
                    showProgress: true,
                    showBullets: true,
                    overlayOpacity: isDarkMode ? 0.5 : 0.3,
                    exitOnOverlayClick: false,
                    exitOnEsc: false,
                    scrollToElement: true,
                    disableInteraction: false,
                    scrollPadding: 100,
                    positionPrecedence: ['bottom', 'top', 'right', 'left'],
                    highlightClass: isDarkMode ? 'introjs-highlight-dark' : 'introjs-highlight',
                    tooltipPosition: 'auto',
                    showStepNumbers: false
                }}
            />

            <BluetoothButton 
                bleDevice={bleDevice}
                isConnecting={isConnecting}
                connectToDevice={connectToDevice}
                disconnectDevice={disconnectDevice}
            />
        </div>
    );
}

export default Dashboard;