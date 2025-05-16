const express = require('express');
const ItemController = require('../controllers/itemController');

const router = express.Router();
const itemController = new ItemController();

// Define item-related routes
router.post('/', itemController.createItem.bind(itemController));
router.get('/:id', itemController.getItem.bind(itemController));
router.delete('/:id', itemController.deleteItem.bind(itemController));

module.exports = router;