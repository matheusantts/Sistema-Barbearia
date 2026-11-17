import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import '@fontsource/roboto/latin-300.css';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';

import App from './App.tsx';
import themePrimary from './theme/themePrimary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={themePrimary}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
