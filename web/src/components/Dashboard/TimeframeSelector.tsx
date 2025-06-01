import React, { memo, useEffect, useRef, useState } from 'react';
import { TimeframeSelectorProps, TimeframeData } from '../../types/common.types';
import './TimeframeSelector.css';

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onTimeframeChange,
  isDarkMode,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const timeframes: TimeframeData[] = [
    { value: 'today', label: 'Today', shortLabel: 'Today' },
    { value: 'week', label: 'This Week', shortLabel: 'Week' },
    { value: 'month', label: 'This Month', shortLabel: 'Month' },
    { value: 'year', label: 'This Year', shortLabel: 'Year' },
    { value: 'all', label: 'All Time', shortLabel: 'All' },
  ];

  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);

      if (buttonsRef.current) {
        const container = buttonsRef.current;
        const isOverflow = container.scrollWidth > container.clientWidth;
        setIsOverflowing(isOverflow);
      }
    };

    checkResponsive();

    const resizeObserver = new ResizeObserver(checkResponsive);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', checkResponsive);

    return () => {
      window.removeEventListener('resize', checkResponsive);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const checkSidebarState = () => {
      const sidebarActive = document.querySelector('.sidebar')?.classList.contains('active');
      if (containerRef.current) {
        containerRef.current.classList.toggle('sidebar-active', !!sidebarActive);
      }
    };

    checkSidebarState();

    const observer = new MutationObserver(checkSidebarState);
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => observer.disconnect();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = timeframes.findIndex((tf) => tf.value === selectedTimeframe);
      const nextIndex =
        e.key === 'ArrowRight'
          ? Math.min(currentIndex + 1, timeframes.length - 1)
          : Math.max(currentIndex - 1, 0);

      if (nextIndex !== currentIndex) {
        onTimeframeChange(timeframes[nextIndex].value);

        setTimeout(() => {
          const activeButton = buttonsRef.current?.querySelector(
            '.timeframe-btn.active'
          ) as HTMLElement;
          if (activeButton && isOverflowing) {
            activeButton.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center',
            });
          }
        }, 50);
      }
    }
  };

  const handleTimeframeClick = (timeframeValue: TimeframeData['value']) => {
    onTimeframeChange(timeframeValue);

    if (isOverflowing && buttonsRef.current) {
      setTimeout(() => {
        const activeButton = buttonsRef.current?.querySelector(
          '.timeframe-btn.active'
        ) as HTMLElement;
        if (activeButton) {
          activeButton.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      }, 50);
    }
  };

  return (
    <div ref={containerRef} className={`timeframe-selector ${isDarkMode ? 'dark-mode' : ''}`}>
      <span className="timeframe-label" id="timeframe-label">
        {isMobile ? 'Period:' : 'Time Period:'}
      </span>

      <div className={`timeframe-buttons-container ${isOverflowing ? 'overflowing' : ''}`}>
        <div
          ref={buttonsRef}
          className={`timeframe-buttons ${isOverflowing && isMobile ? 'timeframe-buttons-overflow' : ''}`}
          role="radiogroup"
          aria-labelledby="timeframe-label"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.value}
              className={`timeframe-btn ${selectedTimeframe === timeframe.value ? 'active' : ''}`}
              onClick={() => handleTimeframeClick(timeframe.value)}
              role="radio"
              aria-checked={selectedTimeframe === timeframe.value}
              aria-labelledby="timeframe-label"
              aria-label={`${timeframe.label} timeframe`}
              type="button"
            >
              {isMobile && timeframe.shortLabel ? timeframe.shortLabel : timeframe.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(TimeframeSelector);
