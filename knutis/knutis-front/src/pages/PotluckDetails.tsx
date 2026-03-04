import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { type Potluck } from "../types/potluck";
import { getPotluck } from "../api/potlucks";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";

export default function PotluckDetails() {
  const { id } = useParams();
  const [potluck, setPotluck] = useState<Potluck | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await getPotluck(Number(id));
      setPotluck(data);
    };

    fetchData();
  }, [id]);

  if (!potluck) return <Typography>Loading...</Typography>;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography>{potluck.title}</Typography>
      <Typography>{potluck.date}</Typography>
      <Typography>{potluck.location}</Typography>
      <Typography>{potluck.description}</Typography>

      <Divider />

      <Typography>Dishes</Typography>

      {potluck.dishes?.map((dish) => (
        <Card key={dish.id}>
          <CardContent>
            <Typography>
              {dish.name} - {dish.type}
            </Typography>
            <Typography>{dish.details}</Typography>
            <Typography>Allergens: {dish.allergens}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
