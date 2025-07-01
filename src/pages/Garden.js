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
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
};

export default Garden;
