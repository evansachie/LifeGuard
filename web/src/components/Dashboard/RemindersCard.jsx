import React from 'react';
import { Link } from 'react-router-dom';
import { FaStickyNote } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import DataCard from './DataCard';
import { truncateHtml } from '../../utils/htmlUtils';

const RemindersCard = ({ memos, loading, isDarkMode }) => {
  const activeMemos = memos?.filter((memo) => !memo.Done) || [];

  return (
    <DataCard title="Reminders" icon={FaStickyNote} className="reminders-card">
      <div className="reminders-content scrollable-reminders-content">
        {loading ? (
          <Spinner size="medium" color={isDarkMode ? '#4285F4' : '#4285F4'} />
        ) : (
          <ul className="reminders-list">
            {activeMemos.length === 0 ? (
              <li>No active reminders</li>
            ) : (
              activeMemos.slice(0, 1).map((memo) => (
                <li
                  key={memo.Id}
                  dangerouslySetInnerHTML={{
                    __html: truncateHtml(memo.Text, 30),
                  }}
                />
              ))
            )}
          </ul>
        )}
      </div>
      <Link to="/sticky-notes" className="card-link">
        View All
      </Link>
    </DataCard>
  );
};

export default RemindersCard;
