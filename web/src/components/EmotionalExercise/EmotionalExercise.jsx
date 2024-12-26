import * as React from "react";
import { useState } from 'react';
import "../MentalExercise/MentalExercise.css"
// import BackArrow from '../BackArrow/BackArrow';

const quotes = [
    "Make a list of things you regularly accomplish on a daily, monthly, quarterly, and yearly basis. Then update it weekly with things you have gotten done.",
    "List 10-12 things you're thankful for daily (ON PAPER). It will help you get traction but limit and minimize unneeded friction.",
    "State your current age, position, and short-term goals to give perspective. State who your current circle is, your closest confidants, and describe yourself. Describe what you like to do, what you think of yourself and then write where you see yourself in 5 years. What you hope to have to accomplished? Who is with you? AND What do you see your life looking like? Write it, date it, and seal it."
];

const tips = [
    "Practice daily gratitude by listing things you're thankful for. This can help shift your focus to the positive aspects of life.",
    "Set aside time for self-reflection and goal-setting. Write down your current situation, goals, and vision for the future.",
    "Engage in activities that promote emotional well-being, such as journaling, meditation, or spending time with loved ones."
];

function EmotionalExercise({ isDarkMode }) {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    const handleNextQuote = () => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    };

    const handlePrevQuote = () => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
    };

    return (
        <div className={`mental-exercise-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            {/*<BackArrow />*/}
            <div className="content-wrapper">
                <h2 className="mental-exercise-title">Emotional Exercises</h2>
                <p className="mental-exercise-description">{quotes[currentQuoteIndex]}</p>
                <div className="quote-navigation">
                    <span className="quote-dot" onClick={handlePrevQuote}>◄</span>
                    <span className="quote-dot" onClick={handleNextQuote}>►</span>
                </div>
                <div className="mental-exercise-tips">
                    <h3 className="mental-exercise-tips-title">Tips:</h3>
                    <ul>
                        {tips.map((tip, index) => (
                            <li key={index} className="mental-exercise-tip">{tip}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EmotionalExercise;
