import Database from "better-sqlite3";

const db = new Database("data/knutis.db");

// Foreign key enforcement is off by default in SQLite and must be enabled
// per connection so ON DELETE CASCADE actually fires.
db.pragma("foreign_keys = ON");

/* Potluck table */
db.prepare(`
        CREATE TABLE IF NOT EXISTS potlucks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT,
        location TEXT,
        description TEXT
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
    FOREIGN KEY (potluck_id) REFERENCES potlucks(id) ON DELETE CASCADE
    )
    `).run();

export default db;