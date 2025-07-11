import { FaPlus } from 'react-icons/fa';
import EmptyStateImg from '../../assets/empty-state.svg';

interface EmptyStateProps {
  onNewNote: () => void;
  isDarkMode?: boolean;
}

const EmptyState = ({ onNewNote, isDarkMode }: EmptyStateProps) => {
  return (
    <div className={`memos-empty-state ${isDarkMode ? 'dark-mode' : ''}`}>
      <img src={EmptyStateImg} alt="No notes" className="empty-state-image" />
      <p>No notes found</p>
      <button className="action-button new-note-button" onClick={onNewNote}>
        <FaPlus /> Create New Note
      </button>
    </div>
  );
};

export default EmptyState;
