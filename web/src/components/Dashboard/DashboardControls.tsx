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
import { DashboardControlsProps, DashboardControlsRef, FilterOptions, SortOption } from '../../types/common.types';
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
    
    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);
    const filterBtnRef = useRef<HTMLButtonElement>(null);
    const sortBtnRef = useRef<HTMLButtonElement>(null);

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
      // Close sort menu first to avoid z-index conflicts
      setIsSortMenuOpen(false);

      // Small timeout to ensure proper rendering
      setTimeout(() => {
        setIsFilterMenuOpen(!isFilterMenuOpen);
      }, 10);
    };

    const toggleSortMenu = (): void => {
      // Close filter menu first to avoid z-index conflicts
      setIsFilterMenuOpen(false);

      // Small timeout to ensure proper rendering
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

    // Close menus when clicking outside
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

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isFilterMenuOpen, isSortMenuOpen]);

    return (
      <div className={`dashboard-controls ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search dashboard... (Press / to focus)"
            value={searchValue}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search dashboard"
          />
        </div>

        <div className="controls-right">
          <div className="filter-container">
            <button
              ref={filterBtnRef}
              className={`control-btn ${isFilterMenuOpen ? 'active' : ''}`}
              onClick={toggleFilterMenu}
              title="Filter (Ctrl+F)"
              aria-label="Toggle filter menu"
              aria-expanded={isFilterMenuOpen}
            >
              <FaFilter /> <span>Filter</span> <FaChevronDown />
            </button>

            {isFilterMenuOpen && (
              <div className="dropdown-menu filter-menu" role="menu">
                <div className="filter-option">
                  <input
                    type="checkbox"
                    id="temperature"
                    checked={localFilters.temperature}
                    onChange={handleFilterOptionChange}
                  />
                  <div
                    className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    Temperature & Weather
                  </div>
                </div>
                <div className="filter-option">
                  <input
                    type="checkbox"
                    id="airQuality"
                    checked={localFilters.airQuality}
                    onChange={handleFilterOptionChange}
                  />
                  <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Air Quality
                  </div>
                </div>
                <div className="filter-option">
                  <input
                    type="checkbox"
                    id="alerts"
                    checked={localFilters.alerts}
                    onChange={handleFilterOptionChange}
                  />
                  <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Alerts
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="sort-container">
            <button
              ref={sortBtnRef}
              className={`control-btn ${isSortMenuOpen ? 'active' : ''}`}
              onClick={toggleSortMenu}
              title="Sort (Ctrl+S)"
              aria-label="Toggle sort menu"
              aria-expanded={isSortMenuOpen}
            >
              <FaSortAmountDown /> <span>Sort</span> <FaChevronDown />
            </button>

            {isSortMenuOpen && (
              <div className="dropdown-menu sort-menu" role="menu">
                <div className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    id="newest"
                    checked={localSort === 'newest'}
                    onChange={handleSortOptionChange}
                  />
                  <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Newest First
                  </div>
                </div>
                <div className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    id="oldest"
                    checked={localSort === 'oldest'}
                    onChange={handleSortOptionChange}
                  />
                  <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Oldest First
                  </div>
                </div>
                <div className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    id="priority"
                    checked={localSort === 'priority'}
                    onChange={handleSortOptionChange}
                  />
                  <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Priority
                  </div>
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
            >
              <FaTh />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewChange('list')}
              title="List View (Ctrl+L)"
              aria-label="Switch to list view"
            >
              <FaListUl />
            </button>
          </div>

          <button
            className="shortcuts-btn"
            onClick={onShowShortcuts}
            title="Keyboard Shortcuts (?)"
            aria-label="Show keyboard shortcuts"
          >
            <FaKeyboard />
          </button>
        </div>
      </div>
    );
  }
);

export default DashboardControls;
