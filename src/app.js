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
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`);
    const data = await response.json();
    if (data.main) {
      setWeather({
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        snow: data.snow ? data.snow["1h"] : 0, // Get snow from the response if available
        rain: data.rain ? data.rain["1h"] : 0, // Get rain data if available
        condition: data.weather[0].main || "Clear", // Explicitly check condition
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
  const prompt = `I have ${machinery || "basic tools"} and expect wind speeds of ${weather.windSpeed} m/s. The temperature is ${weather.temperature}°C. There is ${weather.snow} cm of snow and ${weather.rain} mm of rain in the last hour. The condition is ${weather.condition}. If there isn't enough snow, I don't need to go out. If multiple people are available, suggest a plan for efficient snow removal. Make the recommendations as logical and practical as possible. Be as brief as possible, I do not care if you sound good or not, I just need the information as short as you can give me. DO NOT TELL ME THE MATH BEHIND YOUR LOGIC. At most, you should be telling me when to go out, what machinery to use given my inputs. Be as brief as you possibly can be. If there's not too much snow, use common sense. Just recommend going out at the end (obviously depends on what machinery the user has). If you think it's more logical to go out more than once (ex. once in the middle of snowfall so you do not have to do too much snow in 1 go), recommend the times to go out. Try to use a shovel as much as you can while being logical (example: I don't want to use a snow blower on like 3cm of snow, but I do not want to use a shovel on 15cm of snow). Find a good balance. Keep in mind rain and snow make slush, so depending on those factors I may not even need to shovel anything. Prefer to shovel over snowblower or machines, especially on smaller amounts of snow. Be slightly polite (nothing weird).`;
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.REACT_APP_GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }], // Send the prompt
      }),
    });
    const data = await response.json();
    console.log("Gemini API Raw Response:", JSON.stringify(data, null, 2));

    // Check if the response contains the expected data
    if (data && data.candidates && data.candidates.length > 0) {
      const responseText = data.candidates[0].content.parts[0].text; // Extract the text portion
      setGeminiResponse(responseText); // Set only the text response
    } else {
      setGeminiResponse("No valid response from the AI.");
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
              <Typography variant="h5" textAlign="center" sx={{ fontWeight: "bold", fontSize: "1.25rem"}}>
                🌡 {weather.temperature}°C | ❄️ Snow: {weather.snow} cm | 🌧️ Rain: {weather.rain} mm
              </Typography>
              <Typography variant="h5" textAlign="center" sx={{ fontWeight: "bold", marginTop: "8px", fontSize:"1.25rem"}}>
                {weather.condition === "Snow" ? "❄️Snowing" :
                 weather.condition === "Rain" ? "🌧️Raining" :
                 weather.condition === "Clear" ? "☀️Clear" :
                 weather.condition === "Clouds" ? "☁️Cloudy" :
                 weather.condition === "Blizzard" ? "🌨️Blizzard" :
                 weather.condition === "Freezing Rain" ? "🥶Freezing Rain" :
                 weather.condition === "Drizzle" ? "🌧️Drizzling" :
                 weather.condition === "Thunderstorm" ? "⚡Thunderstorm" :
                 weather.condition === "Mist" ? "🌫️Mist" : "☀️Clear"}
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
