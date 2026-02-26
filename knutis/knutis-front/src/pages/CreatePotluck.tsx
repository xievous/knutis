import { useState } from "react"
import { Box, Button, Divider, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { type Potluck, type Dish } from "../types/potluck";
import { createPotluck, addDish, getPotluck } from "../api/potlucks";
export default function CreatePotluck() {  

const [step, setStep] = useState(1)
const [reviewData, setReviewData] = useState<Potluck | null>(null)
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

  const handleReview = async () => {
    if (!potluckId) return

    const data = await getPotluck(potluckId)
    setReviewData(data)
    setStep(3)
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
if(step === 2) {
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
            <Button variant="contained" onClick={handleReview}>
                Review
            </Button>
        </Box>
    </Box>
)
}

if(step === 3 && reviewData) {
    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5">{reviewData.title}</Typography>
            <Typography>Date: {reviewData.date}</Typography>
            <Typography>Location: {reviewData.location}</Typography>
            <Typography>{reviewData.description}</Typography>

            <Divider/>

            <Typography variant="h6">Dishes</Typography>
            {reviewData.dishes?.map((dish) => (
                <Box key={dish.id} sx={{border: "1px solid #ccc", p: 2}}>
                    <Typography fontWeight="bold">
                        {dish.name} - {dish.type}
                    </Typography>
                    <Typography>{dish.details}</Typography>
                    <Typography>Allergens: {dish.allergens}</Typography>
                </Box>
            ))}

            <Box display="flex" justifyContent="space-between">
                <Button onClick={() => setStep(2)}>Back</Button>
                <Button variant="contained" color="success">
                    Finalize
                </Button>
            </Box>
        </Box>
    )
}
}
