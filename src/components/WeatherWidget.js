import React, { useState } from "react";
import axios from "axios";

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
      let lat, lon, name;

     
      if (/^\d{5}$/.test(locationInput)) {
        const zipRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?zip=${locationInput},US&appid=${API_KEY}`
        );
        lat = zipRes.data.coord.lat;
        lon = zipRes.data.coord.lon;
        name = zipRes.data.name;
      } else {
        const geoRes = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=${API_KEY}`
        );

        if (!geoRes.data.length) throw new Error("Invalid location");

        lat = geoRes.data[0].lat;
        lon = geoRes.data[0].lon;
        name = geoRes.data[0].name;
      }

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${API_KEY}`
      );

      setForecast(forecastRes.data.daily.slice(0, 7)); 
      setLocationName(name);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Unable to fetch weather. Please check your location.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6 w-full max-w-md mx-auto transition-opacity duration-500 ease-in-out">
      <h3 className="text-lg font-semibold mb-2 text-center">📍 Local Weather</h3>

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

      {loading && <p className="text-center text-sm">Loading forecast...</p>}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {forecast.length > 0 && (
        <div className="animate-fade-in">
          <h4 className="text-center font-semibold text-gray-700 mb-3">{locationName} - 7 Day Forecast</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="bg-blue-50 p-3 rounded-lg shadow hover:shadow-md transition flex flex-col items-center"
              >
                <p className="font-medium">{formatDate(day.dt)}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="w-12 h-12"
                />
                <p className="capitalize text-gray-600">{day.weather[0].description}</p>
                <p>🌡 {Math.round(day.temp.day)}°F</p>
                <p className="text-xs text-gray-500">L: {Math.round(day.temp.min)}° | H: {Math.round(day.temp.max)}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
