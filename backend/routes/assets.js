const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

module.exports = (db) => {
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const assets = await db.all("SELECT * FROM assets");
      res.json(assets);
    } catch (e) {
      console.error(e.message);
      res.status(500).json({ message: "Error fetching assets from database" });
    }
  });

  router.get("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const asset = await db.get("SELECT * FROM assets WHERE id = ?", [id]);
      if (asset) {
        res.json(asset);
      } else {
        res.status(404).json({ message: "Asset not found" });
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });

  return router;
};
