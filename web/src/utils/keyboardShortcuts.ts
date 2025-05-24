import { KeyboardShortcut } from '../types/common.types';

export const KEYBOARD_SHORTCUTS: Record<string, KeyboardShortcut> = {
  SEARCH: {
    key: '/',
    description: 'Focus search box',
    withModifier: false,
  },
  TOGGLE_GRID: {
    key: 'g',
    description: 'Switch to grid view',
    withModifier: true,
  },
  TOGGLE_LIST: {
    key: 'l',
    description: 'Switch to list view',
    withModifier: true,
  },
  TOGGLE_FILTER: {
    key: 'f',
    description: 'Toggle filter panel',
    withModifier: true,
  },
  TOGGLE_SORT: {
    key: 's',
    description: 'Toggle sort options',
    withModifier: true,
  },
  HELP: {
    key: '?',
    description: 'Show keyboard shortcuts',
    withModifier: false,
  },
  COMMAND_PALETTE: {
    key: 'k',
    description: 'Open command palette',
    withModifier: true,
  },
  PLAY_PAUSE: {
    key: 'Space',
    description: 'Play or pause audio',
    withModifier: false,
  },
  NEXT_TRACK: {
    key: 'ArrowRight',
    description: 'Next track',
    withModifier: false,
  },
  PREVIOUS_TRACK: {
    key: 'ArrowLeft',
    description: 'Previous track',
    withModifier: false,
  },
};

/**
 * Check if a keyboard event matches a shortcut definition
 * @param event - The keyboard event to check
 * @param shortcut - The shortcut definition to match against
 * @returns True if the event matches the shortcut
 */
export const matchesShortcut = (
  event: KeyboardEvent,
  shortcut: KeyboardShortcut
): boolean => {
  // Check if modifiers match (Ctrl or Cmd)
  const hasModifier = event.ctrlKey || event.metaKey;
  if (hasModifier !== shortcut.withModifier) {
    return false;
  }

  // Check if the key matches
  return event.key === shortcut.key;
};
