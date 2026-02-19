import Database from "better-sqlite3";

const db = new Database("data/knutis.db");

/* Potluck table */
db.prepare(`
        CREATE TABLE IF NOT EXISTS potlucks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT,
        location TEXT,
        description TEXT,
        )
    `).run();

/* Dish table */
db.prepare(`
    CREATE TABLE IF NOT EXISTS dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    potluck_id INTEGER,
    name TEXT NOT NULL,
    details TEXT,
    type TEXT,
    allergens TEXT,
    FOREIGN KEY (potluck_id) REFERENCES potlucks(id)
    )
    `)

export default db;