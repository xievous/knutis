import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { deletePotluck, getAllPotlucks } from "../api/potlucks";
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
          <Card
            key={potluck.id}
            sx={{ cursor: "pointer", position: "relative" }}
            onClick={() => navigate(`/potluck/${potluck.id}`)}
          >
            <CardContent>
              <Typography variant="h6">{potluck.title}</Typography>
              <Typography>Date: {potluck.date}</Typography>
              <Typography>Location: {potluck.location}</Typography>

              <Button
                color="error"
                variant="outlined"
                size="small"
                sx={{
                  mt: 1,
                }}
                onClick={async (e) => {
                  e.stopPropagation(); // prevent card click navigation

                  if (!potluck.id) return;

                  if (
                    confirm("Are you sure you want to delete this potluck?")
                  ) {
                    await deletePotluck(potluck.id);

                    // Remove from state immediately
                    setPotlucks((prev) =>
                      prev.filter((p) => p.id !== potluck.id),
                    );
                  }
                }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
