import * as React from "react";
import { useState } from 'react';
import '../MentalExercise/MentalExercise.css';
// import BackArrow from '../BackArrow/BackArrow';

const quotes = [
    "Before your next food shopping trip, to the nearest convenience store/ farmers market. Buy local, support the small business owners or community haven and see how beneficial it is. WIN, WIN, WIN!!! Try to make that walk at least 2/3 of a mile",
    "Activity Level is just one element in your movement regiment. Equally important are STRESS LEVELS, SOMATIZATION LEVELS AND NUTITIONAL ABSORBTION/ ENERGY UTILIZATION. How well are you managing vs how well is your body managing? You don’t control the autonomic system of the body or it would be automatic.",
    "Take a dance class, maybe you’ll love it maybe you’ll hate it, maybe it will be bland. Good news is there are several different types of dance and a bunch of free classes out there. Friends or solo EXPLORE IT because you’re sure to meet people and have new experiences. Remember 'It takes two to tango.'"
];

function PhysicalExercise({ isDarkMode }) {
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
                <h2 className="mental-exercise-title">Physical Exercises</h2>
                <p className="mental-exercise-description">{quotes[currentQuoteIndex]}</p>
                <div className="quote-navigation">
                    <span className="quote-dot" onClick={handlePrevQuote}>◄</span>
                    <span className="quote-dot" onClick={handleNextQuote}>►</span>
                </div>
                <br/>
                <div className="mental-exercise-tips">
                    <h3 className="mental-exercise-tips-title">Tips:</h3>
                    <ul>
                        <li className="mental-exercise-tip">Try incorporating interval training into your workout routine.</li>
                        <li className="mental-exercise-tip">This involves alternating between high-intensity bursts of exercise and periods of rest or lower-intensity activity.</li>
                        <li className="mental-exercise-tip">It can help boost your metabolism, improve cardiovascular fitness, and burn more calories in a shorter time.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PhysicalExercise;
