const mongoose = require('mongoose');

// Define a flexible schema to handle any incoming data
const notionSchema = new mongoose.Schema({}, { strict: false });

const Notion = mongoose.model('Notion', notionSchema);

module.exports = Notion;

