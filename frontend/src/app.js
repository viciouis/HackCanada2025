import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [snowTips, setSnowTips] = useState([]);

  // Get weather data from backend
  const getWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Get snow removal tips from backend
  const getSnowTips = async () => {
    try {
      const response = await axios.get('http://localhost:5000/snow-tips');
      setSnowTips(response.data.tips);
    } catch (error) {
      console.error("Error fetching snow tips:", error);
    }
  };

  return (
    <div className="App">
      <h1>SnowSmart – Snow Removal Assistant</h1>
      
      <input
        type="text"
        placeholder="Enter your city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>
      <button onClick={getSnowTips}>Get Snow Removal Tips</button>

      {weather && (
        <div>
          <h2>{weather.city}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Condition: {weather.description}</p>
          <p>Snowfall: {weather.snowfall}</p>
        </div>
      )}

      <h3>Snow Removal Tips:</h3>
      <ul>
        {snowTips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
