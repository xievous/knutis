import express from "express";
import cors from "cors";
import db from "./data/database.js"

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
