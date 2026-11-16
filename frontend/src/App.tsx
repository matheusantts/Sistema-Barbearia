import { Container, Button, Typography } from '@mui/material';

function App() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        Agende seu horário
      </Typography>
      <Button variant="contained" color="primary">
        Agendar
      </Button>
    </Container>
  );
}

export default App;
