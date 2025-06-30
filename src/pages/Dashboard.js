import React, { useState, useEffect } from 'react';
import WeatherWidget from '../components/WeatherWidget';
import ZipZoneForm from '../components/ZipZoneForm';
import PlantTimeline from '../components/PlantTimeLine';

export default function Dashboard() {
  const [zone, setZone] = useState(localStorage.getItem('zone') || '');
  const [plant, setPlant] = useState('Tomato');
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (zone && plant) {
      fetch(`http://127.0.0.1:5000/api/planting-info/${plant}?zone=${zone}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Request failed: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setInfo(null);
          } else {
            setInfo(data);
            setError('');
          }
        })
        .catch((err) => {
          console.error('Error fetching timeline:', err);
          setError('Could not load planting timeline.');
          setInfo(null);
        });
    }
  }, [zone, plant]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div>
        <h3 className="text-lg font-semibold">Weather</h3>
        <WeatherWidget />
      </div>

      {!zone ? (
        <div>
          <h3 className="text-lg font-semibold">Set Your ZIP Code</h3>
          <ZipZoneForm
            onZoneUpdated={(z) => {
              setZone(z);
              localStorage.setItem('zone', z);
            }}
          />
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">Planting Timeline for Zone {zone}</h3>

          <label className="block mb-2">
            Choose a plant:
            <select
              value={plant}
              onChange={(e) => setPlant(e.target.value)}
              className="ml-2 p-1 border rounded"
            >
              <option value="Tomato">Tomato</option>
              <option value="Carrot">Carrot</option>
            </select>
          </label>

          {error && <p className="text-red-600">{error}</p>}
          <PlantTimeline info={info} />
        </div>
      )}
    </div>
  );
}
