import React from 'react';

function App() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                maxWidth: '600px'
            }}>
                <h1 style={{ color: '#1890ff', marginBottom: '20px' }}>
                    ✅ React is Working!
                </h1>
                <p style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>
                    If you can see this message, React is rendering correctly.
                </p>
                <p style={{ fontSize: '16px', color: '#666' }}>
                    Current time: {new Date().toLocaleTimeString()}
                </p>
                <hr style={{ margin: '20px 0' }} />
                <p style={{ fontSize: '14px', color: '#999' }}>
                    This is a test component. The full application will load shortly.
                </p>
            </div>
        </div>
    );
}

export default App;
