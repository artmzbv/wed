// controllers/timeSlotController.js
const TimeSlot = require('../models/timeSlot');

// Function to book a time slot
const bookTimeSlot = async (req, res) => {
  try {
    const { date, time, duration } = req.body;

    // Check if the slot is available
    const slot = await TimeSlot.findOne({ date, time, duration });
    if (!slot) {
      return res.status(404).json({ error: 'Time slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ error: 'Time slot is already booked' });
    }

    // Mark the slot as booked
    slot.isBooked = true;
    await slot.save();

    res.status(200).json({ message: 'Time slot booked successfully', slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get available time slots for a specific date
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;

    // Fetch slots for the given date that are not booked
    const availableSlots = await TimeSlot.find({ date, isBooked: false });

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  bookTimeSlot,
  getAvailableSlots,
};
