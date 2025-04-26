import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import './CommandPalette.css';

export const CommandPalette = ({ isDarkMode, toggleTheme, open, setOpen }) => {
  const [search, setSearch] = useState('');
  const [, setPages] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  });
  const navigate = useNavigate();

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch('');
      setPages([]);
    }
  }, [open]);

  const commands = useMemo(
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
    (item) => {
      setOpen(false);
      item.action();

      setRecentSearches((prev) => {
        const newSearches = [item, ...prev.filter((i) => i.id !== item.id)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        return newSearches;
      });
    },
    [setOpen]
  );

  const renderRecentCommands = () => {
    if (!search && recentSearches.length > 0) {
      return (
        <Command.Group heading="Recent">
          {recentSearches.map((item) => (
            <Command.Item key={item.id} value={item.name} onSelect={() => handleSelect(item)}>
              {item.icon && <item.icon className="command-icon" />}
              <span>{item.name}</span>
              {item.shortcut && <kbd className="command-shortcut">{item.shortcut}</kbd>}
            </Command.Item>
          ))}
        </Command.Group>
      );
    }
    return null;
  };

  if (!open) return null;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className={`command-dialog ${isDarkMode ? 'dark' : ''}`}
    >
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Type a command or search..."
      />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        {renderRecentCommands()}

        {filteredCommands.map((group) => (
          <Command.Group key={group.category} heading={group.category}>
            {group.items.map((item) => (
              <Command.Item key={item.id} value={item.name} onSelect={() => handleSelect(item)}>
                {item.icon && <item.icon className="command-icon" />}
                <span>{item.name}</span>
                {item.shortcut && <kbd className="command-shortcut">{item.shortcut}</kbd>}
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
};
