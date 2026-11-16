import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import themePrimary from './theme/themePrimary';

// Import the Roboto font
import '@fontsource/roboto/400.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={themePrimary}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
