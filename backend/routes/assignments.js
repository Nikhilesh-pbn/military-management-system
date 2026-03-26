const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

module.exports = (db) => {
  router.post("/", authenticateToken, async (req, res) => {
    const { asset_id, assigned_to, quantity } = req.body;
    const date = new Date().toISOString();

    try {
      const asset = await db.get("SELECT * FROM assets WHERE id = ?", [
        asset_id,
      ]);
      if (!asset || asset.quantity < quantity) {
        return res
          .status(400)
          .send("Not enough assets available for assignment.");
      }

      await db.run("UPDATE assets SET quantity = quantity - ? WHERE id = ?", [
        quantity,
        asset_id,
      ]);
      await db.run(
        "INSERT INTO assignments (asset_id, assigned_to, quantity, date) VALUES (?,?,?,?)",
        [asset_id, assigned_to, quantity, date],
      );

      res.send("Assignment recorded.");
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  return router;
};
