// routes/timeSlotRoutes.js
const express = require('express');
const { bookTimeSlot, getAvailableSlots } = require('../controllers/timeSlotController');

const router = express.Router();

router.get('/slots/:date', getAvailableSlots); // Get available slots for a specific date
router.post('/book', bookTimeSlot); // Book a time slot

module.exports = router;
