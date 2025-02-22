const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

// Enable CORS if needed
const cors = require('cors');
app.use(cors());

// OpenWeatherMap API Key
const API_KEY = '781cf2cb4d56c7a0239a8e8e117a715d';

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is working!');
});

// Weather API route (Current + 24hr Snow Forecast)
app.get('/weather', async (req, res) => {
  const city = req.query.city || 'Toronto';

  try {
    // Get city coordinates (since the forecast API requires lat/lon)
    const locationResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const { lat, lon } = locationResponse.data.coord;

    // Get 48-hour forecast (we will extract next 24 hours)
    const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const forecastData = forecastResponse.data.list;

    // Extract relevant data
    const currentTemperature = locationResponse.data.main.temp;
    const currentHumidity = locationResponse.data.main.humidity;

    // Sum snowfall over the next 24 hours
    let totalSnowInMM = 0;
    for (let i = 0; i < 8; i++) { // 8 data points = 24 hours (each point is 3 hours)
        if (forecastData[i].snow?.['3h']) {
            totalSnowInMM += forecastData[i].snow['3h'];
        }
    }

    // Convert mm to cm (1 cm = 10 mm)
    const totalSnowInCM = totalSnowInMM / 10;

    res.json({
      temperature: currentTemperature,
      humidity: currentHumidity,
      snow_24h: totalSnowInCM // Send 24hr snow forecast in cm
    });

  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
