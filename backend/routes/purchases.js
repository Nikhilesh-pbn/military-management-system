const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/auth");

module.exports = (db) => {
  router.post(
    "/",
    authenticateToken,
    authorizeRole(["admin", "logistics"]),
    async (req, res) => {
      const { asset_name, quantity, base, type } = req.body;
      const date = new Date().toISOString();

      try {
        await db.run(
          "INSERT INTO purchases (asset_name, quantity, base, date) VALUES (?,?,?,?)",
          [asset_name, quantity, base, date],
        );
        const existing = await db.get(
          "SELECT * FROM assets WHERE name = ? AND base = ?",
          [asset_name, base],
        );
        if (existing) {
          await db.run(
            "UPDATE assets SET quantity = quantity + ? WHERE id = ?",
            [quantity, existing.id],
          );
        } else {
          await db.run(
            "INSERT INTO assets (name, type, quantity, base) VALUES (?,?,?,?)",
            [asset_name, type, quantity, base],
          );
        }

        res.status(201).send("Purchase recorded and inventory updated.");
      } catch (e) {
        res.status(500).send(e.message);
      }
    },
  );
  return router;
};
