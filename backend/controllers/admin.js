const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// Controller for Admin Login
// controllers/adminController.js
const loginAdmin = (req, res) => {
    const { login, password } = req.body;
  
    // Hardcoded credentials for simplicity. You can store these in the .env file or database.
    const adminLogin = process.env.ADMIN_LOGIN
    const adminPassword = process.env.ADMIN_PASSWORD 
  
    if (login === adminLogin && password === adminPassword) {
      return res.status(200).json({ message: 'Admin login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  };
  
  module.exports = { loginAdmin };
  
