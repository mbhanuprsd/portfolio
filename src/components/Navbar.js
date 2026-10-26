import React, { useState } from 'react';

const sections = [
    ['hero', 'HOME'],
    ['about', 'ABOUT'],
    ['skills', 'SKILLS'],
    ['projects', 'PROJECTS'],
    ['contact', 'CONTACT']
];

const Navbar = ({ scrollToSection, theme, toggleTheme, activeSection, adminPage = false }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNav = (id) => {
        scrollToSection(id);
        setMenuOpen(false);
    };

    const themeButton = (extraClasses = '') => (
        <button
            type="button"
            className={`theme-toggle ${extraClasses}`}
            onClick={toggleTheme}
            aria-pressed={theme === 'neon'}
            aria-label={`Switch to ${theme === 'matrix' ? 'Neon' : 'Matrix'} theme`}
        >
            <span aria-hidden="true">{theme === 'matrix' ? '✦' : '⌘'}</span>
            <span>{theme === 'matrix' ? 'Neon theme' : 'Matrix theme'}</span>
        </button>
    );

    return (
        <nav className="site-nav fixed top-0 left-0 w-full py-3 px-4 md:px-8 z-50">
            <div className="site-nav-inner flex items-center justify-between gap-4">
                <a className="site-brand text-lg md:text-2xl font-bold tracking-widest select-none" href="/">
                    Bhanu Prasad Merakanapalli
                </a>
                {!adminPage && (
                    <ul className="hidden xl:flex flex-row items-center gap-3">
                        {sections.map(([id, label]) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => handleNav(id)}
                                    className={`nav-link text-sm 2xl:text-base font-bold transition duration-300 ${activeSection === id ? 'is-active' : ''}`}
                                    aria-current={activeSection === id ? 'location' : undefined}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="hidden xl:flex items-center gap-3">
                    {adminPage && <a className="nav-link font-bold" href="/">Portfolio</a>}
                    {themeButton()}
                </div>
                <button
                    type="button"
                    className="menu-toggle xl:hidden"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        )}
                    </svg>
                </button>
            </div>
            {menuOpen && (
                <div className="mobile-menu xl:hidden mt-3 pb-2 animate-fade-in-down">
                    <ul className="flex flex-col items-stretch gap-1">
                        {adminPage ? (
                            <li>
                                <a className="mobile-nav-link" href="/" onClick={() => setMenuOpen(false)}>
                                    Portfolio
                                </a>
                            </li>
                        ) : sections.map(([id, label]) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => handleNav(id)}
                                    className={`mobile-nav-link w-full text-left ${activeSection === id ? 'is-active' : ''}`}
                                    aria-current={activeSection === id ? 'location' : undefined}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                        <li className="pt-2">{themeButton('w-full justify-center')}</li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
