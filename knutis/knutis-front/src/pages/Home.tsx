import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { getAllPotlucks } from "../api/potlucks";
import {type Potluck} from "../types/potluck"

export default function Home() {
    const [potlucks, setPotlucks] = useState<Potluck[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllPotlucks()
            setPotlucks(data)
        }
        fetchData()
    },[])

    return (
     <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4">All Potlucks</Typography>
        {potlucks.map((potluck) => (
            <Card key={potluck.id}>
                <CardContent>
                    <Typography variant="h6">{potluck.title}</Typography>
                    <Typography>Date: {potluck.date}</Typography>
                    <Typography>Location: {potluck.location}</Typography>
                </CardContent>
            </Card>
        ))}
      </Box>
    )
  
}