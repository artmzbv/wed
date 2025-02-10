  const reservation = require('../models/reservation');
  const path = require('path');
  // const createTransporter = require('../controllers/emailTransporter');
  const { google } = require('googleapis');
  const moment = require('moment');
  const { oauth2Client } = require('./sheets');
  const { writeReservationToGoogleSheets } = require('./sheets');
  const nodemailer = require('nodemailer');

  
  // Setup Google Calendar API client
  // const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

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

  // Controller function to get reservations with additional parameters
  const getReservations = async (req, res) => {
    const { date, time, duration, firstName, lastName, email, phone, willComeWithPets, willBeRaw } = req.query;

    console.log("Received query params - Date:", date, "Time:", time, "Duration:", duration, "First Name:", firstName, "Last Name:", lastName, "Will Come With Pets:", willComeWithPets, "Will Be In RAW format:", willBeRaw);

    try {
      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      // Fetch reservations based on provided parameters
      const reservations = await reservation.find({
        date, // Treat date as a plain string
        ...(time && { time }), // Add 'time' condition only if provided
        ...(duration && { duration }), // Add 'duration' condition only if provided
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(willComeWithPets && { willComeWithPets }),
        ...(willBeRaw && { willBeRaw }),
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
    try {
      const { date, time, duration, firstName, lastName, phone, email, willComeWithPets, willBeRaw, finalPrice } = req.body;
  
      // Check if there is a reservation with the same date and time
      const existingReservation = await reservation.findOne({ date, time });
  
      if (existingReservation) {
        return res.status(400).json({ message: 'A reservation already exists for this time and date.' });
      }
  
      // Create a new reservation if no conflict
      const newReservation = new reservation({
        date,
        time,
        duration,
        firstName,
        lastName,
        phone,
        email,
        willComeWithPets,
        willBeRaw,
        finalPrice,
      });
  
      await newReservation.save();
      // Respond to the client
      res.status(201).json({
          message: 'Reservation created successfully!',
          reservation: newReservation,
      });
      // Write to Google Sheets
      await writeReservationToGoogleSheets(newReservation);

      // Configure the transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        // debug: true,  // Enable debugging output
        // logger: true, // Log SMTP communication
      });
  
      // Email options
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Self-Made Portraits - Reservation Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <p>Dear ${firstName} ${lastName},</p>
            <p>Your reservation is confirmed.</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li><strong>Date:</strong> ${date}</li>
              <li><strong>Time:</strong> ${time}</li>
              <li><strong>Duration:</strong> ${duration} minutes</li>
              <li><strong>Pets:</strong> ${willComeWithPets ? 'Yes' : 'No'}</li>
              <li><strong>Raw:</strong> ${willBeRaw ? 'Yes' : 'No'}</li>
            </ul>
            <p><strong>Total Price:</strong> ${finalPrice} GBP</p>
            <p style="margin-bottom: 20px;">Thank you for choosing us!</p>
            <p>If you have any questions, feel free to contact us:</p>
                <p><strong>Phone:</strong> +44 1273 011626<br>
                <strong>Email:</strong> info@self-made-portraits.com</p>
                <div style="margin-top: 20px; text-align: left;">
                <img src="cid:logo" alt="Logo" style="width: 150px; height: auto; margin-top: 20px;">
                </div>
              </div>
        `,
        attachments: [
          {
            filename: 'logo.png',
            path: path.join(__dirname, '../utils/logo/logo.png'), // Adjust path as needed
            cid: 'logo', // Content ID to match the img src in the HTML
          },
        ],
      };
  
      // Send the confirmation email
      await transporter.sendMail(mailOptions)
      .then(() => console.log(`Confirmation email sent to ${email}`))
      .catch((err) => console.error('Error sending confirmation email:', err))
    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json({ message: 'Failed to create reservation', error: error.message });
    }
  };

const checkReservationAvailability = async (req, res) => {
  const { date, time, duration } = req.body;

  try {
    console.log('Checking reservation for date:', date, 'time:', time, 'duration:', duration);

    // Ensure all necessary fields are provided
    if (!date || !time || !duration) {
      return res.status(400).json({ message: 'Date, time, and duration are required.' });
    }

    // Convert the provided time and duration into start and end times
    const requestedStartTime = new Date(`${date}T${time}:00`); // Assuming time is in "HH:mm" format
    const requestedEndTime = new Date(requestedStartTime.getTime() + duration * 60000); // duration in minutes

    console.log('Requested start time:', requestedStartTime, 'Requested end time:', requestedEndTime);

    // Find reservations that overlap with the requested time
    const overlappingReservation = await reservation.findOne({
      date: date,
      $or: [
        {
          // Condition 1: Existing reservation starts before requestedEndTime and ends after requestedStartTime
          startTime: { $lt: requestedEndTime },
          endTime: { $gt: requestedStartTime }
        }
      ]
    });

    if (overlappingReservation) {
      return res.status(400).json({ message: 'This time slot overlaps with another reservation.' });
    }

    return res.status(200).json({ message: 'Time slot is available.' });
  } catch (error) {
    console.error('Error checking reservation availability:', error);
    return res.status(500).json({ message: 'Internal server error while checking reservation', error: error.message });
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
      // if (deletedReservation.eventId) {
      //   try {
      //     await calendar.events.delete({
      //       calendarId: 'primary',
      //       eventId: deletedReservation.eventId,
      //     });

      //     console.log(`Google Calendar event with ID ${deletedReservation.eventId} deleted successfully.`);
      //     return res.status(200).json({
      //       message: 'Reservation and Google Calendar event cancelled successfully.',
      //       deletedReservation,
      //     });
      //   } catch (err) {
      //     console.error(`Error deleting Google Calendar event: ${err.message}`);
      //     return res.status(500).json({
      //       error: `Failed to delete Google Calendar event: ${err.message}`,
      //       deletedReservation,
      //     });
      //   }
      // } else {
      //   return res.status(200).json({
      //     message: 'Reservation cancelled successfully, but no corresponding Google Calendar event was found.',
      //     deletedReservation,
      //   });
      // }
    } catch (error) {
      console.error(`Error deleting reservation: ${error.message}`);
      res.status(500).json({ error: `Error deleting reservation: ${error.message}` });
    }
  };

  module.exports = {
    getReservations,
    createReservation,
    deleteReservation,
    getAllReservations,
    checkReservationAvailability
  };
