import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";

export default function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/test")
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return (
    <Container>
      <Typography variant="h4">Knutis Potluck</Typography>
      <Typography>{msg}</Typography>
    </Container>
  );
}
