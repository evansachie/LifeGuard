/**
 * Keyboard shortcuts configuration
 */
export const KEYBOARD_SHORTCUTS = {
  SEARCH: {
    key: '/',
    description: 'Focus search',
    withModifier: false,
  },
  TOGGLE_GRID: {
    key: 'g',
    description: 'Grid view',
    withModifier: true,
  },
  TOGGLE_LIST: {
    key: 'l',
    description: 'List view',
    withModifier: true,
  },
  TOGGLE_FILTER: {
    key: 'f',
    description: 'Toggle filter menu',
    withModifier: true,
  },
  TOGGLE_SORT: {
    key: 's',
    description: 'Toggle sort menu',
    withModifier: true,
  },
  HELP: {
    key: '?',
    description: 'Show keyboard shortcuts',
    withModifier: false,
  },
};

/**
 * Check if the event matches a shortcut
 * @param {Event} event - Keyboard event
 * @param {Object} shortcut - Shortcut configuration
 * @returns {Boolean} - Whether the event matches the shortcut
 */
export const matchesShortcut = (event, shortcut) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifier = isMac ? event.metaKey : event.ctrlKey;
  
  return shortcut.withModifier
    ? (modifier && event.key.toLowerCase() === shortcut.key.toLowerCase() && !event.shiftKey && !event.altKey)
    : (event.key === shortcut.key && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey);
};
