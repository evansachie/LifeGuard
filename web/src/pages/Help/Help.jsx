import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/Help/SearchBar';
import CategoryCard from '../../components/Help/CategoryCard';
import InteractiveGuide from '../../components/Help/InteractiveGuide';
import { helpCategories } from '../../data/help-categories';

const Help = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredCategories = useMemo(() => {
    return helpCategories.filter(category =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.sections.some(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const toggleActiveCategory = (id) => {
    setActiveCategory((prev) => (prev === id ? null : id));
  };

  const handleStartTour = () => {
    localStorage.setItem('showTour', 'true');
    localStorage.setItem('tourInitialized', 'false');
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark-mode' : 'bg-gray-50 text-gray-900'}`}>
      <header className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-4">Help Center</h1>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          isDarkMode={isDarkMode}
        />
      </header>
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
              toggleActive={toggleActiveCategory}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
        <InteractiveGuide onStartTour={handleStartTour} isDarkMode={isDarkMode} />
      </main>
    </div>
  );
};

export default Help;
