import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { type Dish, type Potluck } from "../types/potluck";
import { deletePotluck, getPotluck, updatePotluck } from "../api/potlucks";
import { deleteDish } from "../api/dishes";

export default function EditPotluck() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [potluck, setPotluck] = useState<Potluck | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [dishes, setDishes] = useState<Dish[]>([]);
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
      alert("Title is required");
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
    if (!confirm("Are you sure you want to delete this potluck?")) return;

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
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 4,
      }}
    >
      <Typography variant="h5">Edit Potluck</Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
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

      <Box display="flex" gap={2} marginTop={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDeletePotluck}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Potluck"}
        </Button>
      </Box>

      <Box marginTop={4}>
        <Typography variant="h6" gutterBottom>
          Dishes
        </Typography>
        {dishes.length === 0 && (
          <Typography variant="body2">No dishes added yet.</Typography>
        )}
        {dishes.map((dish) => (
          <Card key={dish.id} sx={{ marginBottom: 1 }}>
            <CardContent
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box>
                <Typography>
                  {dish.name} - {dish.type}
                </Typography>
                {dish.details && (
                  <Typography variant="body2">{dish.details}</Typography>
                )}
                {dish.allergens && (
                  <Typography variant="body2">
                    Allergens: {dish.allergens}
                  </Typography>
                )}
              </Box>
              <IconButton
                color="secondary"
                onClick={() => handleDeleteDish(dish.id)}
              >
                <ClearIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
