const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

// Set up your weather API key (e.g., OpenWeather API)
const WEATHER_API_KEY = '781cf2cb4d56c7a0239a8e8e117a715d';

app.use(express.json());

// API endpoint to get weather data
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  
  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`);
    const data = response.data;
    const snowfall = data.weather.find(item => item.main.toLowerCase() === 'snow');
    
    res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      snowfall: snowfall ? snowfall.description : 'No snow'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error });
  }
});

// API endpoint for snow removal tips
app.get('/snow-tips', (req, res) => {
  const tips = [
    'Clear snow early to avoid it freezing overnight.',
    'Use a shovel with a curved handle to reduce back strain.',
    'Wear layers to stay warm and prevent injuries.'
  ];
  res.json({ tips });
});

app.get("/", (req, res) => {
  res.send("SnowSmart Backend is running!");
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
