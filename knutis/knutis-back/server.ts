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
  res.json({ message: "Hello from backend " });
});

/* Create potluck */
app.post("/api/potlucks", (req, res) => {
  const { title, date, location, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title required" });
  }

  const result = db
    .prepare(
      `
        INSERT INTO potlucks (title, date, location, description)
        VALUES (?, ?, ?, ?)
    `,
    )
    .run(title, date, location, description);

  res.json({
    message: "Potluck created",
    potluckId: result.lastInsertRowid,
  });
});

/* Add dish to potluck */
app.post("/api/potlucks/:id/dishes", (req, res) => {
  const potluckId = req.params.id;
  const { name, details, type, allergens } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Dish name required" });
  }

  const result = db
    .prepare(
      `
        INSERT INTO dishes (potluck_id, name, details, type, allergens)
        VALUES (?, ?, ?, ?, ?)    
    `,
    )
    .run(potluckId, name, details, type, allergens);

  res.json({
    message: "Dish added",
    dishId: result.lastInsertRowid,
  });
});

/* Get full potluck with dishes */
app.get("/api/potlucks/:id", (req, res) => {
  const potluckId = req.params.id;

  const potluck = db
    .prepare(
      `
        SELECT * FROM potlucks WHERE id = ?
    `,
    )
    .get(potluckId);

  if (!potluck) {
    return res.status(404).json({ error: "Potluck not found" });
  }

  const dishes = db
    .prepare(
      `
        SELECT * FROM dishes WHERE potluck_id = ?
    `,
    )
    .all(potluckId);

  res.json({
    ...potluck,
    dishes,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/* Get all potlucks */
app.get("/api/potlucks", (req, res) => {
  const potlucks = db
    .prepare(
      `
        SELECT * FROM potlucks
        ORDER BY id DESC    
    `,
    )
    .all();

  res.json(potlucks);
});

/* Delete potluck */
app.delete("/api/potlucks/:id", (req, res) => {
  const potluckId = req.params.id;

  const transaction = db.transaction(() => {
    db.prepare(
      `
      DELETE FROM dishes WHERE potluck_id = ?
    `,
    ).run(potluckId);

    // Delete potluck
    const result = db
      .prepare(
        `
      DELETE FROM potlucks WHERE id = ?
    `,
      )
      .run(potluckId);

    return result.changes;
  });

  try {
    const changes = transaction();

    if (changes === 0) {
      return res.status(404).json({ error: "Potluck not found" });
    }

    res.json({ message: "Potluck deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* Edit potluck */
app.put("/api/potlucks/:id", (req, res) => {
  const { id } = req.params;
  const { title, date, location, description } = req.body;

  const result = db
    .prepare(
      `
      UPDATE potlucks
      SET title = ?, date = ?, location = ?, description = ?
      WHERE id = ?
    `,
    )
    .run(title, date, location, description, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Potluck not found" });
  }

  res.json({ message: "Potluck updated" });
});

/* Update Dish */
app.put("/api/dishes/:id", (req, res) => {
  const { id } = req.params;
  const { name, type, details, allergens } = req.body;

  const result = db
    .prepare(
      `
      UPDATE dishes
      SET name = ?, type = ?, details = ?, allergens = ?
      WHERE id = ?
    `,
    )
    .run(name, type, details, allergens, id);

  res.json({ message: "Dish updated" });
});

/* Delete dish in potluck */
app.delete("/api/dishes/:id", (req, res) => {
  const { id } = req.params;

  db.prepare(`DELETE FROM dishes WHERE id = ?`).run(id);

  res.json({ message: "Dish deleted" });
});
