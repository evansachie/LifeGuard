import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaListUl,
  FaTh,
  FaChevronDown,
  FaKeyboard,
} from 'react-icons/fa';
import {
  DashboardControlsProps,
  DashboardControlsRef,
  FilterOptions,
  SortOption,
} from '../../types/common.types';
import { ariaExpanded } from '../../utils/accessibilityUtils';
import './DashboardControls.css';

const DashboardControls = forwardRef<DashboardControlsRef, DashboardControlsProps>(
  function DashboardControls(
    {
      isDarkMode,
      onSearchChange,
      onViewChange,
      onFilterChange,
      onSortChange,
      onShowShortcuts,
      filterOptions = {
        temperature: true,
        humidity: true,
        airQuality: true,
        alerts: true,
      },
      sortOption = 'newest',
      viewMode = 'grid',
    },
    ref
  ) {
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [localFilters, setLocalFilters] = useState<FilterOptions>(filterOptions);
    const [localSort, setLocalSort] = useState<SortOption>(sortOption);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);
    const filterBtnRef = useRef<HTMLButtonElement>(null);
    const sortBtnRef = useRef<HTMLButtonElement>(null);
    const controlsRightRef = useRef<HTMLDivElement>(null);
    const controlsContainerRef = useRef<HTMLDivElement>(null);

    // Detect mobile screen size and overflow
    useEffect(() => {
      const checkResponsive = () => {
        const width = window.innerWidth;
        setIsMobile(width <= 768);

        // Check if controls are overflowing
        if (controlsRightRef.current) {
          const container = controlsRightRef.current;
          const isOverflow = container.scrollWidth > container.clientWidth;
          setIsOverflowing(isOverflow);
          container.setAttribute('data-overflowing', isOverflow.toString());
        }
      };

      checkResponsive();

      const resizeObserver = new ResizeObserver(checkResponsive);
      if (controlsContainerRef.current) {
        resizeObserver.observe(controlsContainerRef.current);
      }

      window.addEventListener('resize', checkResponsive);

      return () => {
        window.removeEventListener('resize', checkResponsive);
        resizeObserver.disconnect();
      };
    }, []);

    // Check for sidebar state changes
    useEffect(() => {
      const checkSidebarState = () => {
        const sidebarActive = document.querySelector('.sidebar')?.classList.contains('active');
        if (controlsContainerRef.current) {
          controlsContainerRef.current.classList.toggle('sidebar-active', !!sidebarActive);
        }
      };

      checkSidebarState();

      // Listen for sidebar state changes
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

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      focusSearch: () => {
        searchInputRef.current?.focus();
      },
      toggleFilter: () => {
        toggleFilterMenu();
        filterBtnRef.current?.focus();
      },
      toggleSort: () => {
        toggleSortMenu();
        sortBtnRef.current?.focus();
      },
    }));

    // Update local state when props change
    useEffect(() => {
      setLocalFilters(filterOptions);
    }, [filterOptions]);

    useEffect(() => {
      setLocalSort(sortOption);
    }, [sortOption]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;
      setSearchValue(value);
      if (onSearchChange) {
        onSearchChange(value);
      }
    };

    const toggleFilterMenu = (): void => {
      setIsSortMenuOpen(false);
      setTimeout(() => {
        setIsFilterMenuOpen(!isFilterMenuOpen);
      }, 10);
    };

    const toggleSortMenu = (): void => {
      setIsFilterMenuOpen(false);
      setTimeout(() => {
        setIsSortMenuOpen(!isSortMenuOpen);
      }, 10);
    };

    const handleFilterOptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { id, checked } = e.target;
      const newFilters = {
        ...localFilters,
        [id]: checked,
      };
      setLocalFilters(newFilters);
      if (onFilterChange) {
        onFilterChange(id, checked);
      }
    };

    const handleSortOptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { id } = e.target;
      setLocalSort(id as SortOption);
      if (onSortChange) {
        onSortChange(id as SortOption);
      }
    };

    const handleViewChange = (view: 'grid' | 'list'): void => {
      if (onViewChange) {
        onViewChange(view);
      }
    };

    // Close menus when clicking outside or on mobile when orientation changes
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent): void => {
        const target = event.target as HTMLElement;

        if (isFilterMenuOpen && !target.closest('.filter-container')) {
          setIsFilterMenuOpen(false);
        }

        if (isSortMenuOpen && !target.closest('.sort-container')) {
          setIsSortMenuOpen(false);
        }
      };

      const handleOrientationChange = (): void => {
        if (isMobile) {
          setIsFilterMenuOpen(false);
          setIsSortMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('orientationchange', handleOrientationChange);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('orientationchange', handleOrientationChange);
      };
    }, [isFilterMenuOpen, isSortMenuOpen, isMobile]);

    // Auto-scroll to active button on mobile
    const scrollToActiveButton = (buttonRef: React.RefObject<HTMLButtonElement>) => {
      if ((isMobile || isOverflowing) && controlsRightRef.current && buttonRef.current) {
        buttonRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    };

    const handleFilterToggle = () => {
      toggleFilterMenu();
      scrollToActiveButton(filterBtnRef);
    };

    const handleSortToggle = () => {
      toggleSortMenu();
      scrollToActiveButton(sortBtnRef);
    };

    return (
      <div
        ref={controlsContainerRef}
        className={`dashboard-controls ${isDarkMode ? 'dark-mode' : ''}`}
      >
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={isMobile ? 'Search...' : 'Search dashboard... (Press / to focus)'}
            value={searchValue}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search dashboard"
          />
        </div>

        <div ref={controlsRightRef} className="controls-right" data-overflowing={isOverflowing}>
          <div className="filter-container">
            <button
              ref={filterBtnRef}
              className={`control-btn ${isFilterMenuOpen ? 'active' : ''}`}
              onClick={handleFilterToggle}
              title="Filter (Ctrl+F)"
              aria-label="Toggle filter menu"
              {...ariaExpanded(isFilterMenuOpen)}
              aria-controls="filter-menu"
              type="button"
            >
              <FaFilter /> {!isMobile && <span>Filter</span>} <FaChevronDown />
            </button>

            {isFilterMenuOpen && (
              <div
                id="filter-menu"
                className="dropdown-menu filter-menu"
                role="group"
                aria-label="Filter options"
              >
                <div className="filter-option">
                  <input
                    type="checkbox"
                    id="temperature"
                    checked={localFilters.temperature}
                    onChange={handleFilterOptionChange}
                    aria-labelledby="temperature-label"
                  />
                  <label
                    id="temperature-label"
                    htmlFor="temperature"
                    className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    Temperature & Weather
                  </label>
                </div>
                <div className="filter-option">
                  <input
                    type="checkbox"
                    id="airQuality"
                    checked={localFilters.airQuality}
                    onChange={handleFilterOptionChange}
                    aria-labelledby="airQuality-label"
                  />
                  <label
                    id="airQuality-label"
                    htmlFor="airQuality"
                    className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    Air Quality
                  </label>
                </div>
                <div className="filter-option">
                  <input
                    type="checkbox"
                    id="alerts"
                    checked={localFilters.alerts}
                    onChange={handleFilterOptionChange}
                    aria-labelledby="alerts-label"
                  />
                  <label
                    id="alerts-label"
                    htmlFor="alerts"
                    className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    Alerts
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="sort-container">
            <button
              ref={sortBtnRef}
              className={`control-btn ${isSortMenuOpen ? 'active' : ''}`}
              onClick={handleSortToggle}
              title="Sort (Ctrl+S)"
              aria-label="Toggle sort menu"
              {...ariaExpanded(isSortMenuOpen)}
              aria-controls="sort-menu"
              type="button"
            >
              <FaSortAmountDown /> {!isMobile && <span>Sort</span>} <FaChevronDown />
            </button>

            {isSortMenuOpen && (
              <div
                id="sort-menu"
                className="dropdown-menu sort-menu"
                role="radiogroup"
                aria-label="Sort options"
              >
                <div className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    id="newest"
                    checked={localSort === 'newest'}
                    onChange={handleSortOptionChange}
                    aria-labelledby="newest-label"
                  />
                  <label
                    id="newest-label"
                    htmlFor="newest"
                    className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    Newest First
                  </label>
                </div>
                <div className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    id="oldest"
                    checked={localSort === 'oldest'}
                    onChange={handleSortOptionChange}
                    aria-labelledby="oldest-label"
                  />
                  <label
                    id="oldest-label"
                    htmlFor="oldest"
                    className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    Oldest First
                  </label>
                </div>
                <div className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    id="priority"
                    checked={localSort === 'priority'}
                    onChange={handleSortOptionChange}
                    aria-labelledby="priority-label"
                  />
                  <label
                    id="priority-label"
                    htmlFor="priority"
                    className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    Priority
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewChange('grid')}
              title="Grid View (Ctrl+G)"
              aria-label="Switch to grid view"
              type="button"
            >
              <FaTh />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewChange('list')}
              title="List View (Ctrl+L)"
              aria-label="Switch to list view"
              type="button"
            >
              <FaListUl />
            </button>
          </div>

          <button
            className="shortcuts-btn"
            onClick={onShowShortcuts}
            title="Keyboard Shortcuts (?)"
            aria-label="Show keyboard shortcuts"
            type="button"
          >
            <FaKeyboard />
          </button>
        </div>
      </div>
    );
  }
);

export default DashboardControls;
