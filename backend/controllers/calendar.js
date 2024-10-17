// const { google } = require('googleapis');
// const { oauth2Client } = require('../auth');
// const cron = require('node-cron'); // Import cron for scheduling jobs

// // Initialize the Google Calendar API client
// const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// // Create a watch request for the Google Calendar
// exports.createWatchRequest = async (req, res) => {
//   try {
//     const watchRequest = {
//       id: 'your-unique-channel-id', // Unique identifier for the channel
//       type: 'web_hook',
//       address: 'https://your-server-url.com/api/calendar/notifications',
//       params: {
//         ttl: '2592000', // Time to live in seconds (e.g., 30 days)
//       },
//     };

//     const response = await calendar.events.watch({
//       calendarId: 'primary', // Replace with your calendar ID if needed
//       resource: watchRequest,
//     });

//     console.log('Watch request created:', response.data);
//     res.status(200).json({ message: 'Watch request created successfully', data: response.data });
//   } catch (error) {
//     console.error('Error creating watch request:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // Handle incoming notifications from Google Calendar
// exports.handleNotifications = (req, res) => {
//   // Google Calendar sends notifications in the request headers
//   const channelId = req.headers['x-goog-channel-id'];
//   const eventType = req.headers['x-goog-resource-state']; // e.g., "exists", "sync", "notFound"
//   const eventId = req.headers['x-goog-resource-id'];

//   console.log(`Notification received for channel ID: ${channelId}, Event ID: ${eventId}, Type: ${eventType}`);

//   // TODO: Implement logic to update MongoDB or take necessary actions based on the notification
//   // e.g., remove the event from the database if `eventType` is "deleted"
//   if (eventType === 'deleted') {
//     console.log(`Event ${eventId} was deleted. Consider removing it from the database.`);
//   }

//   res.status(200).send(); // Acknowledge the request to Google
// };

// // Function to renew the watch request
// exports.renewWatchRequest = async () => {
//   try {
//     const watchRequest = {
//       id: 'your-unique-channel-id', // Unique identifier for the channel
//       type: 'web_hook',
//       address: 'https://your-server-url.com/api/calendar/notifications',
//       params: {
//         ttl: '2592000', // Time to live in seconds (e.g., 30 days)
//       },
//     };

//     const response = await calendar.events.watch({
//       calendarId: 'primary', // Replace with your calendar ID if needed
//       resource: watchRequest,
//     });

//     console.log('Watch request renewed successfully:', response.data);
//   } catch (error) {
//     console.error('Error renewing watch request:', error.message);
//   }
// };

// // Schedule a cron job to automatically renew the watch request every 25 days
// exports.scheduleRenewalJob = () => {
//   cron.schedule('0 0 */25 * *', () => {
//     console.log('Renewing Google Calendar watch request...');
//     exports.renewWatchRequest(); // Call the renew function
//   });
// };
