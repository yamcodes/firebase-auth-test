import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, BaseStyles } from '@primer/react';
import { App } from './app';
import './index.css';

const container = document.getElementById('root');

if (!container) throw new Error('Failed to find the root element');

createRoot(container).render(
  <ThemeProvider>
    <BaseStyles>
      <StrictMode>
        <App />
      </StrictMode>
    </BaseStyles>
  </ThemeProvider>
);
