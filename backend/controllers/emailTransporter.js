const nodemailer = require('nodemailer');
const oauth2Client = require('./auth');

// Generate an access token
const accessToken = async () => {
  try {
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error('Error generating access token:', error.message);
    throw new Error('Failed to generate access token');
  }
};

// Create and export the transporter
const createTransporter = async () => {
  try {
    const token = await accessToken();
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'your-business-email@yourdomain.com', // Your Google Workspace email
        clientId: oauth2Client._clientId,
        clientSecret: oauth2Client._clientSecret,
        refreshToken: oauth2Client.credentials.refresh_token,
        accessToken: token,
      },
    });
  } catch (error) {
    console.error('Error creating transporter:', error.message);
    throw new Error('Failed to create transporter');
  }
};

module.exports = createTransporter;

