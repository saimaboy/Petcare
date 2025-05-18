const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create a new order
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;
    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ message: "Order saved successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to save order" });
  }
});

module.exports = router;