# SnowSmart ❄️

SnowSmart is a smart snow removal assistant that helps you plan and optimize snow removal based on real-time weather data. The app takes into account various weather conditions like temperature, snow accumulation, rain, and wind speed to generate a snow removal schedule. The app can also suggest machinery and resources for efficient snow clearing, helping you make practical decisions during snowstorms.

## Features:
- **City Input**: Enter any city name, and the app will fetch current weather data.
- **Weather Forecast**: Displays temperature, snow accumulation, and rain data.
- **Available Resources**: You can input available snow removal machinery to receive a tailored snow removal plan.
- **AI-Based Recommendations**: Based on the weather data and available resources, the app generates a snow removal schedule using a powerful AI model (Gemini API).

## Technologies Used:
- **Frontend**: React.js
- **UI**: Material-UI (MUI)
- **Backend**: The app fetches weather data from the OpenWeatherMap API, city suggestions from the Open-Meteo Geocoding API, and AI-powered snow removal recommendations from the Gemini API.
- **State Management**: React hooks (useState, useEffect)

## Folder Structure:
The project folder structure is as follows:
snow-smart/
├── .env                       # Environment variables for API keys
├── Dockerfile                 # Docker configuration file
├── docker-compose.yml         # Docker Compose configuration
├── node_modules/              # Project dependencies (auto-generated)
├── public/                    # Public files (index.html, etc.)
├── src/                       # Source code (components, styles, etc.)
│   └── App.js                 # Main application component
├── package.json               # Project metadata and dependencies
└── README.md                  # Project documentation

## Setup and Installation:

```bash
cd $YOUR_PATH
git clone https://github.com/your-username/snow-smart.git
cd snow-smart
npm install (sudo npm install for mac)
echo "REACT_APP_OPENWEATHER_API_KEY=your_openweathermap_api_key" > .env
echo "REACT_APP_GEMINI_API_KEY=your_gemini_api_key" >> .env
docker compose up --build (or npm start for non-docker users)
```
App is now available at localhost:3000


