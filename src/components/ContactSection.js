import React from 'react';

const ContactSection = () => (
    <section
        id="contact"
        className="my-8 sm:my-10 md:my-12 p-4 sm:p-6 md:p-8 bg-black bg-opacity-70 rounded-lg shadow-lg border border-green-700 mx-2 sm:mx-4 md:mx-8 text-center"
    >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-shadow-green">
            Initiate Secure Communication Protocol
        </h2>
        <p className="mb-6 text-gray-300 leading-relaxed">
            Ready to integrate a high-level mobile or game development asset into your next project?
            Send an encrypted transmission. My systems are always online for critical data exchange.
        </p>
        <div className="space-y-4">
            <p className="text-xl">
                <i className="fas fa-envelope mr-3 text-green-500"></i>
                <a
                    href="mailto:mbhanuprsd@gmail.com"
                    className="text-green-400 hover:underline transition duration-300"
                >
                    mbhanuprsd@gmail.com
                </a>
            </p>
            <p className="text-xl">
                <i className="fas fa-link mr-3 text-green-500"></i>
                <a
                    href="https://www.linkedin.com/in/mbhanuprasad/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline transition duration-300"
                >
                    LinkedIn Profile (Access Protocol)
                </a>
            </p>
            <p className="text-xl">
                <i className="fab fa-github mr-3 text-green-500"></i>
                <a
                    href="https://github.com/mbhanuprsd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline transition duration-300"
                >
                    GitHub Repository (Codebase Access)
                </a>
            </p>
        </div>
    </section>
);

export default ContactSection;