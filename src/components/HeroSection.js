import React, { useEffect, useRef, useState } from 'react';

const phrases = [
    "Initializing core protocols...",
    "Executing render pipeline...",
    "Optimizing for low-latency...",
    "Loading virtual reality construct...",
    "Welcome to my digital domain."
];

const HeroSection = ({ scrollToSection }) => {
    const textRef = useRef(null);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        let timeout;
        const currentPhrase = phrases[currentPhraseIndex];

        if (isTyping) {
            if (displayedText.length < currentPhrase.length) {
                timeout = setTimeout(() => {
                    setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
                }, 70);
            } else {
                setIsTyping(false);
                timeout = setTimeout(() => setIsTyping(true), 2000);
            }
        } else {
            if (displayedText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
                }, 30);
            } else {
                setIsTyping(true);
                setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
            }
        }

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayedText, isTyping, currentPhraseIndex]);

    return (
        <section
            id="hero"
            className="relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-4 sm:p-6 md:p-8 rounded-lg bg-black bg-opacity-70 shadow-lg border border-green-700 m-2 sm:m-4 md:m-8"
        >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-shadow-green animate-pulse">
                &lt;BHANU PRASAD MERAKANAPALLI /&gt;
            </h1>
            <p
                ref={textRef}
                className="text-base sm:text-lg md:text-2xl mb-8 whitespace-pre-wrap min-h-[3rem] overflow-hidden border-r-2 border-green-400 pr-1 animate-blink-caret"
            >
                {displayedText}
            </p>
            <p className="text-lg sm:text-xl md:text-3xl text-gray-400 mb-8">
                &gt; Specialist in Game & Mobile App Development
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <button
                    onClick={() => scrollToSection('projects')}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border border-green-500"
                >
                    View Project Schematics &gt;
                </button>
                <button
                    onClick={() => scrollToSection('contact')}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 hover:bg-gray-700 text-green-400 font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border border-gray-600"
                >
                    Establish Secure Channel &gt;
                </button>
            </div>
        </section>
    );
};

export default HeroSection;