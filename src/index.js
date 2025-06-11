import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Import the main App component

// Get the root element from index.html
const container = document.getElementById('root');
// Create a React root
const root = createRoot(container);

// Render the App component inside the root
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
