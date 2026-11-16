import { createTheme } from '@mui/material/styles';

const themePrimary = createTheme({
  palette: {
    primary: {
      main: '#c6d219',
      light: '#f5e942',
      dark: '#939c10',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default themePrimary;
