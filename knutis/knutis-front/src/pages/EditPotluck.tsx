import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { type Dish, type Potluck } from "../types/potluck";
import { deletePotluck, getPotluck, updatePotluck } from "../api/potlucks";
import { deleteDish } from "../api/dishes";
import DishTypeChip from "../components/DishTypeChip";

export default function EditPotluck() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [potluck, setPotluck] = useState<Potluck | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [titleError, setTitleError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await getPotluck(Number(id));
      setPotluck(data);
      setTitle(data.title ?? "");
      setDate(data.date ?? "");
      setLocation(data.location ?? "");
      setDescription(data.description ?? "");
      setDishes(data.dishes ?? []);
    };

    fetchData();
  }, [id]);

  if (!id) {
    return <Typography>No potluck id provided.</Typography>;
  }

  const idNumber = Number(id);

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    setIsSaving(true);
    try {
      await updatePotluck(idNumber, {
        ...(potluck ?? {}),
        title,
        date,
        location,
        description,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to save potluck");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePotluck = async () => {
    if (!confirm("Delete this potluck? This can't be undone.")) return;

    setIsDeleting(true);
    try {
      await deletePotluck(idNumber);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to delete potluck");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteDish = async (dishId?: number) => {
    if (!dishId) return;
    if (!confirm("Delete this dish from the potluck?")) return;

    try {
      await deleteDish(dishId);
      setDishes((prev) => prev.filter((d) => d.id !== dishId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete dish");
    }
  };

  if (!potluck) {
    return (
      <Box sx={{ maxWidth: 620, mx: "auto" }}>
        <Skeleton width="50%" height={48} />
        <Skeleton variant="rounded" height={320} sx={{ mt: 3, borderRadius: "16px" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 620, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(`/potluck/${id}`)}
        sx={{ color: "text.secondary", mb: 2, ml: -1 }}
      >
        Back
      </Button>

      <Typography variant="h3" sx={{ mb: 3 }}>
        Edit potluck
      </Typography>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError(false);
              }}
              required
              error={titleError}
              helperText={titleError ? "Title is required" : " "}
            />
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
            />

            <Box display="flex" gap={1.5} flexWrap="wrap">
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
              <Button variant="outlined" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button
                variant="text"
                color="error"
                onClick={handleDeletePotluck}
                disabled={isDeleting}
                sx={{ ml: { sm: "auto" } }}
              >
                {isDeleting ? "Deleting..." : "Delete potluck"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Dishes
      </Typography>
      {dishes.length === 0 && (
        <Typography color="text.secondary">No dishes added yet.</Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {dishes.map((dish) => (
          <Card key={dish.id}>
            <CardContent
              sx={{
                p: 2.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 1,
                "&:last-child": { pb: 2.5 },
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontSize: 18 }}>
                    {dish.name}
                  </Typography>
                  <DishTypeChip type={dish.type} />
                </Box>
                {dish.details && (
                  <Typography variant="body2" color="text.secondary">
                    {dish.details}
                  </Typography>
                )}
                {dish.allergens && (
                  <Typography variant="body2" color="text.secondary">
                    Allergens: {dish.allergens}
                  </Typography>
                )}
              </Box>
              <IconButton
                aria-label={`Delete ${dish.name}`}
                onClick={() => handleDeleteDish(dish.id)}
                sx={{ color: "text.secondary" }}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
