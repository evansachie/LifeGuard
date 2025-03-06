import React from 'react';
import { FaChartLine } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import DataCard from './DataCard';

const QuoteCard = ({ quote, loading, isDarkMode }) => {
    return (
        <DataCard title="Daily Inspiration" icon={FaChartLine} className="quote-card">
            {loading ? (
                <Spinner size="medium" color={isDarkMode ? '#4285F4' : '#4285F4'} />
            ) : (
                <>
                    {quote ? `"${quote.quote}"` : 'Loading quote...'}
                    <br/>
                    {quote && `– ${quote.author}`}
                </>
            )}
        </DataCard>
    );
};

export default QuoteCard;
