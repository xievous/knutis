"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var better_sqlite3_1 = require("better-sqlite3");
var db = new better_sqlite3_1.default("data/knutis.db");
/* Potluck table */
db.prepare("\n        CREATE TABLE IF NOT EXISTS potlucks (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        title TEXT NOT NULL,\n        date TEXT,\n        location TEXT,\n        description TEXT\n        )\n    ").run();
/* Dish table */
db.prepare("\n    CREATE TABLE IF NOT EXISTS dishes (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    potluck_id INTEGER,\n    name TEXT NOT NULL,\n    details TEXT,\n    type TEXT,\n    allergens TEXT,\n    FOREIGN KEY (potluck_id) REFERENCES potlucks(id)\n    )\n    ").run();
exports.default = db;
