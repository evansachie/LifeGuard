import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium', color = '#4285F4' }) => {
    const sizeClass = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    }[size];

    return (
        <div className="spinner-container">
            <div 
                className={`spinner ${sizeClass}`}
                style={{ borderTopColor: color }}
            />
        </div>
    );
};

export default Spinner; 