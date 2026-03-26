const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require("cors");
const path = require("path");

const { authenticateToken, authorizeRole } = require("./middleware/auth");
const purchaseRoutes = require("./routes/purchases");
const transferRoutes = require("./routes/transfers");
const assignmentRoutes = require("./routes/assignments");
const authRoutes = require("./routes/auth");
const assetRoutes = require("./routes/assets");

const app = express();
app.use(
  cors({
    origin: "https://military-management-system-gy3o.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

let db = null;
const dbpath = path.join(__dirname, "militaryAsset.db");

const initializeAndStartServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    );

    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      quantity INTEGER,
      base TEXT
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_name TEXT,
      quantity INTEGER,
      base TEXT,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id INTEGER,
      from_base TEXT,
      to_base TEXT,
      quantity INTEGER,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id INTEGER,
      assigned_to TEXT,
      quantity INTEGER,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT,
      user TEXT,
      timestamp TEXT
    );
    `);

    await db.run(`
    INSERT OR IGNORE INTO users (email, password, role) VALUES
    ('admin@test.com','1234','admin'),
    ('commander@test.com','1234','commander'),
    ('logistics@test.com','1234','logistics')
    `);
    const assetCheck = await db.get("SELECT COUNT(*) as count FROM assets");
    if (assetCheck.count === 0) {
      await db.run(`
      INSERT INTO assets (name, type, quantity, base) VALUES
      ('M1 Abrams Tank', 'Vehicle', 12, 'Nellore North'),
      ('MQ-9 Reaper', 'UAV', 4, 'Nellore North'),
      ('M4 Carbine', 'Firearm', 150, 'Hyderabad Central'),
      ('Patriot Missile System', 'Defense', 2, 'Vizag Port')
      `);

      const now = new Date().toISOString();
      await db.run(`
      INSERT INTO purchases (asset_name, quantity, base, date) VALUES
      ('M1 Abrams Tank', 12, 'Nellore North', '${now}'),
      ('M4 Carbine', 150, 'Hyderabad Central', '${now}')
      `);
    }
    app.use("/api/purchases", purchaseRoutes(db));
    app.use("/api/transfers", transferRoutes(db));
    app.use("/api/assignments", assignmentRoutes(db));
    app.use("/api/auth", authRoutes(db));
    app.use("/api/assets", assetRoutes(db));

    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000/");
    });
  } catch (e) {
    console.log(`error ${e}`);
    process.exit(1);
  }
};

initializeAndStartServer();
