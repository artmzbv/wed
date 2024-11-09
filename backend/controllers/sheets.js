// utils/googleSheets.js
require('dotenv').config();
const { google } = require('googleapis');
const keys = require('../utils/constants/service-account.json'); // Adjust the path to your JSON credentials file

// Initialize JWT auth client for Google Sheets
const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth: client });

// Write a single reservation to Google Sheets
async function writeReservationToGoogleSheets(reservation) {
  try {
    console.log('writeReservationToGoogleSheets function called');

    // Prepare reservation data as a two-dimensional array (array of arrays) with values only
    const formattedData = [[
      reservation.date,
      reservation.time,
      reservation.duration,
      reservation.firstName,
      reservation.lastName,
      reservation.email,
      reservation.phone,
      reservation.willComeWithPets,
      reservation.finalPrice,
      reservation.startTime.toISOString(),
      reservation.endTime.toISOString()
    ]];

    console.log('Formatted Reservation Data:', formattedData);

    const request = {
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Reservations!A2', // Ensure this matches the correct tab and cell in Google Sheets
      valueInputOption: 'USER_ENTERED',
      resource: { values: formattedData }
    };

    // Append data to Google Sheets
    const response = await sheets.spreadsheets.values.append(request);
    console.log('Reservation written to Google Sheet:', response.data);
  } catch (error) {
    console.error('Error writing reservation to Sheets:', error.message);
    throw error;
  }
}

// Write a single coupon to Google Sheets
async function writeCouponToGoogleSheets(coupon) {
  try {
    console.log('writeCouponToGoogleSheets function called');

    // Prepare all fields from the couponSchema for Google Sheets
    const formattedData = [[
      coupon.code || 'DEFAULT_CODE',
      coupon.duration || '',
      coupon.firstName || '',
      coupon.lastName || '',
      coupon.email || '',
      coupon.phone || '',
      coupon.pricePerItem || coupon.totalPrice || 0,
      coupon.cardType || 'digital',
      
      // Flatten address fields (if address is provided, otherwise set defaults)
      coupon.address?.line1 || '',
      coupon.address?.city || '',
      coupon.address?.state || '',
      coupon.address?.postal_code || '',
      coupon.address?.country || ''
    ]];

    console.log('Formatted Coupon Data:', formattedData);

    const request = {
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Coupons!A2', // Ensure this matches the actual tab name in your sheet
      valueInputOption: 'USER_ENTERED',
      resource: { values: formattedData }
    };

    // Append data to Google Sheets
    const response = await sheets.spreadsheets.values.append(request);
    console.log('Coupon data written to Google Sheet:', response.data);
  } catch (error) {
    console.error('Error in writeCouponToGoogleSheets:', error.message);
    throw error;
  }
}

module.exports = { writeReservationToGoogleSheets, writeCouponToGoogleSheets };