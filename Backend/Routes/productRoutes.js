import express from "express";
import axios from "axios";
import Product from "../Model/Product.js";

const router = express.Router();

// Fetch & cache products from FakeStoreAPI
router.get("/seed", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const { data } = await axios.get("https://fakestoreapi.com/products?limit=16");
      const formatted = data.map((p) => ({
        name: p.title,
        price: p.price,
        image: p.image,
      }));
      await Product.insertMany(formatted);
      return res.json({ message: "Products fetched from FakeStoreAPI & stored in DB" });
    }
    res.json({ message: "Products already exist in DB" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;
