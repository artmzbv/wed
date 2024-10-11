const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Store as a string (e.g., "2023-12-01")
  time: { type: String, required: true }, // Store as a string (e.g., "14:00")
  duration: { type: Number, required: true }, // Store duration in minutes (e.g., 30)
  // user: { type: String, required: true }, // User email or name
  eventId: { type: String } // Optional Google Calendar Event ID
});

module.exports = mongoose.model('Reservation', reservationSchema);