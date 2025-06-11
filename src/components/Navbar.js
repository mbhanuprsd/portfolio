import React, { useState } from 'react';

const Navbar = ({ scrollToSection }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNav = (id) => {
        scrollToSection(id);
        setMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-90 text-green-400 py-4 px-4 md:px-8 z-50 shadow-lg rounded-b-lg">
            <div className="flex items-center justify-between">
                <div className="text-lg md:text-2xl font-bold tracking-widest select-none">
                    Bhanu Prasad Merakanapalli
                </div>
                <button
                    className="md:hidden focus:outline-none"
                    aria-label="Open Menu"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <svg
                        className="w-8 h-8 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        )}
                    </svg>
                </button>
                <ul className="hidden md:flex flex-row items-center space-x-12">
                    <li>
                        <button onClick={() => scrollToSection('hero')} className="text-lg md:text-xl font-bold hover:text-green-200 transition duration-300 transform hover:scale-105">
                            //&gt; HOME
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('about')} className="text-lg md:text-xl font-bold hover:text-green-200 transition duration-300 transform hover:scale-105">
                            //&gt; ABOUT
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('skills')} className="text-lg md:text-xl font-bold hover:text-green-200 transition duration-300 transform hover:scale-105">
                            //&gt; SKILLS
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('projects')} className="text-lg md:text-xl font-bold hover:text-green-200 transition duration-300 transform hover:scale-105">
                            //&gt; PROJECTS
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollToSection('contact')} className="text-lg md:text-xl font-bold hover:text-green-200 transition duration-300 transform hover:scale-105">
                            //&gt; CONTACT
                        </button>
                    </li>
                </ul>
            </div>
            {menuOpen && (
                <ul className="flex flex-col items-center mt-4 space-y-2 md:hidden animate-fade-in-down">
                    <li>
                        <button onClick={() => handleNav('hero')} className="w-full text-lg font-bold hover:text-green-200 transition duration-300">
                            //&gt; HOME
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNav('about')} className="w-full text-lg font-bold hover:text-green-200 transition duration-300">
                            //&gt; ABOUT
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNav('skills')} className="w-full text-lg font-bold hover:text-green-200 transition duration-300">
                            //&gt; SKILLS
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNav('projects')} className="w-full text-lg font-bold hover:text-green-200 transition duration-300">
                            //&gt; PROJECTS
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNav('contact')} className="w-full text-lg font-bold hover:text-green-200 transition duration-300">
                            //&gt; CONTACT
                        </button>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default Navbar;