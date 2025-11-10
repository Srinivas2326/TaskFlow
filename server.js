const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// ====== Database Path ======
const dbDir = path.join(__dirname, "database");
const dbPath = path.join(dbDir, "taskflow.db");

// Ensure database folder exists
const fs = require("fs");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Failed to connect to DB:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// ====== Create Table ======
db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)");

// ====== API Routes ======
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;
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

// ====== Serve Frontend ======
app.use(express.static(path.join(__dirname, "frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ====== Start Flask Microservice ======
const flaskProcess = spawn("python", ["analytics.py"]);

flaskProcess.stdout.on("data", (data) => console.log(`🐍 Flask: ${data}`));
flaskProcess.stderr.on("data", (data) => console.error(`❌ Flask Error: ${data}`));

// ====== Start Node.js Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Node.js Server running on port ${PORT}`));
