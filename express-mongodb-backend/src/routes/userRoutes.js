const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();
const userController = new UserController();

router.post('/users', userController.createUser.bind(userController));
router.get('/users/:id', userController.getUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));

module.exports = router;