import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { isFirebaseConfigured } from './firebase';
import MatrixRain from './components/MatrixRain';
import NeonRays from './components/NeonRays';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import ChatWidget from './components/ChatWidget';
import AdminChatPanel from './components/AdminChatPanel';

const NAVBAR_HEIGHT = 80;
const THEME_STORAGE_KEY = 'portfolio-theme';

// Main App component
const App = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [user, setUser] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [firebaseAuthUnavailable, setFirebaseAuthUnavailable] = useState(false);
    const [theme, setTheme] = useState(() => {
        try {
            const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            return storedTheme && storedTheme !== 'matrix' ? 'neon' : 'matrix';
        } catch {
            return 'matrix';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
            // Keep the in-memory theme switch usable when storage is unavailable.
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === 'matrix' ? 'neon' : 'matrix');
    };

    useEffect(() => {
        if (!isFirebaseConfigured) return undefined;

        try {
            const auth = getAuth();
            return onAuthStateChanged(auth, (firebaseUser) => {
                setUser(firebaseUser);
                setEmailVerified(firebaseUser?.emailVerified ?? false);
                setFirebaseAuthUnavailable(false);
            }, () => {
                setFirebaseAuthUnavailable(true);
            });
        } catch {
            setFirebaseAuthUnavailable(true);
            return undefined;
        }
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -NAVBAR_HEIGHT;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setActiveSection(id);
    };

    return (
        <div className="app-root" data-theme={theme}>
            {theme === 'neon' && <NeonRays />}
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                {theme === 'matrix' && <MatrixRain />}
                                <Navbar
                                    scrollToSection={scrollToSection}
                                    theme={theme}
                                    toggleTheme={toggleTheme}
                                    activeSection={activeSection}
                                />
                                <main className="relative z-10 p-4 md:p-8 pt-20">
                                    <HeroSection scrollToSection={scrollToSection} />
                                    <AboutSection />
                                    <SkillsSection />
                                    <ProjectsSection />
                                    <ContactSection />
                                </main>
                                {isFirebaseConfigured && (
                                    <ChatWidget
                                        user={user}
                                        emailVerified={emailVerified}
                                        setUser={setUser}
                                        setEmailVerified={setEmailVerified}
                                    />
                                )}
                                <footer className="relative z-10 py-8 text-center text-gray-600 text-sm">
                                    <p>
                                        &copy; {new Date().getFullYear()} Bhanu Prasad Merakanapalli. All rights reserved. System Operational.
                                    </p>
                                    {(!isFirebaseConfigured || firebaseAuthUnavailable) && (
                                        <p role="status" className="mt-2 text-yellow-600">
                                            Chat services are unavailable. Check the Firebase configuration.
                                        </p>
                                    )}
                                </footer>
                            </>
                        }
                    />
                    <Route
                        path="/admin-chat"
                        element={
                            <>
                                <Navbar
                                    scrollToSection={scrollToSection}
                                    theme={theme}
                                    toggleTheme={toggleTheme}
                                    adminPage
                                />
                                <main className="relative z-10 min-h-screen px-4 pt-24 pb-8">
                                    {isFirebaseConfigured
                                        ? <AdminChatPanel user={user} emailVerified={emailVerified} setUser={setUser} setEmailVerified={setEmailVerified} />
                                        : <p role="status" className="max-w-xl mx-auto mt-20 p-6 text-center text-yellow-600">Firebase configuration is required for admin chat.</p>}
                                </main>
                            </>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
