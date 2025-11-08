import express from "express";
import Cart from "../Model/Cart.js";
import Product from "../Model/Product.js";

const router = express.Router();

// ✅ Get Cart + total
router.get("/", async (req, res) => {
  try {
    // find all cart items and populate product details
    const items = await Cart.find().populate("productId");

    // calculate total price
    const total = items.reduce((sum, item) => {
      return sum + item.productId.price * item.qty;
    }, 0);

    // return consistent structure
    res.json({ items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add to Cart (Add or Update)
router.post("/", async (req, res) => {
  try {
    const { productId, qty } = req.body;

    let existing = await Cart.findOne({ productId });
    if (existing) {
      existing.qty = qty;
      await existing.save();
      res.json(existing);
    } else {
      const newItem = await Cart.create({ productId, qty });
      res.json(newItem);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { qty } = req.body;
  const item = await Cart.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  item.qty = qty;
  await item.save();
  res.json(item);
});

export default router;
