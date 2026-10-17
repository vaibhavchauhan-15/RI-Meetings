import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ui/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary title="Reach International Application Error" message="An unexpected error occurred. Please refresh or try again.">
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
