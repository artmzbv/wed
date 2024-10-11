const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Store as a string (e.g., "2023-12-01")
  time: { type: String, required: true }, // Store as a string (e.g., "14:00")
  duration: { type: Number, required: true }, // Store duration in minutes (e.g., 30)
  firstName: { type: String, required: true }, // Customer's first name
  lastName: { type: String, required: true }, // Customer's last name
  email: { type: String, required: true }, // Customer's email for communication and Google Calendar
  phone: { type: String, required: true }, // Customer's phone number
  finalPrice: { type: Number, required: true }, // Final price of the booking (e.g., 50.00)
  eventId: { type: String }, // Optional Google Calendar Event ID
  createdAt: { type: Date, default: Date.now }, // Automatically add the creation timestamp
  updatedAt: { type: Date, default: Date.now } // Automatically add the last updated timestamp
});

module.exports = mongoose.model('Reservation', reservationSchema);

// Add pre-save hook to update the 'updatedAt' field whenever a document is modified
reservationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);