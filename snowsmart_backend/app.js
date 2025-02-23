const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

//const WEATHER_API_KEY = '781cf2cb4d56c7a0239a8e8e117a715d';
//const GEMINI_API_KEY = 'AIzaSyArc7rRPl0WXuCuCTQmYav7qQlHEXnk6Go';
const { WEATHER_API_KEY, GEMINI_API_KEY } = require('./config');  // Import keys

// Root route
app.get('/', (req, res) => {
    res.send('Backend server is working!');
});

// Fetch weather data
app.get('/weather', async (req, res) => {
    const city = req.query.city || 'Toronto';

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );

        const forecasts = response.data.list;
        let snow_24h = 0;
        let rain_24h = 0;
        let wind_speed = forecasts[0].wind.speed; // Current wind speed

        forecasts.forEach(entry => {
            if (entry.snow && entry.snow['3h']) {
                snow_24h += entry.snow['3h'];
            }
            if (entry.rain && entry.rain['3h']) {
                rain_24h += entry.rain['3h'];
            }
        });

        res.json({
            temperature: forecasts[0].main.temp,
            humidity: forecasts[0].main.humidity,
            snow_24h: (snow_24h / 10).toFixed(1), // Convert mm to cm
            rain_24h: rain_24h.toFixed(1), // Keep in mm
            wind_speed: wind_speed.toFixed(1) // Wind speed in m/s
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Unable to fetch weather data' });
    }
});

// Generate snow-cleaning schedule
app.post('/generate-schedule', async (req, res) => {
    const { city, machinery } = req.body;

    if (!city) {
        return res.status(400).json({ error: 'City is required.' });
    }

    try {
        const weatherResponse = await axios.get(`http://localhost:5000/weather?city=${city}`);
        const { temperature, humidity, snow_24h, rain_24h, wind_speed } = weatherResponse.data;

        console.log(`Weather data: Temp=${temperature}°C, Humidity=${humidity}%, Snow=${snow_24h}cm, Rain=${rain_24h}mm, Wind=${wind_speed}m/s`);

        if (!machinery) {
            return res.json({ temperature, humidity, snow_24h, rain_24h, wind_speed });
        }

        const prompt = `I have ${machinery} and expect ${snow_24h} cm of snowfall, ${rain_24h} mm of rain, and wind speeds of ${wind_speed} m/s in the next 24 hours. The temperature is ${temperature}°C with a humidity of ${humidity}%. When is the best time to remove the snow for efficiency and safety? Provide a simple and brief snow-removal schedule. Your response should be maximum 1 sentence including acknowledgement, and recommendation on when to go out. Be as brief and to the point as you can.`;

        console.log('Sending request to Gemini API:', { contents: [{ parts: [{ text: prompt }] }] });

        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('Gemini API Response:', geminiResponse.data);

        if (geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const scheduleText = geminiResponse.data.candidates[0].content.parts[0].text;
            res.json({ temperature, humidity, snow_24h, rain_24h, wind_speed, geminiResponse: { text: scheduleText } });
        } else {
            res.status(500).json({ error: 'No valid response from Gemini API' });
        }

    } catch (error) {
        console.error('Error generating schedule:', error.message);
        res.status(500).json({ error: 'Failed to generate schedule. ' + error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
