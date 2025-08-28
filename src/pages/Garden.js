import React, { useEffect, useState, useCallback } from "react";
import PlantCard from "../components/PlantCard";
import AddPlantForm from "../components/AddPlantForm";

const Garden = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");

  
  const fetchUserPlants = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/user/plants", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setPlants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching plants:", err);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    fetchUserPlants();
  }, [fetchUserPlants]);

 
  const handleEditPlant = (id, updates) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  
  const handleDeletePlant = (id) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
    fetch(`http://localhost:5000/api/user/plants/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).catch((err) => console.error("Error deleting plant:", err));
  };

 
  const filteredPlants = plants.filter((p) =>
    p.plant_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedPlants = [...filteredPlants].sort((a, b) =>
    sortOption === "name"
      ? a.plant_name.localeCompare(b.plant_name)
      : new Date(b.date_planted) - new Date(a.date_planted)
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6 border-b pb-2">
        🌱 My Garden
      </h1>

      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search plants..."
          className="p-2 border rounded w-full sm:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full sm:w-1/4"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date">Sort by Date Planted</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

     
      <AddPlantForm
        onPlantAdded={(newPlant) => setPlants((prev) => [newPlant, ...prev])}
      />

      
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 rounded-lg shadow"
              ></div>
            ))}
        </div>
      ) : sortedPlants.length === 0 ? (
        <p className="text-gray-500 italic mt-6">
          Your garden is empty. Add your first plant above! 🌿
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onEdit={handleEditPlant}
              onDelete={handleDeletePlant}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Garden;
