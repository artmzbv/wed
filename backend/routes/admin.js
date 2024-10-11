const express = require('express');
const { loginAdmin } = require('../controllers/admin');
const router = express.Router();

// Admin Login Route
router.post('/', loginAdmin);

module.exports = router;
