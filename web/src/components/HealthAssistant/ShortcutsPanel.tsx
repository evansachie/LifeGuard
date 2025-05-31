import React from 'react';

interface ShortcutsPanelProps {
  showShortcuts: boolean;
}

const ShortcutsPanel: React.FC<ShortcutsPanelProps> = ({ showShortcuts }) => {
  if (!showShortcuts) return null;

  return (
    <div className="shortcuts-panel">
      <h4>Keyboard Shortcuts</h4>
      <ul>
        <li>
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd> Send message
        </li>
        <li>
          <kbd>Esc</kbd> Close chat
        </li>
        <li>
          <kbd>Ctrl</kbd> + <kbd>L</kbd> Clear history
        </li>
        <li>
          <kbd>Ctrl</kbd> + <kbd>M</kbd> Toggle voice input
        </li>
      </ul>
    </div>
  );
};

export default ShortcutsPanel;
