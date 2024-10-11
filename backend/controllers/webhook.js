// const reservation = require('../models/reservation');
// const { google } = require('googleapis');

// // Google Calendar webhook handler
// const handleCalendarWebhook = async (req, res) => {
//   const { eventId } = req.body;

//   // Check if the webhook event contains the eventId
//   if (!eventId) {
//     return res.status(400).json({ message: 'Invalid Webhook: eventId not found.' });
//   }

//   try {
//     // Find and delete the reservation with the corresponding Google Calendar eventId
//     const deletedReservation = await reservation.findOneAndDelete({ eventId });
//     if (!deletedReservation) {
//       console.log(`Reservation with eventId ${eventId} not found in MongoDB.`);
//       return res.status(404).json({ message: 'Reservation not found in MongoDB.' });
//     }

//     console.log(`Successfully deleted reservation in MongoDB for eventId: ${eventId}`);
//     res.status(200).json({ message: `Reservation deleted for eventId: ${eventId}` });
//   } catch (error) {
//     console.error('Error handling Google Calendar webhook:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // Controller function to renew Google Calendar webhooks
// const renewWebhooks = async (req, res) => {
//   try {
//     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

//     // Create a watch request for a specific calendar
//     const watchRequest = {
//       id: 'webhook-channel-id', // Unique ID for this channel (change to your desired value)
//       type: 'webhook',
//       address: 'https://yourdomain.com/api/webhooks/calendar', // Your webhook address
//       params: { ttl: '3600' }, // Optional: Time to live for the channel (in seconds)
//     };

//     const response = await calendar.events.watch({
//       calendarId: 'primary',
//       resource: watchRequest,
//     });

//     console.log('Google Calendar Webhook renewed successfully:', response.data);
//     res.status(200).json({ message: 'Webhook renewed successfully', data: response.data });
//   } catch (error) {
//     console.error('Error renewing Google Calendar Webhook:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   handleCalendarWebhook,
//   renewWebhooks,
// };
