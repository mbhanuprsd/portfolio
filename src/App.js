import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
                            <ChatWidget />
                            <footer className="relative z-10 py-8 text-center text-gray-600 text-sm">
                                <p>
                                    &copy; {new Date().getFullYear()} Bhanu Prasad Merakanapalli. All rights reserved. System Operational.
                                </p>
                            </footer>
                        </div>
                    }
                />
                <Route path="/admin-chat" element={<AdminChatPanel />} />
            </Routes>
        </Router>
    );
};

export default App;
