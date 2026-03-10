import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { type Potluck } from "../types/potluck";
import { getPotluck } from "../api/potlucks";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

export default function PotluckDetails() {
  const navigate = useNavigate();
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
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box>
          <Typography>{potluck.title}</Typography>
        </Box>

        <Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/edit/${potluck.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
          >
            Back
          </Button>
        </Box>
      </Box>

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
