import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Command } from 'cmdk';
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

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isDarkMode, 
  toggleTheme, 
  open, 
  setOpen 
}) => {
  const [search, setSearch] = useState<string>('');
  const [, setPages] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<CommandItem[]>(() => {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  });
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch('');
      setPages([]);
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
            action: () => navigate('/medication-tracker'),
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
        console.error("Error executing command:", error);
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

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[1000]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={contentRef}
        className={`w-full max-w-xl mx-auto overflow-hidden ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'
        } rounded-xl shadow-2xl`}
      >
        <div className="command-wrapper">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className={`w-full p-4 text-lg border-b ${
              isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
            } focus:outline-none`}
            autoFocus
          />
          
          <div className={`overflow-y-auto max-h-[60vh] p-2 ${
            isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'
          }`}>
            {search.trim() === '' && recentSearches.length > 0 && (
              <div>
                <div className={`px-2 py-1 text-xs uppercase tracking-wider font-semibold ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Recent
                </div>
                {recentSearches.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-2 px-3 py-2 my-1 cursor-pointer rounded-md transition-colors
                      ${isDarkMode 
                        ? 'hover:bg-gray-800 text-gray-200' 
                        : 'hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => handleSelect(item)}
                  >
                    {item.icon && <item.icon className={`w-4 h-4 ${isDarkMode ? 'opacity-70' : 'text-gray-600'}`} />}
                    <span>{item.name}</span>
                    {item.shortcut && (
                      <kbd className={`ml-auto px-2 py-0.5 text-xs font-mono rounded 
                        ${isDarkMode 
                          ? 'bg-gray-800 text-gray-400' 
                          : 'bg-gray-100 text-gray-600'}`}>
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                ))}
              </div>
            )}

            {(search.trim() !== '' || recentSearches.length === 0) && filteredCommands.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No results found.
              </div>
            )}
            
            {filteredCommands.map((group) => (
              <div key={group.category}>
                <div className={`px-2 py-1 text-xs uppercase tracking-wider font-semibold ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {group.category}
                </div>
                {group.items.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-2 px-3 py-2 my-1 cursor-pointer rounded-md transition-colors
                      ${isDarkMode 
                        ? 'hover:bg-gray-800 text-gray-200' 
                        : 'hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => handleSelect(item)}
                  >
                    {item.icon && <item.icon className={`w-4 h-4 ${isDarkMode ? 'opacity-70' : 'text-gray-600'}`} />}
                    <span className="font-medium">{item.name}</span>
                    {item.shortcut && (
                      <kbd className={`ml-auto px-2 py-0.5 text-xs font-mono rounded 
                        ${isDarkMode 
                          ? 'bg-gray-800 text-gray-400' 
                          : 'bg-gray-100 text-gray-600'}`}>
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
