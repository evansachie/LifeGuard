import * as React from "react";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Help.css';

const HelpPage = ({ isDarkMode }) => {
    const [activeSection, setActiveSection] = useState(null);

    const handleSectionClick = (section) => {
        setActiveSection(section === activeSection ? null : section);
    };

    return (
        <div className={`help-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="help-header">
                <Link to="/settings" className="back-button">
                    <ArrowLeft size={20} className="back-icon" />
                    <span>Back to Settings</span>
                </Link>
                <h1>Help</h1>
            </div>

            <div className="help-sections">
                <div
                    className={`help-section ${activeSection === 'activity' ? 'active' : ''}`}
                    onClick={() => handleSectionClick('activity')}
                >
                    <h2>Activity Level Curated Suggestions</h2>
                    {activeSection === 'activity' && (
                        <p>
                            We provide curated activity suggestions based on your fitness level and goals. These are designed to help
                            you stay motivated and achieve your desired results.
                        </p>
                    )}
                </div>

                <div
                    className={`help-section ${activeSection === 'campaign' ? 'active' : ''}`}
                    onClick={() => handleSectionClick('campaign')}
                >
                    <h2>Campaign Cycle Introduction</h2>
                    {activeSection === 'campaign' && (
                        <p>
                            Our app follows a campaign cycle approach to help you stay on track with your fitness journey. Learn more
                            about how this cycle works and how it can benefit you.
                        </p>
                    )}
                </div>

                <div
                    className={`help-section ${activeSection === 'guidelines' ? 'active' : ''}`}
                    onClick={() => handleSectionClick('guidelines')}
                >
                    <h2>7 Cycle Guidelines</h2>
                    {activeSection === 'guidelines' && (
                        <p>
                            Follow our 7 cycle guidelines to maximize the effectiveness of your fitness routine. These guidelines are
                            based on proven principles and designed to help you achieve your goals.
                        </p>
                    )}
                </div>

                <div
                    className={`help-section ${activeSection === 'howto' ? 'active' : ''}`}
                    onClick={() => handleSectionClick('howto')}
                >
                    <h2>How To...</h2>
                    {activeSection === 'howto' && (
                        <p>
                            Find step-by-step instructions on how to use various features of the app, such as tracking your calories,
                            setting goals, and more.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HelpPage;