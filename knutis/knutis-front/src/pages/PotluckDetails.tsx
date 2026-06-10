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
  Skeleton,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import DishTypeChip from "../components/DishTypeChip";

export default function PotluckDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [potluck, setPotluck] = useState<Potluck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await getPotluck(Number(id));
        setPotluck(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto" }}>
        <Skeleton width={120} height={28} />
        <Skeleton width="60%" height={56} sx={{ mt: 2 }} />
        <Skeleton width="40%" height={28} />
        <Skeleton variant="rounded" height={120} sx={{ mt: 3, borderRadius: "16px" }} />
      </Box>
    );
  }

  if (!potluck) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto", textAlign: "center", py: 8 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Potluck not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          It may have been deleted.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate("/")}
        sx={{ color: "text.secondary", mb: 2, ml: -1 }}
      >
        All potlucks
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 1.5,
        }}
      >
        <Typography variant="h3" sx={{ wordBreak: "break-word" }}>
          {potluck.title}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          onClick={() => navigate(`/edit/${potluck.id}`)}
          sx={{ flexShrink: 0 }}
        >
          Edit
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, color: "text.secondary", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography>{potluck.date || "Date to be decided"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PlaceOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography>{potluck.location || "Location to be decided"}</Typography>
        </Box>
      </Box>

      {potluck.description && (
        <Typography sx={{ fontSize: 18, mb: 3 }}>
          {potluck.description}
        </Typography>
      )}

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Dishes
      </Typography>

      {(!potluck.dishes || potluck.dishes.length === 0) && (
        <Typography color="text.secondary">
          No dishes have been added yet.
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {potluck.dishes?.map((dish) => (
          <Card key={dish.id}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontSize: 18 }}>
                  {dish.name}
                </Typography>
                <DishTypeChip type={dish.type} />
              </Box>
              {dish.details && (
                <Typography color="text.secondary">{dish.details}</Typography>
              )}
              {dish.allergens && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Allergens: {dish.allergens}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
