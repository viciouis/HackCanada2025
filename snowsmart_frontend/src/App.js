import { useState } from 'react';
import axios from 'axios';

const Weather = () => {
    const [city, setCity] = useState('');
    const [machinery, setMachinery] = useState('');
    const [weather, setWeather] = useState({ temperature: 'N/A', humidity: 'N/A', snow_24h: 'N/A' });
    const [schedule, setSchedule] = useState(''); 
    const [error, setError] = useState(null);

    const fetchWeatherData = async () => {
        if (!city) {
            setError('Please enter a city.');
            return;
        }
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/generate-schedule', { city, machinery });

            console.log("API Response:", response.data);

            setWeather({
                temperature: response.data.temperature,
                humidity: response.data.humidity,
                snow_24h: response.data.snow_24h
            });

            if (response.data.geminiResponse?.text) {
                setSchedule(response.data.geminiResponse.text);
            } else {
                setSchedule('No valid schedule received.');
            }

        } catch (error) {
            console.error('Error generating schedule:', error);
            setError('Failed to generate schedule.');
        }
    };

    return (
        <div>
            <h1>Weather and Snow Cleaning Schedule</h1>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
            <input type="text" value={machinery} onChange={(e) => setMachinery(e.target.value)} placeholder="Enter snow cleaning machinery" />
            <button onClick={fetchWeatherData}>Generate Schedule</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h2>Weather in {city}</h2>
            <p>Temperature: {weather.temperature}°C</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Snow in Next 24h: {weather.snow_24h} cm</p>

            <h3>Gemini Snow Removal Schedule:</h3>
            <p>{schedule}</p> 
        </div>
    );
};

export default Weather;
