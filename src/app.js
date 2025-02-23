import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Card, CardContent, Autocomplete, Tooltip, IconButton, CircularProgress } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/system";

const StyledContainer = styled(Container)({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#121212",
  color: "#fff",
  padding: "20px",
});

const StyledCard = styled(Card)({
  width: "100%",
  maxWidth: "600px",
  backgroundColor: "#1E1E1E",
  color: "#fff",
  borderRadius: "16px",
  padding: "30px",
});

const fetchWeatherData = async (city, setWeather) => {
  try {
    const cityName = city.split(",")[0].trim();
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Use the environment variable
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    if (data.main) {
      setWeather({
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        condition: data.weather[0].description,
      });
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const fetchCitySuggestions = async (query, setSuggestions) => {
  if (query.length < 2) return;
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`);
    const data = await response.json();
    if (data.results) {
      const uniqueCities = Array.from(new Set(data.results.map(city => `${city.name}, ${city.country}`)));
      setSuggestions(uniqueCities);
    } else {
      setSuggestions([]);
    }
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    setSuggestions([]);
  }
};

const fetchGeminiResponse = async (weather, machinery, setGeminiResponse) => {
  const prompt = `I have ${machinery || "basic tools"} and expect wind speeds of ${weather.windSpeed} m/s. The temperature is ${weather.temperature}°C. The condition is ${weather.condition}. When is the best time to remove the snow for efficiency and safety? Provide a simple and brief snow-removal schedule.`;
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY; // Use the environment variable
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        temperature: 0.7,
        max_tokens: 50,
        top_p: 1,
      }),
    });
    const data = await response.json();
    if (data && data.candidates && data.candidates.length > 0) {
      setGeminiResponse(data.candidates[0].output);
    } else {
      setGeminiResponse("AI response unavailable.");
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    setGeminiResponse("AI response unavailable.");
  }
};

const SnowSmartApp = () => {
  const [city, setCity] = useState("");
  const [machinery, setMachinery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState(null);

  const handleCitySelection = (event, value) => {
    setCity(value);
    fetchWeatherData(value, setWeather);
  };

  return (
    <StyledContainer>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
        SnowSmart ❄️
      </Typography>
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Enter City
          </Typography>
          <Autocomplete
            freeSolo
            options={suggestions}
            onInputChange={(event, value) => fetchCitySuggestions(value, setSuggestions)}
            onChange={handleCitySelection}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                placeholder="Enter city name"
                sx={{ backgroundColor: "#2F3136", borderRadius: "8px", color: "#fff", padding: "10px" }}
              />
            )}
          />

          {weather && (
            <Card sx={{ backgroundColor: "#2F3136", color: "#fff", padding: "16px", borderRadius: "8px", marginTop: "20px" }}>
              <Typography variant="h5" textAlign="center" sx={{ fontWeight: "bold" }}>
                🌡 {weather.temperature}°C | 💨 {weather.windSpeed} m/s | ☁️ {weather.condition}
              </Typography>
            </Card>
          )}

          <Typography variant="h5" gutterBottom sx={{ marginTop: "16px", fontWeight: "bold" }}>
            Available Resources
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter available resources..."
            value={machinery}
            onChange={(e) => setMachinery(e.target.value)}
            sx={{ backgroundColor: "#2F3136", borderRadius: "8px", color: "#fff", padding: "10px", marginBottom: "16px" }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#FF6B6B", color: "#fff", marginTop: "20px", padding: "12px", fontSize: "1.1rem", fontWeight: "bold" }}
            onClick={() => fetchGeminiResponse(weather, machinery, setGeminiResponse)}
          >
            Generate Snow Removal Schedule
          </Button>

          {geminiResponse && (
            <Card sx={{ backgroundColor: "#2F3136", color: "#fff", padding: "16px", borderRadius: "8px", marginTop: "20px" }}>
              <Typography variant="h5" textAlign="center" sx={{ fontWeight: "bold" }}>
                🤖 {geminiResponse}
              </Typography>
            </Card>
          )}
        </CardContent>
      </StyledCard>
    </StyledContainer>
  );
};

export default SnowSmartApp;
