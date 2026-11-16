import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Button, Typography } from '@mui/material';
import themePrimary from './theme/themePrimary';

function App() {
  return (
    <ThemeProvider theme={themePrimary}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
          Agende seu horário
        </Typography>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </Container>
    </ThemeProvider>
  );
}

export default App;
