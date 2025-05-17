const express = require('express');
const { 
  getVeterinarians,
  getVeterinarian
} = require('../controllers/veterinarianController');

const router = express.Router();

router.route('/').get(getVeterinarians);
router.route('/:id').get(getVeterinarian);

module.exports = router;