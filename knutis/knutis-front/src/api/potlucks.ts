import type { Dish, Potluck, CreatePotluckResponse } from "../types/potluck"

const API = "http://localhost:3000/api"

export async function createFullPotluck(
  data: Potluck,
  dishes: Dish[]
): Promise<CreatePotluckResponse> {
  const res = await fetch(`${API}/potlucks/full`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, dishes }),
  })

  if (!res.ok) {
    throw new Error("Failed to create potluck")
  }

  return res.json()
}