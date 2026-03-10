import type { Dish, Potluck, CreatePotluckResponse } from "../types/potluck";

const API = "http://localhost:3000/api";

export async function createPotluck(
  data: Potluck,
): Promise<CreatePotluckResponse> {
  const res = await fetch(`${API}/potlucks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function addDish(potluckId: number, dish: Dish) {
  const res = await fetch(`${API}/potlucks/${potluckId}/dishes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dish),
  });
  return res.json();
}

export async function getPotluck(id: number) {
  const res = await fetch(`${API}/potlucks/${id}`);
  return res.json();
}

export async function updatePotluck(id: number, data: Potluck): Promise<void> {
  const res = await fetch(`${API}/potlucks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update potluck");
  }
}

export async function getAllPotlucks(): Promise<Potluck[]> {
  const res = await fetch(`${API}/potlucks`);

  if (!res.ok) {
    throw new Error("Failed to fetch potlucks");
  }

  return res.json();
}

export async function deletePotluck(id: number): Promise<void> {
  const res = await fetch(`${API}/potlucks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Delete Potluck Failed.");
  }
}
