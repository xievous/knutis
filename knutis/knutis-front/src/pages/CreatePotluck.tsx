import { useState } from "react"
import { Box, Button, Divider, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { type Potluck, type Dish } from "../types/potluck";
import { createPotluck, addDish } from "../api/potlucks";
export default function CreatePotluck() {  

const [step, setStep] = useState(1)

const [form, setForm] = useState<Potluck>({
    title: "",
    date: "",
    location: "",
    description: ""
  })
  
  const [potluckId, setPotluckId] = useState<number | null>(null)

  const [dishForm, setDishForm] = useState<Dish>({
    name:"",
    details:"",
    type: "meat",
    allergens: ""
  })

  const [dishes, setDishes] = useState<Dish[]>([])
  /* Step 1 */
  const handlePotluckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    })
  }

  const handleCreatePotluck = async () => {
    if (!form.title) return alert("Title required")
    
    const result = await createPotluck(form)
    setPotluckId(result.potluckId)
    setStep(2)
  }
  /* Step 2 */
  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDishForm({
        ...dishForm,
        [e.target.name]: e.target.value
    })
  }
  const handleAddDish = async () => {
    if(!dishForm.name || !potluckId) return

    await addDish(potluckId, dishForm)

    setDishes([...dishes, dishForm])

    setDishForm({
        name: "",
        details: "",
        type: "meat",
        allergens: ""
    })
  }
if (step === 1) {
    return (
   <Box display="flex" flexDirection="column" gap={2}>
        <TextField 
        label="Title"
        name="title"
        value={form.title}
        onChange={handlePotluckChange}
        required
        />
        <TextField
        label="Date"
        type="date"
        name="date"
        value={form.date}
        onChange={handlePotluckChange}
        InputLabelProps={{ shrink: true}}
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

        <Button variant="contained" onClick={handleCreatePotluck}>
            Continue
        </Button>
   </Box>
  )
}
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
          <FormControlLabel value="meat" control={<Radio/>} label="Meat" />
          <FormControlLabel value="vegetarian" control={<Radio/>} label="Vegetarian" />  
          <FormControlLabel value="vegan" control={<Radio/>} label="Vegan" />
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
        {dishes.map((dish, index) => (
            <Box key={index}>
                <strong>{dish.name}</strong> - {dish.type}
                <div>{dish.allergens}</div>
            </Box>
        ))}

        <Box display="flex" justifyContent="space-between" mt={2}>
            <Button onClick={() => setStep(1)}>Back</Button>
            <Button variant="contained">
                Review
            </Button>
        </Box>
    </Box>
)
}
