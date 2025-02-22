import { useState } from 'react';
import axios from 'axios';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState({ temperature: 'N/A', humidity: 'N/A' });
    const [error, setError] = useState(null);

    const fetchWeatherData = async () => {
        if (!city) {
            setError('Please enter a city.');
            return;
        }
        setError(null); // Clear any previous errors

        try {
            const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
            setWeather({
                temperature: response.data.main.temp, // Extract temperature from API response
                humidity: response.data.main.humidity // Extract humidity from API response
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
        </div>
    );
};

export default Weather;
