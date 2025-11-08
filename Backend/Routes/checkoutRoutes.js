import express from "express";
import Cart from "../Model/Cart.js";
import Receipt from "../Model/Receipt.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    const cart = await Cart.find().populate("productId");

    if (!cart.length) return res.status(400).json({ message: "Cart is empty!" });

    const total = cart.reduce((sum, item) => sum + ((item.productId?.price ?? 0) * item.qty), 0);

    const receipt = await Receipt.create({
      items: cart
        .map((c) =>
          c.productId
            ? {
                name: c.productId.name,
                qty: c.qty,
                price: c.productId.price,
              }
            : null
        )
        .filter((i) => i !== null),
      total,
      name,
      email,
    });

    await Cart.deleteMany(); // clear cart
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
