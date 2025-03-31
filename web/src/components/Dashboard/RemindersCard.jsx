import React from 'react';
import { Link } from 'react-router-dom';
import { FaStickyNote } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import DataCard from './DataCard';

const RemindersCard = ({ memos, loading, isDarkMode }) => {
    return (
        <DataCard title="Reminders" icon={FaStickyNote} className="reminders-card">
            <div className="reminders-content">
                {loading ? (
                    <Spinner size="medium" color={isDarkMode ? '#4285F4' : '#4285F4'} />
                ) : (
                    <ul className="reminders-list">
                        {memos?.length === 0 ? (
                            <li>No reminders at the moment</li>
                        ) : (
                            memos.slice(0, 3).map((memo) => (
                                <li 
                                    key={memo.Id} 
                                    className={memo.Done ? 'done' : ''}
                                >
                                    {memo.Text}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
            <Link to="/sticky-notes" className="card-link">View All</Link>
        </DataCard>
    );
};

export default RemindersCard;
