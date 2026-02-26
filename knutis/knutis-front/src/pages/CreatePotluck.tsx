import { useState } from "react"
import { Box, Button, TextField } from "@mui/material";
import { type Potluck } from "../types/potluck";
import { createPotluck } from "../api/potlucks";
export default function CreatePotluck() {  

const [form, setForm] = useState<Potluck>({
    title: "",
    date: "",
    location: "",
    description: ""
  })
  
  const [potluckId, setPotluckId] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    })
  }

  const handleNext = async () => {
    if(!form.title) return alert("Title required")

    const result = await createPotluck(form)
    setPotluckId(result.potluckId)
    alert("Potluck created! ID: " + result.potluckId)
    
    }

  if (potluckId) {
    return <div>Step 2 coming next... Potluck ID: {potluckId}</div>
  }


return (
   <Box display="flex" flexDirection="column" gap={2}>
        <TextField 
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
        />
        <TextField
        label="Date"
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true}}
        />
        <TextField
        label="Location"
        name="location"
        value={form.location}
        onChange={handleChange}
        />
        <TextField
        label="Description"
        name="description"
        multiline
        rows={3}
        value={form.description}
        onChange={handleChange}
        />

        <Button variant="contained" onClick={handleNext}>
            Continue
        </Button>
   </Box>
  )
}
