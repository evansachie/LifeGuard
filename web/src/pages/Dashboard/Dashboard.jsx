import React, { useRef, useState, useEffect, useMemo } from 'react';
import SortableCard from '../../components/Dashboard/SortableCard';
import { FaTemperatureHigh } from 'react-icons/fa';
import { IoFootstepsOutline } from "react-icons/io5";
import { MdCo2, MdAir } from "react-icons/md";
import { WiBarometer, WiHumidity } from "react-icons/wi";
import { formatValue, getAQIColor } from '../../utils/dataUtils';
import './Dashboard.css';
import { matchesShortcut, KEYBOARD_SHORTCUTS } from '../../utils/keyboardShortcuts';
import KeyboardShortcutsHelp from '../../components/Dashboard/KeyboardShortcutsHelp';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';

// Components
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import FloatingHealthAssistant from '../../components/HealthAssistant/FloatingHealthAssistant';
import { Steps } from 'intro.js-react';
import { dashboardSteps } from '../../utils/tourSteps';
import { useBLE } from '../../contexts/BLEContext';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import DashboardControls from '../../components/Dashboard/DashboardControls';
import TimeframeSelector from '../../components/Dashboard/TimeframeSelector';
import StatsSummary from '../../components/Dashboard/StatsSummary';
import DataCard from '../../components/Dashboard/DataCard';
import QuoteCard from '../../components/Dashboard/QuoteCard';
import RemindersCard from '../../components/Dashboard/RemindersCard';
import PollutantsCard from '../../components/Dashboard/PollutantsCard';
import AlertsSection from '../../components/Dashboard/AlertsSection';
import { alerts, getAlertsByTimeframe } from '../../data/alerts';
import BluetoothButton from '../../components/Dashboard/BluetoothButton';

// Custom hooks
import useUserData from '../../hooks/useUserData';
import useQuoteData from '../../hooks/useQuoteData';
import useMemoData from '../../hooks/useMemoData';
import usePollutionData from '../../hooks/usePollutionData';
import useDashboardTour from '../../hooks/useDashboardTour';

function Dashboard({ isDarkMode }) {
    const [cardOrder, setCardOrder] = useState(() => {
        const savedOrder = localStorage.getItem('dashboardCardOrder');
        return savedOrder ? JSON.parse(savedOrder) : [
            'temperature', 'humidity', 'pressure', 'activities',
            'quote', 'reminders', 'aqi', 'co2', 'pollutants'
        ];
    });

    // Save card order to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('dashboardCardOrder', JSON.stringify(cardOrder));
    }, [cardOrder]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setCardOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    // BLE Context
    const { bleDevice, isConnecting, sensorData, connectToDevice, disconnectDevice } = useBLE();
    
    const { userData, isLoading: dataLoading } = useUserData();
    const { quote, isLoading: quotesLoading } = useQuoteData();
    const { memos: savedMemos, isLoading: memosLoading } = useMemoData();
    const pollutionData = usePollutionData(sensorData);
    const { showTour: showDashboardTour, handleTourExit } = useDashboardTour();
    
    // Dashboard UI state
    const [timeframe, setTimeframe] = useState('today');
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAlerts, setFilteredAlerts] = useState(alerts);
    const [filterOptions, setFilterOptions] = useState({
        temperature: true,
        humidity: true,
        airQuality: true,
        alerts: true
    });
    const [sortOption, setSortOption] = useState('newest');
    const [visibleCards, setVisibleCards] = useState({
        temperature: true,
        humidity: true,
        pressure: true,
        activities: true,
        quote: true,
        reminders: true,
        aqi: true,
        co2: true,
        pollutants: true
    });
    
    const dashboardRef = useRef(null);
    const controlsRef = useRef(null);
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

    useEffect(() => {
        let timeframeAlerts = getAlertsByTimeframe(timeframe);
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            timeframeAlerts = timeframeAlerts.filter(alert => 
                alert.message.toLowerCase().includes(query) ||
                alert.type.toLowerCase().includes(query)
            );
        }
        
        setFilteredAlerts(timeframeAlerts);
        
        setVisibleCards({
            temperature: filterOptions.temperature,
            humidity: filterOptions.temperature,
            pressure: filterOptions.temperature,
            activities: true,
            quote: true,
            reminders: true,
            aqi: filterOptions.airQuality,
            co2: filterOptions.airQuality,
            pollutants: filterOptions.airQuality
        });
    }, [searchQuery, timeframe, filterOptions]);

    // Event handlers
    const handleTimeframeChange = (newTimeframe) => {
        setTimeframe(newTimeframe);
    };
    
    const handleViewChange = (newView) => {
        setViewMode(newView);
    };
    
    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };
    
    const handleFilterChange = (filterType, isChecked) => {
        setFilterOptions(prev => ({
            ...prev,
            [filterType]: isChecked
        }));
    };
    
    const handleSortChange = (sortType) => {
        setSortOption(sortType);
    };
    
    const filteredDashboard = useMemo(() => {
        return {
            showTemperature: visibleCards.temperature && (!searchQuery || 'temperature'.includes(searchQuery.toLowerCase())),
            showHumidity: visibleCards.humidity && (!searchQuery || 'humidity'.includes(searchQuery.toLowerCase())),
            showPressure: visibleCards.pressure && (!searchQuery || 'pressure'.includes(searchQuery.toLowerCase())),
            showActivities: visibleCards.activities && (!searchQuery || 'activities steps'.includes(searchQuery.toLowerCase())),
            showQuote: visibleCards.quote,
            showReminders: visibleCards.reminders,
            showAqi: visibleCards.aqi && (!searchQuery || 'air quality aqi'.includes(searchQuery.toLowerCase())),
            showCo2: visibleCards.co2 && (!searchQuery || 'co2 carbon dioxide'.includes(searchQuery.toLowerCase())),
            showPollutants: visibleCards.pollutants && (!searchQuery || 'pollutants pm2.5 pm10 no2'.includes(searchQuery.toLowerCase()))
        };
    }, [visibleCards, searchQuery]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Only handle keyboard shortcuts if no input is focused (except for '/' key)
            const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
            
            if (isInputFocused && event.key !== '/') return;
            
            // Handle each keyboard shortcut
            if (matchesShortcut(event, KEYBOARD_SHORTCUTS.SEARCH)) {
                event.preventDefault();
                controlsRef.current?.focusSearch();
            } else if (matchesShortcut(event, KEYBOARD_SHORTCUTS.TOGGLE_GRID)) {
                event.preventDefault();
                handleViewChange('grid');
            } else if (matchesShortcut(event, KEYBOARD_SHORTCUTS.TOGGLE_LIST)) {
                event.preventDefault();
                handleViewChange('list');
            } else if (matchesShortcut(event, KEYBOARD_SHORTCUTS.TOGGLE_FILTER)) {
                event.preventDefault();
                controlsRef.current?.toggleFilter();
            } else if (matchesShortcut(event, KEYBOARD_SHORTCUTS.TOGGLE_SORT)) {
                event.preventDefault();
                controlsRef.current?.toggleSort();
            } else if (matchesShortcut(event, KEYBOARD_SHORTCUTS.HELP)) {
                event.preventDefault();
                setShowKeyboardShortcuts(prev => !prev);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleShowShortcuts = () => {
        setShowKeyboardShortcuts(true);
    };

    return (
        <div ref={dashboardRef} className={`dashboard ${isDarkMode ? 'dark-mode' : ''} ${viewMode}-view`}>
            <DashboardHeader userData={userData} dataLoading={dataLoading} />
            
            <div className="dropdown-container-layer" style={{ position: 'relative', zIndex: 50 }}>
                <DashboardControls 
                    ref={controlsRef}
                    isDarkMode={isDarkMode} 
                    onSearchChange={handleSearchChange} 
                    onViewChange={handleViewChange}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    filterOptions={filterOptions}
                    sortOption={sortOption}
                    viewMode={viewMode}
                    onShowShortcuts={handleShowShortcuts}
                />
            </div>
            
            <TimeframeSelector 
                isDarkMode={isDarkMode} 
                selectedTimeframe={timeframe} 
                onTimeframeChange={handleTimeframeChange} 
            />
            
            <StatsSummary 
                isDarkMode={isDarkMode} 
                stats={{
                    readings: 124,
                    alerts: filteredAlerts.length,
                    notifications: 5,
                    tasks: savedMemos?.filter(memo => !memo.Done).length || 0
                }}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={cardOrder}
                    strategy={rectSortingStrategy}
                >
                    <div className={`dashboard-grid ${viewMode === 'list' ? 'list-layout' : ''}`}>
                            {cardOrder.map((cardId) => {
                                switch (cardId) {
                                    case 'temperature':
                                        return filteredDashboard.showTemperature && (
                                            <SortableCard key={cardId} id={cardId}>
                                                <DataCard 
                                                    title="Atmospheric Temperature" 
                                                    icon={FaTemperatureHigh}
                                                    value={formatValue(pollutionData.temperature)} 
                                                    unit="°C" 
                                                    className="temperature-card"
                                                />
                                            </SortableCard>
                                        );
                                    case 'humidity':
                                        return filteredDashboard.showHumidity && (
                                            <SortableCard key={cardId} id={cardId}>
                                                <DataCard 
                                                    title="Humidity" 
                                                    icon={WiHumidity}
                                                    value={formatValue(pollutionData.humidity)} 
                                                    unit="%" 
                                                    className="humidity-card"
                                                />
                                            </SortableCard>
                                        );
                                    case 'pressure':
                                        return filteredDashboard.showPressure && (
                                            <SortableCard key={cardId} id={cardId}>
                                                <DataCard 
                                                    title="Atmospheric Pressure" 
                                                    icon={WiBarometer}
                                                    value={formatValue(pollutionData.pressure)} 
                                                    unit=" hPa" 
                                                    className="pressure-card"
                                                />
                                            </SortableCard>
                                        );
                                    case 'activities':
                                        return filteredDashboard.showActivities && (
                                            <SortableCard key={cardId} id={cardId}>
                                                <DataCard 
                                                    title="Activities" 
                                                    icon={IoFootstepsOutline}
                                                    value={formatValue(pollutionData.steps)} 
                                                    unit=" K steps"
                                                    className="wind-card" 
                                                />
                                            </SortableCard>
                                        );
                                    case 'quote':
                                        return filteredDashboard.showQuote && (
                                            <SortableCard key={cardId} id={cardId}>
                                                <QuoteCard 
                                                    quote={quote} 
                                                    loading={quotesLoading} 
                                                    isDarkMode={isDarkMode} 
                                                />
                                            </SortableCard>
                                        );
                                    case 'reminders':
                                        return filteredDashboard.showReminders && (
                                            <SortableCard key={cardId} id={cardId}>
                                                <RemindersCard 
                                                    memos={savedMemos} 
                                                    loading={memosLoading} 
                                                    isDarkMode={isDarkMode} 
                                                />
                                            </SortableCard>
                                        );
                                    case 'aqi':
                                        return filteredDashboard.showAqi && (
                                            <SortableCard key={cardId} id={cardId}>
                                                <DataCard 
                                                    title="Air Quality Index" 
                                                    icon={MdAir}
                                                    value={formatValue(pollutionData.aqi, 0)} 
                                                    unit=" ppm"
                                                    valueColor={getAQIColor(pollutionData.aqi)}
                                                    className="aqi-card" 
                                                />
                                            </SortableCard>
                                        );
                                    case 'co2':
                                        return filteredDashboard.showCo2 && (
                                            <SortableCard key={cardId} id={cardId}>
                                                <DataCard 
                                                    title="Carbon Dioxide (CO2)" 
                                                    icon={MdCo2}
                                                    value={formatValue(pollutionData.co2, 0)} 
                                                    unit=" ppm" 
                                                    className="pressure-card"
                                                />
                                            </SortableCard>
                                        );
                                    case 'pollutants':
                                        return filteredDashboard.showPollutants && (
                                            <SortableCard key={cardId} id={cardId}>
                                                <PollutantsCard 
                                                    pollutionData={pollutionData} 
                                                    formatValue={formatValue} 
                                                />
                                            </SortableCard>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                </SortableContext>
            </DndContext>

            {filterOptions.alerts && (
                <AlertsSection alerts={filteredAlerts} />
            )}

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

            <KeyboardShortcutsHelp 
                isVisible={showKeyboardShortcuts}
                onClose={() => setShowKeyboardShortcuts(false)}
                isDarkMode={isDarkMode}
            />
        </div>
    );
}

export default Dashboard;
