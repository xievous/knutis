"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var database_js_1 = require("./data/database.js");
var app = (0, express_1.default)();
var PORT = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.send("Knutis API running with SQLite :)");
});
app.get("/api/test", function (req, res) {
    res.json({ message: "Hello from backend " });
});
/* Create potluck */
app.post("/api/potlucks", function (req, res) {
    var _a = req.body, title = _a.title, date = _a.date, location = _a.location, description = _a.description;
    if (!title) {
        return res.status(400).json({ error: "Title required" });
    }
    var result = database_js_1.default
        .prepare("\n        INSERT INTO potlucks (title, date, location, description)\n        VALUES (?, ?, ?, ?)\n    ")
        .run(title, date, location, description);
    res.json({
        message: "Potluck created",
        potluckId: result.lastInsertRowid,
    });
});
/* Add dish to potluck */
app.post("/api/potlucks/:id/dishes", function (req, res) {
    var potluckId = req.params.id;
    var _a = req.body, name = _a.name, details = _a.details, type = _a.type, allergens = _a.allergens;
    if (!name) {
        return res.status(400).json({ error: "Dish name required" });
    }
    var result = database_js_1.default
        .prepare("\n        INSERT INTO dishes (potluck_id, name, details, type, allergens)\n        VALUES (?, ?, ?, ?, ?)    \n    ")
        .run(potluckId, name, details, type, allergens);
    res.json({
        message: "Dish added",
        dishId: result.lastInsertRowid,
    });
});
/* Get full potluck with dishes */
app.get("/api/potlucks/:id", function (req, res) {
    var potluckId = req.params.id;
    var potluck = database_js_1.default
        .prepare("\n        SELECT * FROM potlucks WHERE id = ?\n    ")
        .get(potluckId);
    if (!potluck) {
        return res.status(404).json({ error: "Potluck not found" });
    }
    var dishes = database_js_1.default
        .prepare("\n        SELECT * FROM dishes WHERE potluck_id = ?\n    ")
        .all(potluckId);
    res.json(__assign(__assign({}, potluck), { dishes: dishes }));
});
app.listen(PORT, function () {
    console.log("Server running on http://localhost:".concat(PORT));
});
/* Get all potlucks */
app.get("/api/potlucks", function (req, res) {
    var potlucks = database_js_1.default
        .prepare("\n        SELECT * FROM potlucks\n        ORDER BY id DESC    \n    ")
        .all();
    res.json(potlucks);
});
/* Delete potluck */
app.delete("/api/potlucks/:id", function (req, res) {
    var potluckId = req.params.id;
    var transaction = database_js_1.default.transaction(function () {
        database_js_1.default.prepare("\n      DELETE FROM dishes WHERE potluck_id = ?\n    ").run(potluckId);
        // Delete potluck
        var result = database_js_1.default
            .prepare("\n      DELETE FROM potlucks WHERE id = ?\n    ")
            .run(potluckId);
        return result.changes;
    });
    try {
        var changes = transaction();
        if (changes === 0) {
            return res.status(404).json({ error: "Potluck not found" });
        }
        res.json({ message: "Potluck deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Delete failed" });
    }
});
