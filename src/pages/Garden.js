import React, { useEffect, useState } from "react";
import PlantCard from "../components/PlantCard";
import AddPlantForm from "../components/AddPlantForm";

const Garden = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");

  const fetchUserPlants = () => {
    fetch("http://localhost:5000/api/user/plants", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching plants:", err);
        setLoading(false);
      });
  };

  const handleEditPlant = async (id, updates) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/user/plants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Update failed:", err);
      } else {
        fetchUserPlants();
      }
    } catch (err) {
      console.error("Error updating plant:", err);
    }
  };

  const handleDeletePlant = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/user/plants/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Delete failed:", err);
      } else {
        fetchUserPlants();
      }
    } catch (err) {
      console.error("Error deleting plant:", err);
    }
  };

  useEffect(() => {
    fetchUserPlants();
  }, []);

  const filteredPlants = plants.filter((plant) =>
    plant.plant_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPlants = [...filteredPlants].sort((a, b) => {
    if (sortOption === "name") return a.plant_name.localeCompare(b.plant_name);
    return new Date(b.date_planted) - new Date(a.date_planted);
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500"></div>
      </div>
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

      <AddPlantForm onPlantAdded={fetchUserPlants} />

      {!sortedPlants.length ? (
        <p className="text-gray-500 italic mt-6">Your garden is empty. Add your first plant above! 🌿</p>
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
