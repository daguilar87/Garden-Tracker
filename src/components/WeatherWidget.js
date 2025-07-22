import React, { useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from 'react-animated-weather';

function WeatherWidget() {
  const [forecast, setForecast] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchForecast = async () => {
    if (!locationInput) return;

    setLoading(true);
    setError("");
    setForecast([]);
    setLocationName("");

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&units=imperial&appid=${API_KEY}`
      );

      setLocationName(response.data.city.name);

      // Filter one forecast per day (12:00:00 entries)
      const dailyForecasts = response.data.list.filter((entry) =>
        entry.dt_txt.includes("12:00:00")
      ).slice(0, 5);

      setForecast(dailyForecasts);
    } catch (err) {
      console.error("Error fetching forecast:", err);
      setError("Unable to fetch forecast. Try another location.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  };

  const getAnimatedIcon = (description) => {
    const desc = description.toLowerCase();

    if (desc.includes("clear")) return "CLEAR_DAY";
    if (desc.includes("clouds")) return "PARTLY_CLOUDY_DAY";
    if (desc.includes("rain")) return "RAIN";
    if (desc.includes("thunderstorm")) return "SLEET";
    if (desc.includes("snow")) return "SNOW";
    if (desc.includes("mist") || desc.includes("fog")) return "FOG";

    return "CLOUDY";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6 w-full max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold mb-2 text-center">📍 Local Forecast</h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city or ZIP"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          className="w-full sm:flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          onClick={fetchForecast}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2 sm:mt-0 text-sm hover:bg-blue-700 transition"
        >
          Get Forecast
        </button>
      </div>

      {loading && <p className="text-center text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {forecast.length > 0 && (
        <div className="animate-fade-in">
          <h4 className="text-center font-semibold text-gray-700 mb-3">{locationName} - 5 Day Forecast</h4>
          <div className="flex flex-row overflow-x-auto justify-between gap-4 px-2">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="min-w-[140px] bg-blue-50 p-3 rounded-lg shadow hover:shadow-md transition flex flex-col items-center text-sm"
              >
                <p className="font-medium">{formatDate(day.dt_txt)}</p>
                <ReactAnimatedWeather
                  icon={getAnimatedIcon(day.weather[0].description)}
                  color="#3b82f6"
                  size={48}
                  animate={true}
                />
                <p className="capitalize text-gray-600 mt-1">{day.weather[0].description}</p>
                <p>🌡 {Math.round(day.main.temp)}°F</p>
                <p className="text-xs text-gray-500">
                  L: {Math.round(day.main.temp_min)}° | H: {Math.round(day.main.temp_max)}°
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
