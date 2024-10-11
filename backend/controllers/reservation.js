const reservation = require('../models/reservation');
const { google } = require('googleapis');
const moment = require('moment');
const { oauth2Client } = require('./auth');

// Setup Google Calendar API client
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Controller function to get all reservations from MongoDB
const getAllReservations = async (req, res) => {
  try {
    const reservations = await reservation.find({}); // Retrieve all reservations
    console.log('All reservations found:', reservations);
    res.status(200).json(reservations); // Return all reservations as JSON
  } catch (error) {
    console.error('Error fetching all reservations:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get reservations for a specific date, time, and duration
const getReservations = async (req, res) => {
  const { date, time, duration } = req.query;

  console.log("Received query params - Date:", date, "Time:", time, "Duration:", duration);

  try {
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Fetch reservations based on provided parameters
    const reservations = await reservation.find({
      date,
      ...(time && { time }), // Add 'time' condition only if provided
      ...(duration && { duration }), // Add 'duration' condition only if provided
    });

    console.log('Reservations found:', reservations);
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Controller function to create a new reservation and add it to Google Calendar
const createReservation = async (req, res) => {
  const { date, time, duration } = req.body;

  // Debugging: Log the incoming data
  console.log("Received data to create a reservation:", { date, time, duration });

  try {
    // Step 1: Check if a reservation already exists for the selected date and time.
    const existingReservation = await reservation.findOne({ date, time });
    if (existingReservation) {
      console.log("Reservation already exists:", existingReservation);
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    // Step 2: Log the creation of the reservation
    console.log("Creating a new reservation with date, time, and duration:", date, time, duration);

    // Create a new reservation object
    const newReservation = new reservation({ date, time, duration });

    // Step 3: Save the new reservation to MongoDB
    await newReservation.save();

    console.log("New reservation saved to MongoDB:", newReservation);

    // Step 4: Create a new event in Google Calendar.
    const startDateTime = moment(`${date}T${time}`).format(); // Start time of the event
    const endDateTime = moment(startDateTime).add(duration, 'minutes').format(); // End time based on duration
    console.log(startDateTime)
    console.log(endDateTime)
    const calendarEvent = {
      summary: `Booking for ${duration} minutes`,
      description: `Reserved slot on ${date} for ${duration} minutes starting at ${time}.`,
      start: { dateTime: startDateTime, timeZone: 'Europe/Paris' },
      end: { dateTime: endDateTime, timeZone: 'Europe/Paris' },
      reminders: { useDefault: true },
    };

    console.log("Creating Google Calendar event with data:", JSON.stringify(calendarEvent, null, 2));

    // Insert the event into Google Calendar.
    calendar.events.insert(
      { calendarId: 'primary', resource: calendarEvent },
      async (err, event) => {
        if (err) {
          console.error('Error creating Google Calendar event:', err);
          return res.status(500).json({ error: err.message });
        }

        // Save the Google Calendar eventId to the reservation for future reference.
        newReservation.eventId = event.data.id;
        await newReservation.save();

        console.log('Google Calendar event created and saved to reservation:', JSON.stringify(event.data, null, 2));
        res.status(201).json({ newReservation, calendarEvent: event.data });
      }
    );
  } catch (error) {
    console.error('Error creating reservation:', error.message);
    res.status(500).json({ error: error.message });
  }
};


// Controller function to delete a reservation by ID and remove it from Google Calendar
const deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Find and delete the reservation from the MongoDB database
    const deletedReservation = await reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      console.log(`Reservation with ID ${id} not found.`);
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    console.log(`Deleted reservation from MongoDB: ${JSON.stringify(deletedReservation)}`);

    // Step 2: If there is a corresponding Google Calendar event, delete it
    if (deletedReservation.eventId) {
      try {
        await calendar.events.delete({
          calendarId: 'primary',
          eventId: deletedReservation.eventId,
        });

        console.log(`Google Calendar event with ID ${deletedReservation.eventId} deleted successfully.`);
        return res.status(200).json({
          message: 'Reservation and Google Calendar event cancelled successfully.',
          deletedReservation,
        });
      } catch (err) {
        console.error(`Error deleting Google Calendar event: ${err.message}`);
        return res.status(500).json({
          error: `Failed to delete Google Calendar event: ${err.message}`,
          deletedReservation,
        });
      }
    } else {
      return res.status(200).json({
        message: 'Reservation cancelled successfully, but no corresponding Google Calendar event was found.',
        deletedReservation,
      });
    }
  } catch (error) {
    console.error(`Error deleting reservation: ${error.message}`);
    res.status(500).json({ error: `Error deleting reservation: ${error.message}` });
  }
};

module.exports = {
  getReservations,
  createReservation,
  deleteReservation,
  getAllReservations
};
