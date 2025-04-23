import React from 'react';
import { Command } from 'cmdk-base';
import { useNavigate } from 'react-router-dom';
import {
  FiSettings,
  FiUser,
  FiHome,
  FiBell,
  FiActivity,
  FiHeart,
  FiMap,
  FiFileText,
  FiAlertTriangle,
  FiClock,
  FiBookOpen,
} from 'react-icons/fi';
import './CommandPalette.css';

export function CommandPalette({ isDarkMode }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command) => {
    setOpen(false);
    command();
  }, []);

  const pages = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { name: 'Health Metrics', icon: FiActivity, path: '/health-metrics' },
    { name: 'Health Report', icon: FiHeart, path: '/health-report' },
    { name: 'Pollution Tracker', icon: FiMap, path: '/pollution-tracker' },
    { name: 'Private Memos', icon: FiFileText, path: '/sticky-notes' },
    { name: 'Emergency Contacts', icon: FiBell, path: '/emergency-contacts' },
    { name: 'Medication Tracker', icon: FiClock, path: '/medication-tracker' },
    { name: 'Health Tips', icon: FiBookOpen, path: '/health-tips' },
    { name: 'Profile', icon: FiUser, path: '/profile' },
    { name: 'Settings', icon: FiSettings, path: '/settings' },
  ];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className={`command-palette ${isDarkMode ? 'dark' : ''}`}
    >
      <Command.Input placeholder="Search for pages, features, or actions..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Pages">
          {pages.map((page) => (
            <Command.Item key={page.path} onSelect={() => runCommand(() => navigate(page.path))}>
              <page.icon className="command-icon" />
              {page.name}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Separator />

        <Command.Group heading="Quick Actions">
          <Command.Item onSelect={() => runCommand(() => navigate('/emergency-contacts'))}>
            <FiAlertTriangle className="command-icon" />
            Send Emergency Alert
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/health-metrics'))}>
            <FiActivity className="command-icon" />
            Log New Health Metrics
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
