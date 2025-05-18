const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/auth"); // Updated to use protect

// Create a new order
router.post("/", protect, async (req, res) => {
  try {
    const { items, subtotal, shipping, tax, total } = req.body;
    if (!items?.length || subtotal == null || shipping == null || tax == null || total == null) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const orderData = {
      ...req.body,
      userId: req.userId || req.user._id, // Use req.userId or fallback to req.user._id
    };
    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ message: "Order saved successfully", order });
  } catch (error) {
    console.error("Error saving order:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to save order" });
  }
});

// Get all orders for the authenticated user
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId || req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to fetch orders" });
  }
});

module.exports = router;