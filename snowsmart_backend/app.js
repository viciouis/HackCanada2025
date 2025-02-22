const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

// Enable CORS if needed (optional)
const cors = require('cors');
app.use(cors());

// Replace this with your actual OpenWeatherMap API key
const API_KEY = '781cf2cb4d56c7a0239a8e8e117a715d'; // <-- Add your API key here

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is working!');
});

// Example API route
app.get('/weather', (req, res) => {
  // Example: Make an API call using axios (you should replace this with actual API logic)
  const city = req.query.city || 'Toronto'; // Get city from query or default to Toronto

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ error: 'Unable to fetch weather data' });
    });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
