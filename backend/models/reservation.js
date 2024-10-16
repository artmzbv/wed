const mongoose = require('mongoose');

// Reservation schema
const reservationSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Store as a string (e.g., "2023-12-01")
  time: { type: String, required: true }, // Store as a string (e.g., "14:00")
  duration: { type: Number, required: true }, // Store duration in minutes (e.g., 30)
  
  startTime: { type: Date, required: true }, // Full Date object for start time
  endTime: { type: Date, required: true },   // Full Date object for end time
  
  firstName: { type: String, required: true }, // Customer's first name
  lastName: { type: String, required: true }, // Customer's last name
  email: { type: String, required: true }, // Customer's email
  phone: { type: String, required: true }, // Customer's phone number
  finalPrice: { type: Number, required: true }, // Final price of the booking (e.g., 50.00)
  
  eventId: { type: String }, // Optional Google Calendar Event ID
  createdAt: { type: Date, default: Date.now }, // Automatically add the creation timestamp
  updatedAt: { type: Date, default: Date.now } // Automatically add the last updated timestamp
});

// Add pre-save hook to calculate startTime and endTime before saving
reservationSchema.pre('validate', function (next) {
  // Parse the time to create a full Date object for startTime
  const [hours, minutes] = this.time.split(':'); // Assuming time is in "HH:mm" format
  const startTime = new Date(`${this.date}T${hours}:${minutes}:00.000Z`);
  
  // Set startTime and endTime based on date, time, and duration
  this.startTime = startTime;
  this.endTime = new Date(startTime.getTime() + this.duration * 60000); // Add duration (minutes) to get endTime
  
  // Continue to the next middleware or saving step
  next();
});

// Export the model
module.exports = mongoose.model('Reservation', reservationSchema);
