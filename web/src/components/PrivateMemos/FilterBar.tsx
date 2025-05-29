import React from 'react';
import { MdSort } from 'react-icons/md';

export type FilterType = 'all' | 'active' | 'completed';
export type SortOrderType = 'newest' | 'oldest' | 'alphabetical';

interface FilterBarProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  sortOrder: SortOrderType;
  setSortOrder: (sortOrder: SortOrderType) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter, sortOrder, setSortOrder }) => {
  return (
    <div className="filters-bar">
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="sort-controls">
        <div className="sort-dropdown">
          <button className="sort-button">
            <MdSort /> Sort: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
          </button>
          <div className="sort-dropdown-content">
            <button
              className={sortOrder === 'newest' ? 'active' : ''}
              onClick={() => setSortOrder('newest')}
            >
              Newest First
            </button>
            <button
              className={sortOrder === 'oldest' ? 'active' : ''}
              onClick={() => setSortOrder('oldest')}
            >
              Oldest First
            </button>
            <button
              className={sortOrder === 'alphabetical' ? 'active' : ''}
              onClick={() => setSortOrder('alphabetical')}
            >
              Alphabetical
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
