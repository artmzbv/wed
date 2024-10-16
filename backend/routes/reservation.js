const express = require('express');
const router = express.Router();
const { getReservations, createReservation, deleteReservation, checkReservationAvailability, getAllReservations } = require('../controllers/reservation');

// GET: Get all reservations for a specific date
router.get('/', getReservations);

// POST: Create a new reservation and add to Google Calendar
router.post('/', createReservation);

// GET: Get all reservations
router.get('/all', getAllReservations);

router.post('/check', checkReservationAvailability);

// DELETE: Delete a reservation and remove from Google Calendar
router.delete('/:id', deleteReservation);

module.exports = router;

