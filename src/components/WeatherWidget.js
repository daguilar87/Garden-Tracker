import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import dayjs from "dayjs";

function WeatherWidget() {
  const [forecast, setForecast] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

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

  const getIconColor = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes("clear")) return "#f6e58d";
    if (desc.includes("clouds")) return "#dff9fb";
    if (desc.includes("rain")) return "#74b9ff";
    if (desc.includes("thunderstorm")) return "#95afc0";
    if (desc.includes("snow")) return "#dfe6e9";
    if (desc.includes("mist") || desc.includes("fog")) return "#b2bec3";
    return "#576574";
  };

  const processForecastData = (list) => {
    const grouped = {};

    list.forEach((entry) => {
      const dateKey = dayjs(entry.dt_txt).format("YYYY-MM-DD");

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          temps: [],
          min: entry.main.temp_min,
          max: entry.main.temp_max,
          weatherCounts: {},
        };
      }

      grouped[dateKey].temps.push(entry.main.temp);
      grouped[dateKey].min = Math.min(grouped[dateKey].min, entry.main.temp_min);
      grouped[dateKey].max = Math.max(grouped[dateKey].max, entry.main.temp_max);

      const weatherDesc = entry.weather[0].description;
      if (!grouped[dateKey].weatherCounts[weatherDesc]) {
        grouped[dateKey].weatherCounts[weatherDesc] = 0;
      }
      grouped[dateKey].weatherCounts[weatherDesc] += 1;
    });

    const sortedDates = Object.keys(grouped).sort();

    return sortedDates.slice(0, 5).map((date) => {
      const temps = grouped[date].temps;

      const weatherDesc = Object.entries(grouped[date].weatherCounts)
        .sort((a, b) => b[1] - a[1])[0][0];

      return {
        date,
        weather: { description: weatherDesc },
        temp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
        temp_min: Math.round(grouped[date].min),
        temp_max: Math.round(grouped[date].max),
      };
    });
  };

  const fetchForecast = useCallback(
    async (input) => {
      if (!input) return;

      
      const normalizeLocationInput = (input) => {
        input = input.trim();
        if (/^\d{5}$/.test(input)) return input;
        const match = input.match(/(.+?)(?:,?\s*)([A-Za-z]{2})$/);
        if (match) {
          const city = match[1]
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
          const state = match[2].toUpperCase();
          return `${city}, ${state}`;
        }
        return input
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
      };

      const normalized = normalizeLocationInput(input);

      setLoading(true);
      setError("");
      setForecast([]);
      setLocationName("");

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            normalized
          )},US&units=imperial&appid=${API_KEY}`
        );

        const city = response.data.city.name;

        let displayLocation = city;
        const parts = normalized.split(",");
        if (parts.length === 2) {
          displayLocation = `${city}, ${parts[1].trim().toUpperCase()}`;
        }

        setLocationName(displayLocation);
        const filtered = processForecastData(response.data.list);
        setForecast(filtered);
        localStorage.setItem("weatherLocation", input);
      } catch (err) {
        console.error("Error fetching forecast:", err);
        setError("Unable to fetch forecast. Try another location.");
      } finally {
        setLoading(false);
      }
    },
    [API_KEY]
  );

  useEffect(() => {
    const savedLocation = localStorage.getItem("weatherLocation");
    if (savedLocation) {
      setLocationInput(savedLocation);
      fetchForecast(savedLocation);
    }
  }, [fetchForecast]);

  return (
    <div className="bg-blue-100 rounded-xl shadow-md p-4 mt-6 w-full max-w-5xl mx-auto">
      <h3 className="text-lg font-semibold mb-2 text-center">📍 Local Forecast</h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 px-2">
        <input
          type="text"
          placeholder="Enter city and state (e.g., Bellingham, WA) or ZIP"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          className="w-full sm:flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          onClick={() => fetchForecast(locationInput)}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2 sm:mt-0 text-sm hover:bg-blue-700 transition"
        >
          Get Forecast
        </button>
      </div>

      {loading && <p className="text-center text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {forecast.length > 0 && (
        <div className="animate-fade-in">
          <h4 className="text-center font-semibold text-gray-700 mb-3">
            {locationName} - 5 Day Forecast
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-center px-2">
            {forecast.map((day, index) => {
              const iconColor = getIconColor(day.weather.description);
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center h-56"
                >
                  <p className="font-medium">
                    {dayjs(day.date).format("ddd, MMM D")}
                  </p>
                  <ReactAnimatedWeather
                    icon={getAnimatedIcon(day.weather.description)}
                    color={iconColor}
                    size={48}
                    animate={true}
                  />
                  <p className="capitalize text-gray-600 text-sm px-1 truncate w-full">
                    {day.weather.description}
                  </p>
                  <p className="font-semibold text-lg">{day.temp}°F</p>
                  <p className="text-xs text-gray-500">
                    L: {day.temp_min}° | H: {day.temp_max}°
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
