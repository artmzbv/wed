const { google } = require('googleapis');
const { OAuth2 } = google.auth;

// Load credentials from a .env file or your Google Cloud Console
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI; // Corrected to load from env
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN; // Ensure this is added to .env

// Create a new OAuth2 client
const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Set the refresh token if it's available
oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN, // Ensures we have long-term access
});

// Generates an authentication URL for the user to authorize your application
const getAuthUrl = () => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};

// Exchange the authorization code for access and refresh tokens
const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

module.exports = { oauth2Client, getAuthUrl, getTokens };

