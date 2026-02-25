import type { Dish, Potluck } from "../types/potluck"

const API = "http://localhost:3000/api"

export async function createPotluck(data: Potluck) {
    const res = await fetch(`${API}/potlucks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    return res.json()
}

export async function addDish(potluckId: number, dish: Dish) {
    const res = await fetch(`${API}/potlucks/${potluckId}/dishes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dish)
    }) 
    return res.json()
}

export async function getPotluck(id: number) {
    const res = await fetch(`${API}/potlucks/${id}`)
    return res.json()
}

