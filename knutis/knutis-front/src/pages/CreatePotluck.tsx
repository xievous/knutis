import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { type Potluck, type Dish } from "../types/potluck";
import { createPotluck, addDish } from "../api/potlucks";
import { useNavigate } from "react-router";

// Dishes are kept in local state until the user finalizes, so we attach a
// stable client-side id to use as the React key instead of the array index.
type LocalDish = Dish & { clientId: string };

const emptyDishForm: Dish = {
  name: "",
  details: "",
  type: "meat",
  allergens: "",
};

export default function CreatePotluck() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<Potluck>({
    title: "",
    date: "",
    location: "",
    description: "",
  });
  const [titleError, setTitleError] = useState(false);

  const [dishForm, setDishForm] = useState<Dish>(emptyDishForm);
  const [dishes, setDishes] = useState<LocalDish[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  /* Step 1 */
  const handlePotluckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "title" && e.target.value.trim()) {
      setTitleError(false);
    }
  };

  // Step 1 no longer talks to the backend: nothing is persisted until Finalize,
  // which removes the duplicate/orphan rows that came from saving early.
  const handleContinue = () => {
    if (!form.title.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);
    setStep(2);
  };

  /* Step 2 */
  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDishForm({
      ...dishForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddDish = () => {
    if (!dishForm.name.trim()) return;

    setDishes((prev) => [
      ...prev,
      { ...dishForm, clientId: crypto.randomUUID() },
    ]);
    setDishForm(emptyDishForm);
  };

  const handleRemoveDish = (clientId: string) => {
    setDishes((prev) => prev.filter((dish) => dish.clientId !== clientId));
  };

  /* Step 3 */
  const handleFinalize = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { potluckId } = await createPotluck(form);

      for (const dish of dishes) {
        await addDish(potluckId, dish);
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create potluck. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 1) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handlePotluckChange}
          required
          error={titleError}
          helperText={titleError ? "Title is required" : ""}
        />
        <TextField
          label="Date"
          type="date"
          name="date"
          value={form.date}
          onChange={handlePotluckChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handlePotluckChange}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          value={form.description}
          onChange={handlePotluckChange}
        />

        <Button variant="contained" onClick={handleContinue}>
          Continue
        </Button>
      </Box>
    );
  }

  if (step === 2) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6">Add Dishes</Typography>

        <TextField
          label="Dish Name"
          name="name"
          value={dishForm.name}
          onChange={handleDishChange}
        />

        <TextField
          label="Details"
          name="details"
          value={dishForm.details}
          onChange={handleDishChange}
        />

        <Typography>Type</Typography>
        <RadioGroup
          name="type"
          value={dishForm.type}
          onChange={handleDishChange}
        >
          <FormControlLabel value="meat" control={<Radio />} label="Meat" />
          <FormControlLabel
            value="vegetarian"
            control={<Radio />}
            label="Vegetarian"
          />
          <FormControlLabel value="vegan" control={<Radio />} label="Vegan" />
        </RadioGroup>

        <TextField
          label="Allergens"
          name="allergens"
          value={dishForm.allergens}
          onChange={handleDishChange}
        />

        <Button variant="contained" onClick={handleAddDish}>
          Add Dish
        </Button>

        <Divider />

        <Typography variant="subtitle1">Added Dishes:</Typography>
        {dishes.length === 0 && (
          <Typography variant="body2">No dishes added yet.</Typography>
        )}
        {dishes.map((dish) => (
          <Box
            key={dish.clientId}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <strong>{dish.name}</strong> - {dish.type}
              <div>{dish.allergens}</div>
            </Box>
            <Button
              size="small"
              color="secondary"
              onClick={() => handleRemoveDish(dish.clientId)}
            >
              Remove
            </Button>
          </Box>
        ))}

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={() => setStep(1)}>Back</Button>
          <Button variant="contained" onClick={() => setStep(3)}>
            Review
          </Button>
        </Box>
      </Box>
    );
  }

  if (step === 3) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h5">{form.title}</Typography>
        <Typography>Date: {form.date}</Typography>
        <Typography>Location: {form.location}</Typography>
        <Typography>{form.description}</Typography>

        <Divider />

        <Typography variant="h6">Dishes</Typography>
        {dishes.length === 0 && (
          <Typography variant="body2">No dishes added.</Typography>
        )}
        {dishes.map((dish) => (
          <Box key={dish.clientId} sx={{ border: "1px solid #ccc", p: 2 }}>
            <Typography fontWeight="bold">
              {dish.name} - {dish.type}
            </Typography>
            <Typography>{dish.details}</Typography>
            <Typography>Allergens: {dish.allergens}</Typography>
          </Box>
        ))}

        <Box display="flex" justifyContent="space-between">
          <Button onClick={() => setStep(2)} disabled={isSubmitting}>
            Back
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleFinalize}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Finalize"}
          </Button>
        </Box>
      </Box>
    );
  }

  return null;
}
