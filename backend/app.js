require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('./middlewares/cors');
const bodyParser = require('body-parser'); 
const dataRouter = require('./routes/notion');
// const fetch = require('node-fetch');

// Load environment variables from .env file
const app = express();
app.use(bodyParser.json());
app.use(cors);
app.use(express.json());

// Connect to MongoDB using Mongoose//
// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/notionFAQDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error.message));


// Import the FAQ routes
app.use('/', dataRouter);

app.listen(process.env.PORT, () => {
    console.log('Server link:');
    console.log(process.env.PORT);
  });
