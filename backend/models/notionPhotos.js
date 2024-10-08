const mongoose = require('mongoose');

// Define a separate schema for profiles/photos (if needed)
const profilesSchema = new mongoose.Schema({}, { strict: false });
const Profiles = mongoose.model('Profiles', profilesSchema);

module.exports = Profiles;
