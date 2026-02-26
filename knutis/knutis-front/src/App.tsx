import { Container, Typography } from "@mui/material";
import CreatePotluck from "./pages/CreatePotluck";

export default function App() {

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{mt:4, mb:4}}>Knutis Potluck</Typography>
      <Typography>
        <CreatePotluck/>
      </Typography>
    </Container>
  );
}
