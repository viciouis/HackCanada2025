import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
      setWeatherData(response.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Weather Information</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={handleCityChange}
      />
      <button onClick={fetchWeather} disabled={loading}>
        {loading ? 'Loading...' : 'Get Weather'}
      </button>

      {error && <p>{error}</p>}

      {weatherData && (
        <div>
          <h2>Weather for {city}</h2>
          <p>Temperature: {weatherData.temp}°C</p>
          <p>Humidity: {weatherData.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
