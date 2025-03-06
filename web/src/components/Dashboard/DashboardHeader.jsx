import React from 'react';
import Spinner from '../Spinner/Spinner';

const DashboardHeader = ({ userData, dataLoading }) => {
    const getFirstName = (fullName) => {
        if (!fullName) return 'User';
        // If it's an email, show just the first part
        if (fullName.includes('@')) {
            return fullName.split('@')[0].charAt(0).toUpperCase() + 
                   fullName.split('@')[0].slice(1).toLowerCase();
        }
        // If it's a full name, show just the first name
        return fullName.split(' ')[0].charAt(0).toUpperCase() + 
               fullName.split(' ')[0].slice(1).toLowerCase();
    };

    return (
        <header className="dashboard-header">
            <h1>Welcome {dataLoading ? '...' : getFirstName(userData?.userName)}!</h1>
            <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>
    );
};

export default DashboardHeader;
