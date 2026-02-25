export type Dish = {
    id?: number
    name: string
    details?: string
    type: "meat" | "vegetarian" | "vegan"
    allergens?: string
}

export type Potluck = {
    id?: number
    title: string
    date?: string
    location?: string
    description?: string
    dishes?: Dish[]
}

export type CreatePotluckResponse = {
  message: string
  potluckId: number
}