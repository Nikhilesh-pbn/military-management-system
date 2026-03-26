const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/auth");

module.exports = (db) => {
  router.post(
    "/",
    authenticateToken,
    authorizeRole(["admin", "commander"]),
    async (req, res) => {
      const { asset_id, from_base, to_base, quantity } = req.body;
      const date = new Date().toISOString();
      try {
        const asset = await db.get(
          "SELECT * FROM assets WHERE id = ? AND base = ?",
          [asset_id, from_base],
        );
        if (!asset || asset.quantity < quantity) {
          return res.status(400).send("Insufficient stock at source base.");
        }
        await db.run("UPDATE assets SET quantity = quantity - ? WHERE id = ?", [
          quantity,
          asset_id,
        ]);
        const destAsset = await db.get(
          "SELECT * FROM assets WHERE name = ? AND base = ?",
          [asset.name, to_base],
        );
        if (destAsset) {
          await db.run(
            "UPDATE assets SET quantity = quantity + ? WHERE id = ?",
            [quantity, destAsset.id],
          );
        } else {
          await db.run(
            "INSERT INTO assets (name, type, quantity, base) VALUES (?,?,?,?)",
            [asset.name, asset.type, quantity, to_base],
          );
        }
        await db.run(
          "INSERT INTO transfers (asset_id, from_base, to_base, quantity, date) VALUES (?,?,?,?,?)",
          [asset_id, from_base, to_base, quantity, date],
        );
        res.send("Transfer successful.");
      } catch (e) {
        res.status(500).send(e.message);
      }
    },
  );
  return router;
};
