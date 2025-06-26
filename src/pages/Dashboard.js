import React, { useState, useEffect } from 'react';
import WeatherWidget from '../components/WeatherWidget';
import ZipZoneForm from '../components/ZipZoneForm';
import PlantTimeline from '../components/PlantTimeLine';

export default function Dashboard() {
  const [zone, setZone] = useState(localStorage.getItem('zone') || '');
  const [plant, setPlant] = useState('Tomato');
  const [info, setInfo] = useState(null);

  
  useEffect(() => {
    if (zone && plant) {
      fetch(`/api/planting-info/${plant}?zone=${zone}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setInfo(data))
        .catch((err) => console.error('Error fetching timeline:', err));
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
          <ZipZoneForm onZoneUpdated={(z) => {
            setZone(z);
            localStorage.setItem('zone', z);
          }} />
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

         
          <PlantTimeline info={info} />
        </div>
      )}
    </div>
  );
}
