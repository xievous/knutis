import { Chip } from "@mui/material";
import type { Dish } from "../types/potluck";

const meta: Record<Dish["type"], { label: string; bg: string; fg: string }> = {
  meat: { label: "Meat", bg: "#FBEDE8", fg: "#9A4A2C" },
  vegetarian: { label: "Vegetarian", bg: "#E7F3EA", fg: "#2C6B3F" },
  vegan: { label: "Vegan", bg: "#E2F0E0", fg: "#1F7A45" },
};

export default function DishTypeChip({ type }: { type: Dish["type"] }) {
  const { label, bg, fg } = meta[type] ?? meta.meat;
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: bg,
        color: fg,
        height: 22,
        fontSize: 12,
        borderRadius: "999px",
      }}
    />
  );
}
