import * as React from "react";
import { useState, useEffect } from 'react';
import BackArrow from '../BackArrow/BackArrow';
import './MentalExercise.css';

function MentalExercise({ isDarkMode }) {
    const quotes = [
        {
            text: "This is when you mouth or\nsilently say words to yourself as you read\nthem.\nBeing that you can read faster than you can\nspeak, reducing this habit will increase your\nreading speed dramatically.\nTo overcome subvocalization, try humming or\ncounting silently to yourself as you read.\nThese strategies prevent you from mentally\nsaying words as you read them, and eventually\nyou'll be able to read at a faster rate.",
            type: 'text'
        },
        {
            text: "Tomorrow find the mirror or open your camera before you start your day. Just observe. Do it again the day after that, see what changes you notice.",
            type: 'text'
        },
        {
            text: "Anchor yourself by taking 10-15 minutes to plan: How you will achieve your next long-term goal. In many ways life is like Sims™: if your happiness meter goes too low there are negative consequences.",
            type: 'text'
        },
        {
            text: "You know what it takes to waste $10,000 a year?",
            type: 'question',
            correctAnswer: '$27.40'
        }
    ];

    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [animationClass, setAnimationClass] = useState('');
    const [userAnswer, setUserAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        const handleAnimationEnd = () => {
            setAnimationClass('');
        };

        const timeoutId = setTimeout(() => {
            setAnimationClass('animate');
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            const quoteElement = document.querySelector('.mental-exercise-description');
            if (quoteElement) {
                quoteElement.removeEventListener('animationend', handleAnimationEnd);
            }
        };
    }, [currentQuoteIndex]);

    const handleNextQuote = () => {
        const newIndex = (currentQuoteIndex + 1) % quotes.length;
        setCurrentQuoteIndex(newIndex);
        setIsFlipped(!isFlipped);
    };

    const handlePrevQuote = () => {
        const newIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
        setCurrentQuoteIndex(newIndex);
        setIsFlipped(!isFlipped);
    };

    const handleAnswerClick = (answer) => {
        setUserAnswer(answer);
        setIsCorrect(answer === quotes[currentQuoteIndex].correctAnswer);
    };

    const handleNextExercise = () => {
        setUserAnswer(null);
        setIsCorrect(null);
        handleNextQuote();
    };

    return (
        <div className={`mental-exercise-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="content-wrapper">
                <h2 className="mental-exercise-title">Mental Exercises</h2>
                <div className={`quote-card ${isFlipped ? 'flip' : ''} ${animationClass}`}>
                    <div className="quote-front">
                        {quotes[currentQuoteIndex].type === 'text' ? (
                            <p className="mental-exercise-description">{quotes[currentQuoteIndex].text}</p>
                        ) : (
                            <div className="interactive-exercise">
                                <p className="mental-exercise-description">{quotes[currentQuoteIndex].text}</p>
                                {userAnswer === null ? (
                                    <div className="answer-options">
                                        <button className="answer-option" onClick={() => handleAnswerClick('$27.40')}>$27.40</button>
                                        <button className="answer-option" onClick={() => handleAnswerClick('$29.40')}>$29.40</button>
                                        <button className="answer-option" onClick={() => handleAnswerClick('$24.40')}>$24.40</button>
                                        <button className="answer-option" onClick={() => handleAnswerClick('$21.40')}>$21.40</button>
                                    </div>
                                ) : (
                                    <div>
                                        {isCorrect ? (
                                            <div>
                                                <p className="answer-feedback correct">Correct!</p>
                                                <button className="next-exercise" onClick={handleNextExercise}>Next Exercise</button>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="answer-feedback incorrect">Incorrect.</p>
                                                <button className="try-again" onClick={() => setUserAnswer(null)}>Try Again</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="quote-back">
                        <div className="quote-navigation">
                            <span className="quote-dot" onClick={handlePrevQuote}>◄</span>
                            <span className="quote-dot" onClick={handleNextQuote}>►</span>
                        </div>
                        <div className="mental-exercise-tips">
                            <h3 className="mental-exercise-tips-title">Tips:</h3>
                            <ul>
                                <li className="mental-exercise-tip">Observe yourself without judgment.</li>
                                <li className="mental-exercise-tip">Notice any changes in your appearance, mood, or energy level.</li>
                                <li className="mental-exercise-tip">Reflect on how these changes may impact your day.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MentalExercise;