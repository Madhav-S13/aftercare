import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// MINIMAL TEST - Just show text to verify React works
function TestApp() {
    return (
        <div style={{ padding: '50px', fontSize: '24px', color: 'black' }}>
            <h1>✅ React is Working!</h1>
            <p>If you can see this, React is mounting correctly.</p>
            <p>Current time: {new Date().toLocaleTimeString()}</p>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <TestApp />
    </React.StrictMode>
);
