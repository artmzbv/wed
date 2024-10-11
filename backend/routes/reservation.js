const express = require('express');
const router = express.Router();
const { getReservations, createReservation, deleteReservation, getAllReservations } = require('../controllers/reservation');

// GET: Get all reservations for a specific date
router.get('/', getReservations);

// POST: Create a new reservation and add to Google Calendar
router.post('/', createReservation);

// GET: Get all reservations
router.get('/all', getAllReservations);

// DELETE: Delete a reservation and remove from Google Calendar
router.delete('/:id', deleteReservation);

module.exports = router;

