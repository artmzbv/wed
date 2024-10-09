// models/TimeSlot.js
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: {
    type: String, // Storing date as a string in 'YYYY-MM-DD' format
    required: true,
  },
  time: {
    type: String, // Storing time as a string in 'HH:mm' format
    required: true,
  },
  duration: {
    type: Number, // Duration of the booking in minutes (15, 30, 45, 60)
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false, // Indicates if the slot is booked or available
  },
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
