import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Potluck API running");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Hello from backend "});
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
