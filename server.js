const express = require("express");
const path = require("path");
const app = express();
const db = require("./config/db"); 

const mainRoutes = require("./routes/main");
const productRoutes = require("./routes/products");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


app.use("/", mainRoutes);
app.use("/products", productRoutes);


app.post("/cart/add", async (req, res) => {
  const { product_id, quantity } = req.body;

  try {
 
    const [existing] = await db.query(
      "SELECT * FROM cart WHERE product_id = ?",
      [product_id]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE product_id = ?",
        [quantity || 1, product_id]
      );
    } else {
      await db.query(
        "INSERT INTO cart (product_id, quantity) VALUES (?, ?)",
        [product_id, quantity || 1]
      );
    }

    res.redirect("/cart");
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).send("Database error");
  }
});

app.post("/cart/remove", async (req, res) => {
  const { id } = req.body;
  try {
    await db.query("DELETE FROM cart WHERE id = ?", [id]);
    res.redirect("/cart");
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).send("Database error");
  }
});

app.get("/cart", async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT cart.id, products.name, products.price, cart.quantity 
       FROM cart 
       JOIN products ON cart.product_id = products.id`
    );

    res.render("cart", { cart: items });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).send("Database error");
  }
});

app.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);
