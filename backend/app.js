require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('./middlewares/cors');
const bodyParser = require('body-parser'); 
const dataRouter = require('./routes/notion');
const stripeRouter = require('./routes/stripe');
const reserveRouter = require('./routes/reservation');
const adminRoutes = require('./routes/admin');
const couponRoutes = require('./routes/coupon');
const app = express();

app.use(cors);

app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mongodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error.message));


// Import the FAQ routes
app.use('/', dataRouter);
app.use('/', stripeRouter);
app.use('/api/reservations', reserveRouter); 
app.use('/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server link:');
    console.log(process.env.PORT);
  });
