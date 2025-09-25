import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import {
  FiSettings,
  FiUser,
  FiHome,
  FiActivity,
  FiHeart,
  FiAlertTriangle,
  FiClock,
  FiBluetooth,
  FiSun,
  FiMoon,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
interface CommandItem {
  id: string;
  name: string;
  icon: IconType;
  action: () => void;
  shortcut?: string;
  category?: string;
}

interface CommandGroup {
  category: string;
  items: CommandItem[];
}

interface CommandPaletteProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CommandPalette = ({ isDarkMode, toggleTheme, open, setOpen }: CommandPaletteProps) => {
  const [search, setSearch] = useState<string>('');
  const [, setPages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<CommandItem[]>(() => {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  });
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<CommandGroup[]>(
    () => [
      {
        category: 'Navigation',
        items: [
          {
            id: 'dashboard',
            name: 'Dashboard',
            icon: FiHome,
            action: () => navigate('/dashboard'),
          },
          { id: 'profile', name: 'Profile', icon: FiUser, action: () => navigate('/profile') },
          {
            id: 'settings',
            name: 'Settings',
            icon: FiSettings,
            action: () => navigate('/settings'),
          },
        ],
      },
      {
        category: 'Health',
        items: [
          {
            id: 'health-metrics',
            name: 'Log Health Metrics',
            icon: FiActivity,
            action: () => navigate('/health-metrics'),
          },
          {
            id: 'medication',
            name: 'Medication Tracker',
            icon: FiClock,
            action: () => navigate('/medications'),
          },
          {
            id: 'health-report',
            name: 'Health Report',
            icon: FiHeart,
            action: () => navigate('/health-report'),
          },
        ],
      },
      {
        category: 'Quick Actions',
        items: [
          {
            id: 'theme',
            name: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            icon: isDarkMode ? FiSun : FiMoon,
            action: toggleTheme,
            shortcut: 'Ctrl+Shift+L',
          },
          {
            id: 'emergency',
            name: 'Send Emergency Alert',
            icon: FiAlertTriangle,
            action: () => navigate('/emergency-contacts'),
            shortcut: 'Ctrl+E',
          },
          {
            id: 'bluetooth',
            name: 'Connect BLE Device',
            icon: FiBluetooth,
            action: () => window.dispatchEvent(new CustomEvent('connect-ble')),
            shortcut: 'Ctrl+B',
          },
        ],
      },
    ],
    [navigate, isDarkMode, toggleTheme]
  );

  // Fuzzy search setup
  const fuse = useMemo(() => {
    const items = commands.flatMap((category) =>
      category.items.map((item) => ({
        ...item,
        category: category.category,
      }))
    );
    return new Fuse(items, {
      keys: ['name', 'category'],
      threshold: 0.4,
    });
  }, [commands]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const results = fuse.search(search);
    return [
      {
        category: 'Results',
        items: results.map((result) => result.item),
      },
    ];
  }, [search, commands, fuse]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      try {
        item.action();
      } catch (error) {
        console.error('Error executing command:', error);
      }

      setOpen(false);

      setRecentSearches((prev) => {
        const newSearches = [item, ...prev.filter((i) => i.id !== item.id)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        return newSearches;
      });
    },
    [setOpen]
  );

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch('');
      setPages([]);
    } else {
      // Focus input when dialog opens, but with a small delay to ensure it's rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Close the palette when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => {
          const allItems =
            search.trim() === '' && recentSearches.length > 0
              ? recentSearches
              : filteredCommands.flatMap((group) => group.items);
          return prev < allItems.length - 1 ? prev + 1 : 0;
        });
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => {
          const allItems =
            search.trim() === '' && recentSearches.length > 0
              ? recentSearches
              : filteredCommands.flatMap((group) => group.items);
          return prev > 0 ? prev - 1 : allItems.length - 1;
        });
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const allItems =
          search.trim() === '' && recentSearches.length > 0
            ? recentSearches
            : filteredCommands.flatMap((group) => group.items);
        if (selectedIndex >= 0 && selectedIndex < allItems.length) {
          handleSelect(allItems[selectedIndex]);
        }
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen, selectedIndex, search, recentSearches, filteredCommands, handleSelect]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [search]);

  const handleItemKeyDown = (event: React.KeyboardEvent, item: CommandItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(item);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
    >
      <div
        ref={contentRef}
        className={`w-full max-w-xl mx-auto overflow-hidden ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'
        } rounded-xl shadow-2xl`}
      >
        <div className="command-wrapper">
          <div className="sr-only" id="command-palette-title">
            Command Palette
          </div>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className={`w-full p-4 text-lg border-b ${
              isDarkMode
                ? 'bg-gray-900 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-800'
            } focus:outline-none`}
            aria-label="Search for commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
          />

          <div
            id="command-list"
            className={`overflow-y-auto max-h-[60vh] p-2 ${
              isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'
            }`}
            role="listbox"
            aria-label="Available commands"
          >
            {search.trim() === '' && recentSearches.length > 0 && (
              <div>
                <div
                  className={`px-2 py-1 text-xs uppercase tracking-wider font-semibold ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                  role="group"
                  aria-label="Recent commands"
                >
                  Recent
                </div>
                {recentSearches.map((item, index) => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-2 px-3 py-2 my-1 cursor-pointer rounded-md transition-colors text-left
                      ${
                        isDarkMode
                          ? 'hover:bg-gray-800 text-gray-200 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          : 'hover:bg-gray-100 text-gray-700 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      }
                      ${selectedIndex === index ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}
                    onClick={() => handleSelect(item)}
                    onKeyDown={(e) => handleItemKeyDown(e, item)}
                    role="option"
                    aria-label={`Execute ${item.name}`}
                    aria-selected={selectedIndex === index ? 'true' : 'false'}
                    type="button"
                  >
                    {item.icon && (
                      <item.icon
                        className={`w-4 h-4 ${isDarkMode ? 'opacity-70' : 'text-gray-600'}`}
                        aria-hidden="true"
                      />
                    )}
                    <span>{item.name}</span>
                    {item.shortcut && (
                      <kbd
                        className={`ml-auto px-2 py-0.5 text-xs font-mono rounded 
                        ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                        aria-label={`Keyboard shortcut: ${item.shortcut}`}
                      >
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            )}

            {(search.trim() !== '' || recentSearches.length === 0) &&
              filteredCommands.length === 0 && (
                <div className="p-4 text-center text-gray-500" role="status">
                  No results found.
                </div>
              )}

            {filteredCommands.map((group) => {
              const groupStartIndex =
                search.trim() === '' && recentSearches.length > 0 ? recentSearches.length : 0;

              return (
                <div key={group.category} role="group" aria-labelledby={`group-${group.category}`}>
                  <div
                    id={`group-${group.category}`}
                    className={`px-2 py-1 text-xs uppercase tracking-wider font-semibold ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {group.category}
                  </div>
                  {group.items.map((item, itemIndex) => {
                    const absoluteIndex =
                      groupStartIndex +
                      (search.trim() === '' && recentSearches.length > 0
                        ? 0
                        : group.items.slice(0, itemIndex).length +
                          filteredCommands
                            .slice(0, filteredCommands.indexOf(group))
                            .reduce((acc, g) => acc + g.items.length, 0));
                    return (
                      <button
                        key={item.id}
                        className={`w-full flex items-center gap-2 px-3 py-2 my-1 cursor-pointer rounded-md transition-colors text-left
                          ${
                            isDarkMode
                              ? 'hover:bg-gray-800 text-gray-200 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                              : 'hover:bg-gray-100 text-gray-700 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          }
                          ${selectedIndex === absoluteIndex ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}
                        onClick={() => handleSelect(item)}
                        onKeyDown={(e) => handleItemKeyDown(e, item)}
                        role="option"
                        aria-label={`Execute ${item.name}`}
                        aria-selected={selectedIndex === absoluteIndex ? 'true' : 'false'}
                        type="button"
                      >
                        {item.icon && (
                          <item.icon
                            className={`w-4 h-4 ${isDarkMode ? 'opacity-70' : 'text-gray-600'}`}
                            aria-hidden="true"
                          />
                        )}
                        <span className="font-medium">{item.name}</span>
                        {item.shortcut && (
                          <kbd
                            className={`ml-auto px-2 py-0.5 text-xs font-mono rounded 
                            ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                            aria-label={`Keyboard shortcut: ${item.shortcut}`}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
