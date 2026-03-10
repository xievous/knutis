import { type Dish } from "../types/potluck";

const API = "http://localhost:3000/api";

export async function updateDish(id: number, data: Dish) {
  await fetch(`${API}/dishes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteDish(id: number) {
  await fetch(`${API}/dishes/${id}`, {
    method: "DELETE",
  });
}

export async function createDish(data: Dish) {
  await fetch(`${API}/dishes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
