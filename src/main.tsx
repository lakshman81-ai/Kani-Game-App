import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './contexts/AppContext';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <AppProvider>
                <App />
            </AppProvider>
        </React.StrictMode>
    );
}
