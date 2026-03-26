const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET_KEY = "MILITARY_SECRET";

module.exports = (db) => {
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await db.get(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
      );

      if (user) {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          SECRET_KEY,
          { expiresIn: "24h" },
        );

        res.json({
          token,
          role: user.role,
          message: "Login successful",
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  return router;
};
