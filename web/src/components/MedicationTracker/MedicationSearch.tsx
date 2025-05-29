import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { searchMedications } from '../../services/medicationSearchService';
import { debounce } from 'lodash';
import { MedicationSearchProps, MedicationSearchItem } from '../../types/medicationTracker.types';

const MedicationSearch: React.FC<MedicationSearchProps> = ({ value, onChange, isDarkMode }) => {
  const [query, setQuery] = useState<string>(value || '');
  const [results, setResults] = useState<MedicationSearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update internal state when parent value changes
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
    }
  }, [value]);

  // Debounce the search function
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      const searchResults = await searchMedications(searchQuery);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setLoading(false);
    }, 500)
  ).current;

  // Trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle selection from dropdown
  const handleSelect = (medication: MedicationSearchItem): void => {
    setQuery(medication.brandName);
    onChange(medication.brandName, medication);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle query change
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onChange(newQuery);
    setActiveIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && query.length >= 2) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < results.length) {
          e.preventDefault();
          handleSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="relative"
        role="combobox"
        aria-expanded={isOpen}
        aria-owns="medication-search-results"
        aria-haspopup="listbox"
        aria-controls="medication-search-results"
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
        </div>

        <input
          ref={inputRef}
          type="text"
          className={`w-full rounded-lg pl-10 p-2.5 border transition-colors ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
              : 'bg-white border-gray-300 focus:border-blue-500'
          }`}
          placeholder="Type to search for medications..."
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          aria-label="Search medications"
          aria-autocomplete="list"
          aria-controls="medication-search-results"
          aria-activedescendant={activeIndex >= 0 ? `medication-${activeIndex}` : undefined}
        />

        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <FaSpinner className="animate-spin text-gray-400" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && (
        <div
          className={`absolute z-10 w-full mt-1 rounded-md shadow-lg 
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
            max-h-60 overflow-auto`}
          role="listbox"
          id="medication-search-results"
        >
          <ul className="py-1 text-sm">
            {results.map((medication, index) => (
              <li
                key={medication.id}
                id={`medication-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`cursor-pointer px-4 py-2 ${
                  index === activeIndex ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''
                } hover:bg-opacity-10
                  ${isDarkMode ? 'hover:bg-white text-gray-200' : 'hover:bg-black text-gray-900'}`}
                onClick={() => handleSelect(medication)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(medication);
                  }
                }}
                tabIndex={-1}
              >
                <div className="font-medium">{medication.brandName}</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {medication.genericName} • {medication.form} • {medication.strength}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MedicationSearch;
