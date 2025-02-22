// snowsmart_backend/server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Enable CORS for all origins
app.use(cors());

// Route for weather
app.get('/weather', (req, res) => {
  const city = req.query.city || 'Brampton';
  res.json({ message: `Weather data for ${city}` });
});

// Route for snow-tips
app.get('/snow-tips', (req, res) => {
  res.json({ message: 'Snow tips will be provided here!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
