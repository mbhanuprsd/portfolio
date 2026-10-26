import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { isFirebaseConfigured } from './firebase';
import MatrixRain from './components/MatrixRain';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import ChatWidget from './components/ChatWidget';
import AdminChatPanel from './components/AdminChatPanel';

const NAVBAR_HEIGHT = 80;

// Main App component
const App = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [user, setUser] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [firebaseAuthUnavailable, setFirebaseAuthUnavailable] = useState(false);

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
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
                            <MatrixRain />
                            <Navbar scrollToSection={scrollToSection} />
                            <div className="relative z-10 p-4 md:p-8 pt-20">
                                <HeroSection scrollToSection={scrollToSection} />
                                <AboutSection />
                                <SkillsSection />
                                <ProjectsSection />
                                <ContactSection />
                            </div>
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
                        </div>
                    }
                />
                <Route
                    path="/admin-chat"
                    element={isFirebaseConfigured
                        ? <AdminChatPanel user={user} emailVerified={emailVerified} setUser={setUser} setEmailVerified={setEmailVerified} />
                        : <p role="status" className="max-w-xl mx-auto mt-20 p-6 text-center text-yellow-600">Firebase configuration is required for admin chat.</p>}
                />
            </Routes>
        </Router>
    );
};

export default App;
