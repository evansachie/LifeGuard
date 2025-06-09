import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../../components/Help/SearchBox';
import CategoryCard from '../../components/Help/CategoryCard';
import InteractiveGuide from '../../components/Help/InteractiveGuide';
import { IoMdHelp } from 'react-icons/io';
import { helpCategories, HelpCategory } from '../../data/help-categories';

interface HelpProps {
  isDarkMode: boolean;
}

const Help = ({ isDarkMode }: HelpProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearchChange = (query: string): void => {
    setSearchQuery(query);
  };

  const filteredCategories = useMemo((): HelpCategory[] => {
    return helpCategories.filter(
      (category) =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.sections.some(
          (section) =>
            section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery]);

  const toggleActiveCategory = (id: string): void => {
    setActiveCategory((prev) => (prev === id ? null : id));
  };

  const handleStartTour = (): void => {
    localStorage.setItem('showTour', 'true');
    localStorage.setItem('tourInitialized', 'false');
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark-mode' : 'bg-gray-50 text-gray-900'}`}>
      <header className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <IoMdHelp size={32} />
          <h1 className="text-3xl font-bold py-4">Help Center</h1>
        </div>

        <SearchBox
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
