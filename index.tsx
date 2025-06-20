import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import global CSS

// This is a placeholder for process.env.API_KEY. 
// In a real build environment (like Vite, Create React App), this would be handled by the build tool
// and environment variables (e.g., VITE_API_KEY).
// For this environment, if you need to test Gemini API features, you might need to manually set it.
// For example: (window as any).process = { env: { API_KEY: "YOUR_GEMINI_API_KEY_HERE" } };
// Ensure this is done *before* any service that uses it is imported/initialized.
// However, the prompt specifies API_KEY MUST be obtained from process.env.API_KEY.
// We will assume `process.env.API_KEY` is globally available in the execution context.
// No UI for API key input.

// Vite specific way to access env variables: import.meta.env.VITE_API_KEY
// For now, continue assuming process.env.API_KEY is somehow globally available
// as per the original constraint. If using Vite conventions, it would be:
// if (import.meta.env.VITE_API_KEY) {
//   (window as any).process = { env: { API_KEY: import.meta.env.VITE_API_KEY } };
// }


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
