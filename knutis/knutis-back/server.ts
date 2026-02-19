import express from "express";
import cors from "cors";
import "./data/database.js";
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


/* Create potluck */
app.post("/api/potlucks", (req, res) => {
    const { title, date, location, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title required" });
    }

    const result = db.prepare(`
        INSERT INTO potlucks (title, date, location, description)
        VALUES (?, ?, ?, ?)
    `).run(title, date, location, description);

    res.json({
        message: "Potluck created",
        potluckId: result.lastInsertRowid
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
