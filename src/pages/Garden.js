import React, { useEffect, useState } from "react";
import PlantCard from "../components/PlantCard";
import AddPlantForm from "../components/AddPlantForm";

const Garden = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-4">Loading your garden...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🌱 My Garden</h1>

      <AddPlantForm onPlantAdded={fetchUserPlants} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onEdit={handleEditPlant}
            onDelete={handleDeletePlant}
          />
        ))}
      </div>
    </div>
  );
};

export default Garden;
