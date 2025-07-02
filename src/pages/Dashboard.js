import React, { useState, useEffect } from "react";
import WeatherWidget from "../components/WeatherWidget";
import ZipZoneForm from "../components/ZipZoneForm";
import PlantTimeline from "../components/PlantTimeLine";

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
    const storedCity = localStorage.getItem("city") || localStorage.getItem("zip");
    if (storedZone) setZone(storedZone);
    if (storedCity) setCity(storedCity);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/plants")
      .then(res => res.json())
      .then(data => setPlantOptions(data))
      .catch(err => console.error("Failed to load plant options:", err));
  }, []);

  useEffect(() => {
    const selectedPlant = manualEntry ? customPlant : plant;
    if (zone && selectedPlant) {
      fetch(`http://127.0.0.1:5000/api/planting-info/${selectedPlant}?zone=${zone}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
            setInfo(null);
          } else {
            setInfo(data);
            setError("");
          }
        })
        .catch(err => {
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
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div>
        <h3 className="text-lg font-semibold">Weather</h3>
        <WeatherWidget />
      </div>

      {!zone ? (
        <div>
          <h3 className="text-lg font-semibold">Set Your ZIP Code</h3>
          <ZipZoneForm onZoneUpdated={handleZoneUpdate} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">
              Planting Timeline for {city || `Zone ${zone}`}
            </h3>
            <button onClick={resetLocation} className="text-sm text-blue-600 underline">
              Reset Location
            </button>
          </div>

          <label className="block mb-2">
            Choose a plant:
            <div className="flex gap-2 mt-1">
              {!manualEntry ? (
                <>
                  <select
                    value={plant}
                    onChange={(e) => setPlant(e.target.value)}
                    className="p-2 border rounded"
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
                    className="text-sm text-blue-500 underline"
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
                    className="p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setManualEntry(false);
                      setCustomPlant("");
                    }}
                    className="text-sm text-blue-500 underline"
                  >
                    Choose from list
                  </button>
                </>
              )}
            </div>
          </label>

          {error && <p className="text-red-600">{error}</p>}
          <PlantTimeline info={info} />

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Change ZIP Code</h3>
            <ZipZoneForm onZoneUpdated={handleZoneUpdate} />
          </div>
        </div>
      )}
    </div>
  );
}
