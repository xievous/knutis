import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { getAllPotlucks } from "../api/potlucks";
import { type Potluck } from "../types/potluck";

export default function Home() {
  const navigate = useNavigate();

  const [potlucks, setPotlucks] = useState<Potluck[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPotlucks();
      setPotlucks(data);
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{ marginTop: "10px", marginBottom: "10px" }}
      >
        <Typography variant="h4">Knutis</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/create")}
        >
          Create Potluck
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gridGap: "50px",
        }}
      >
        {potlucks.map((potluck) => (
          <Card key={potluck.id}>
            <CardContent>
              <Typography variant="h6">{potluck.title}</Typography>
              <Typography>Date: {potluck.date}</Typography>
              <Typography>Location: {potluck.location}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
