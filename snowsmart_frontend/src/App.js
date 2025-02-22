import { useState } from 'react';
import axios from 'axios';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState({ temperature: 'N/A', humidity: 'N/A', snow_24h: 'N/A' });
    const [error, setError] = useState(null);

    const fetchWeatherData = async () => {
        if (!city) {
            setError('Please enter a city.');
            return;
        }
        setError(null); // Clear previous errors

        try {
            const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
            setWeather({
                temperature: response.data.temperature,
                humidity: response.data.humidity,
                snow_24h: response.data.snow_24h // Already in cm from backend
            });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Failed to fetch weather data.');
        }
    };

    return (
        <div>
            <h1>Weather App</h1>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
            />
            <button onClick={fetchWeatherData}>Get Weather</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h2>Weather in {city}</h2>
            <p>Temperature: {weather.temperature}°C</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Snow in Next 24h: {weather.snow_24h} cm</p> {/* Display 24hr forecast in cm */}
        </div>
    );
};

export default Weather;
