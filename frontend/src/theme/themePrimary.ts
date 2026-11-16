import { createTheme } from '@mui/material/styles';

const themePrimary = createTheme({
  palette: {
    primary: {
      main: '#c6d219',
      light: '#f5e942',
      dark: '#939c10',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#c2185b',
      contrastText: '#fff',
    },
  },
});

export default themePrimary;
