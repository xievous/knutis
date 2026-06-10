import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { type Potluck, type Dish } from "../types/potluck";
import { createPotluck, addDish } from "../api/potlucks";
import { useNavigate } from "react-router";
import DishTypeChip from "../components/DishTypeChip";

// Dishes are kept in local state until the user finalizes, so we attach a
// stable client-side id to use as the React key instead of the array index.
type LocalDish = Dish & { clientId: string };

const emptyDishForm: Dish = {
  name: "",
  details: "",
  type: "meat",
  allergens: "",
};

const steps = ["Details", "Dishes", "Review"];

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

  return (
    <Box sx={{ maxWidth: 620, mx: "auto" }}>
      <Typography variant="overline" color="primary">
        New potluck
      </Typography>
      <Typography variant="h3" sx={{ mt: 0.5, mb: 3 }}>
        {step === 1 && "The basics"}
        {step === 2 && "What's on the table?"}
        {step === 3 && "Look it over"}
      </Typography>

      <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          {step === 1 && (
            <Box display="flex" flexDirection="column" gap={2.5}>
              <TextField
                label="Title"
                name="title"
                value={form.title}
                onChange={handlePotluckChange}
                required
                error={titleError}
                helperText={titleError ? "Title is required" : " "}
                placeholder="Sunday garden lunch"
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
                placeholder="The backyard"
              />
              <TextField
                label="Description"
                name="description"
                multiline
                rows={3}
                value={form.description}
                onChange={handlePotluckChange}
                placeholder="Anything guests should know"
              />

              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Button variant="contained" onClick={handleContinue}>
                  Continue
                </Button>
              </Box>
            </Box>
          )}

          {step === 2 && (
            <Box display="flex" flexDirection="column" gap={2.5}>
              <TextField
                label="Dish name"
                name="name"
                value={dishForm.name}
                onChange={handleDishChange}
                placeholder="Roasted carrots"
              />
              <TextField
                label="Details"
                name="details"
                value={dishForm.details}
                onChange={handleDishChange}
                placeholder="Serves 6, served warm"
              />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Type
                </Typography>
                <RadioGroup
                  row
                  name="type"
                  value={dishForm.type}
                  onChange={handleDishChange}
                >
                  <FormControlLabel
                    value="meat"
                    control={<Radio />}
                    label="Meat"
                  />
                  <FormControlLabel
                    value="vegetarian"
                    control={<Radio />}
                    label="Vegetarian"
                  />
                  <FormControlLabel
                    value="vegan"
                    control={<Radio />}
                    label="Vegan"
                  />
                </RadioGroup>
              </Box>

              <TextField
                label="Allergens"
                name="allergens"
                value={dishForm.allergens}
                onChange={handleDishChange}
                placeholder="Nuts, dairy"
              />

              <Button
                variant="outlined"
                onClick={handleAddDish}
                disabled={!dishForm.name.trim()}
                sx={{ alignSelf: "flex-start" }}
              >
                Add dish
              </Button>

              <Divider />

              <Typography variant="body2" color="text.secondary">
                {dishes.length === 0
                  ? "No dishes added yet."
                  : `${dishes.length} dish${dishes.length > 1 ? "es" : ""} added`}
              </Typography>

              {dishes.map((dish) => (
                <Box
                  key={dish.clientId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    py: 1.25,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Typography fontWeight={600}>{dish.name}</Typography>
                      <DishTypeChip type={dish.type} />
                    </Box>
                    {dish.allergens && (
                      <Typography variant="body2" color="text.secondary">
                        Allergens: {dish.allergens}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    aria-label={`Remove ${dish.name}`}
                    onClick={() => handleRemoveDish(dish.clientId)}
                    sx={{ color: "text.secondary" }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Button onClick={() => setStep(1)}>Back</Button>
                <Button variant="contained" onClick={() => setStep(3)}>
                  Review
                </Button>
              </Box>
            </Box>
          )}

          {step === 3 && (
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Typography variant="h4">{form.title}</Typography>
              <Typography color="text.secondary">
                {form.date || "Date to be decided"}
                {form.location ? ` · ${form.location}` : ""}
              </Typography>
              {form.description && (
                <Typography sx={{ mt: 1 }}>{form.description}</Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 1 }}>
                Dishes
              </Typography>
              {dishes.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No dishes added.
                </Typography>
              )}
              {dishes.map((dish) => (
                <Box
                  key={dish.clientId}
                  sx={{
                    py: 1.25,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontWeight={600}>{dish.name}</Typography>
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
              ))}

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button onClick={() => setStep(2)} disabled={isSubmitting}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleFinalize}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Create potluck"}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
