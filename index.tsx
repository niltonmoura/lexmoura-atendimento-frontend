// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import FrameGuard from './components/FrameGuard.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento #root não encontrado');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
        <FrameGuard>
          <App />
        </FrameGuard>
    </ErrorBoundary>
  </React.StrictMode>
);