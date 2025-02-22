const express = require('express');
const cors = require('cors');  // Import cors package
const app = express();

// Enable CORS for all routes
app.use(cors());  // This will allow requests from all origins

// Weather endpoint
app.get('/weather', (req, res) => {
  const city = req.query.city;
  // Respond with a mock temperature for the given city
  res.json({ city: city, temperature: "15°C" });
});

// Snow tips endpoint
app.get('/snow-tips', (req, res) => {
  res.json({ tip: "Use salt to prevent ice buildup!" });
});

// Start the server
app.listen(5000, () => {
  console.log('Backend server running on http://localhost:5000');
});
