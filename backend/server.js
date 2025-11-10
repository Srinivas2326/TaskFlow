const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");  // ✅ Add this line

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Fix: Use an absolute path instead of a relative one
const dbPath = path.join(__dirname, "../database/taskflow.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to database:", err.message);
  } else {
    console.log("✅ Connected to the SQLite database.");
  }
});

// ✅ Ensure table creation
db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)");

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  db.run("INSERT INTO tasks (title) VALUES (?)", [title], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Task added!" });
  });
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Task deleted!" });
  });
});

app.listen(5000, () => console.log("🚀 Node.js Server running on port 5000"));
