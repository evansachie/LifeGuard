import React, { RefObject } from 'react';
import { FaStickyNote, FaSearch, FaPlus } from 'react-icons/fa';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleNewNoteForm: () => void;
  searchInputRef: RefObject<HTMLInputElement>;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  toggleNewNoteForm,
  searchInputRef,
}) => {
  return (
    <div className="header-section">
      <div className="header-left">
        <FaStickyNote className="icon" />
        <h1 className="page-title">Sticky Notes</h1>
      </div>
      <div className="header-actions">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notes... (Press / to focus)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          className="action-button new-note-button"
          onClick={toggleNewNoteForm}
          title="Create new note (Ctrl+N)"
        >
          <FaPlus /> <span>New Note</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
