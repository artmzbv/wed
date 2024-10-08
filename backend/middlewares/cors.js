const cors = require('cors');

// Define a whitelist of domains allowed to access your server
const whitelist = ['https://self-made-portraits.github.io/portraits/', 'https://self-made-portraits.com/', 'http://localhost:3002'];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the incoming origin is in the whitelist
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // Allow CORS for this request
    } else {
      callback(new Error('Not allowed by CORS'));  // Deny CORS for this request
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware to enable CORS with various options
const enableCors = cors(corsOptions);

module.exports = enableCors;