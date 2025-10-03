import React, { useState, useEffect } from "react";
import WeatherWidget from "../components/WeatherWidget";
import ZipZoneForm from "../components/ZipZoneForm";
import PlantTimeLine from "../components/PlantTimeLine";

export default function Dashboard() {
  const [zone, setZone] = useState("");
  const [city, setCity] = useState("");
  const [plant, setPlant] = useState("");
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const [plantOptions, setPlantOptions] = useState([]);
  const [manualEntry, setManualEntry] = useState(false);
  const [customPlant, setCustomPlant] = useState("");

  useEffect(() => {
    const storedZone = localStorage.getItem("zone");
    const storedCity =
      localStorage.getItem("city") || localStorage.getItem("zip");
    if (storedZone) setZone(storedZone);
    if (storedCity) setCity(storedCity);
  }, []);

  useEffect(() => {
    fetch("https://gardenflask.fly.dev/api/plants")
      .then((res) => res.json())
      .then((data) => setPlantOptions(data))
      .catch((err) => console.error("Failed to load plant options:", err));
  }, []);

  useEffect(() => {
    const selectedPlant = manualEntry ? customPlant : plant;
    if (zone && selectedPlant) {
      fetch(
        `https://gardenflask.fly.dev/api/planting-info/${selectedPlant}?zone=${zone}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setInfo(null);
          } else {
            setInfo(data);
            setError("");
          }
        })
        .catch((err) => {
          console.error("Error fetching timeline:", err);
          setError("Could not load planting timeline.");
          setInfo(null);
        });
    }
  }, [zone, plant, customPlant, manualEntry]);

  const handleZoneUpdate = (newZone, newCity) => {
    setZone(newZone);
    setCity(newCity);
    localStorage.setItem("zone", newZone);
    localStorage.setItem("city", newCity);
  };

  const resetLocation = () => {
    setZone("");
    setCity("");
    localStorage.removeItem("zone");
    localStorage.removeItem("city");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-green-800">🌿 Dashboard</h2>

      
      <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
          ☀ Weather
        </h3>
        <WeatherWidget />
      </div>

      
      {!zone ? (
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          <h3 className="text-lg font-semibold text-green-700">
            📍 Set Your ZIP Code
          </h3>
          <ZipZoneForm onZoneUpdated={handleZoneUpdate} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-green-700">
              🌱 Planting Timeline for {city || `Zone ${zone}`}
            </h3>
            <button
              onClick={resetLocation}
              className="px-2 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
            >
              Reset Location
            </button>
          </div>

          
          <label className="block mb-2 text-gray-700 font-medium">
            Choose a plant:
          </label>
          <div className="flex flex-wrap gap-2">
            {!manualEntry ? (
              <>
                <select
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                >
                  <option value="">-- Select a plant --</option>
                  {plantOptions.map((opt) => (
                    <option key={opt.id} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setManualEntry(true);
                    setPlant("");
                  }}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Enter manually
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={customPlant}
                  onChange={(e) => setCustomPlant(e.target.value)}
                  placeholder="Type plant name"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    setManualEntry(false);
                    setCustomPlant("");
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Choose from list
                </button>
              </>
            )}
          </div>

         
          {error && <p className="text-red-600">{error}</p>}

          
          <PlantTimeLine info={info} zone={zone} />

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-green-700">
              🔄 Change ZIP Code
            </h3>
            <ZipZoneForm onZoneUpdated={handleZoneUpdate} />
          </div>
        </div>
      )}
    </div>
  );
}
