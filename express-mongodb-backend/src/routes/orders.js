const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/auth");

// Create a new order (existing route)
router.post("/", protect, async (req, res) => {
  try {
    const { items, subtotal, shipping, tax, total } = req.body;
    if (!items?.length || subtotal == null || shipping == null || tax == null || total == null) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const orderData = {
      ...req.body,
      userId: req.userId || req.user._id,
    };
    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ message: "Order saved successfully", order });
  } catch (error) {
    console.error("Error saving order:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to save order" });
  }
});

// Get orders (modified to allow pharmacists to fetch all orders)
router.get("/", protect, async (req, res) => {
  try {
    let orders;
    if (req.user.role === "pharmacist") {
      // Pharmacists can fetch all orders
      orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'name email'); // Optionally populate user details
      console.log("Pharmacist fetching all orders:", orders.length);
    } else {
      // Regular users fetch only their own orders
      orders = await Order.find({ userId: req.userId || req.user._id })
        .sort({ createdAt: -1 });
      console.log("User fetching their orders:", orders.length);
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to fetch orders" });
  }
});

// Confirm an order (update status to "delivering")
router.patch("/:id/confirm", protect, async (req, res) => {
  try {
    if (req.user.role !== "pharmacist") {
      return res.status(403).json({ error: "Access denied: Only pharmacists can confirm orders" });
    }

    console.log("Confirming order with ID:", req.params.id);
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log("Order not found for ID:", req.params.id);
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = "completed";
    await order.save();
    console.log("Order updated to completed:", order._id);

    res.status(200).json({ message: "Order confirmed successfully", order });
  } catch (error) {
    console.error("Error confirming order:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to confirm order" });
  }
});

// Decline an order (delete the order)
router.delete("/:id", protect, async (req, res) => {
  try {
    // Ensure the user is a pharmacist
    if (req.user.role !== "pharmacist") {
      return res.status(403).json({ error: "Access denied: Only pharmacists can decline orders" });
    }

    console.log("Declining order with ID:", req.params.id);
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log("Order not found for ID:", req.params.id);
      return res.status(404).json({ error: "Order not found" });
    }

    // Delete the order
    await Order.deleteOne({ _id: req.params.id });
    console.log("Order deleted:", req.params.id);

    res.status(200).json({ message: "Order declined and deleted successfully" });
  } catch (error) {
    console.error("Error declining order:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Failed to decline order" });
  }
});

module.exports = router;