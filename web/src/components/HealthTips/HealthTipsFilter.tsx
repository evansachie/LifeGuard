import { FaThLarge } from 'react-icons/fa';
import { CategoryType } from '../../types/healthTips.types';
import { ariaPressed } from '../../utils/accessibilityUtils';
import './HealthTipsFilter.css';

interface HealthTipsFilterProps {
  categories: CategoryType[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  isDarkMode: boolean;
  onSortChange?: (sortOption: string) => void;
  currentSort?: string;
}

const HealthTipsFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  isDarkMode,
}: HealthTipsFilterProps) => {
  return (
    <div className={`health-tips-filter ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="filter-categories">
        <button
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
          {...ariaPressed(selectedCategory === 'all')}
          type="button"
        >
          <FaThLarge />
          <span className="category-label">All</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            aria-label={`Filter by ${category.label}`}
            {...ariaPressed(selectedCategory === category.id)}
            type="button"
          >
            {category.icon}
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HealthTipsFilter;
