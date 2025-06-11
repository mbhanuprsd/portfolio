import React from 'react';

const SkillsSection = () => (
    <section
        id="skills"
        className="my-8 sm:my-10 md:my-12 p-4 sm:p-6 md:p-8 bg-black bg-opacity-70 rounded-lg shadow-lg border border-green-700 mx-2 sm:mx-4 md:mx-8"
    >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-shadow-green">
            Operational Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-green-500">
                    <i className="fas fa-microchip mr-2"></i>Game Engine & Dev Environment
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li><span className="text-green-400">Unreal Engine:</span> C++ Gameplay Programming, Blueprints, Material Editor, 3D Model & Animation integration.</li>
                    <li><span className="text-green-400">Unity3D:</span> Full-stack development, C# scripting, Asset Management, Performance Profiling.</li>
                    <li><span className="text-green-400">Version Control:</span> Git & Perforce(Advanced Branching Strategies, Conflict Resolution).</li>
                </ul>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-green-500">
                    <i className="fas fa-mobile-alt mr-2"></i>Mobile Platform & Frameworks
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li><span className="text-green-400">Android (Java):</span> Android SDK, Jetpack Compose, UI/UX optimization for diverse screen densities.</li>
                    <li><span className="text-green-400">Flutter/Dart:</span> Cross-platform UI toolkit for expressive and performant applications.</li>
                    <li><span className="text-green-400">iOS (Objective-C):</span> UIKit, Core Animation, Core Framework</li>
                </ul>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-green-500">
                    <i className="fas fa-terminal mr-2"></i>Languages & Scripting
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li><span className="text-green-400">C++:</span> High-performance algorithms, Memory Management, Low-level system interaction for game engines.</li>
                    <li><span className="text-green-400">C#:</span> Game logic, .NET ecosystem.</li>
                    <li><span className="text-green-400">JavaScript:</span> Web technologies, tooling, backend (Node.js).</li>
                    <li><span className="text-green-400">Python:</span> Tooling, Automation, Data Processing, Machine Learning integration (e.g., for procedural content).</li>
                </ul>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-green-500">
                    <i className="fas fa-server mr-2"></i>Backend & Cloud Infrastructure
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li><span className="text-green-400">Firebase:</span> Realtime Database, Authentication, Cloud Functions for scalable backend services.</li>
                    <li><span className="text-green-400">RESTful APIs:</span> Design and consumption for dynamic content delivery.</li>
                    <li><span className="text-green-400">Database Systems:</span> SQL (PostgreSQL, MySQL), NoSQL (MongoDB, Firestore) for persistent data storage.</li>
                </ul>
            </div>
        </div>
    </section>
);

export default SkillsSection;