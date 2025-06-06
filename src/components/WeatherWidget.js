import React, { useState } from 'react';
import axios from 'axios';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!locationInput) return;

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&units=imperial&appid=${API_KEY}`
      );

      setWeather({
        temperature: `${response.data.main.temp} °F`,
        condition: response.data.weather[0].description,
        location: response.data.name,
        icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
      <h3>Check Weather</h3>
      <input
        type="text"
        placeholder="Enter city or zip code"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {loading && <p>Loading weather...</p>}

      {weather && !loading && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Weather in {weather.location}</h4>
          <p>Temperature: {weather.temperature}</p>
          <p>Condition: {weather.condition}</p>
          <img src={weather.icon} alt={weather.condition} />
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
