const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.render("products", { title: "Products", products: rows });
});

module.exports = router;
