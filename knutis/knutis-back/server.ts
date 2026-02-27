import express from "express";
import cors from "cors";
import db from "./data/database.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Knutis API running with SQLite :)");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Hello from backend "});
})

/* Create full potluck (potluck + dishes) atomically */
app.post("/api/potlucks/full", (req, res) => {
    const { title, date, location, description, dishes } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title required" });
    }

    const createPotluckWithDishes = db.transaction((potluckData, dishList = []) => {
        const result = db.prepare(`
            INSERT INTO potlucks (title, date, location, description)
            VALUES (?, ?, ?, ?)
        `).run(potluckData.title, potluckData.date, potluckData.location, potluckData.description);

        const potluckId = result.lastInsertRowid;

        if (Array.isArray(dishList) && dishList.length > 0) {
            const insertDish = db.prepare(`
                INSERT INTO dishes (potluck_id, name, details, type, allergens)
                VALUES (?, ?, ?, ?, ?)
            `);

            for (const dish of dishList) {
                if (!dish.name) {
                    throw new Error("Dish name required");
                }
                insertDish.run(potluckId, dish.name, dish.details, dish.type, dish.allergens);
            }
        }

        return potluckId;
    });

    try {
        const potluckId = createPotluckWithDishes({ title, date, location, description }, dishes);
        res.json({
            message: "Potluck created",
            potluckId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create potluck" });
    }
});

/* Get full potluck with dishes */
app.get("/api/potlucks/:id", (req, res) => {
    const potluckId = req.params.id;

    const potluck = db.prepare(`
        SELECT * FROM potlucks WHERE id = ?
    `).get(potluckId);

    if (!potluck) {
        return res.status(404).json({ error: "Potluck not found" });
    }

    const dishes = db.prepare(`
        SELECT * FROM dishes WHERE potluck_id = ?
    `).all(potluckId);

    res.json({
        ...potluck,
        dishes
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
