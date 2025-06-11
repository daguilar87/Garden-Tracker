import React, { useEffect, useState } from "react";
import PlantCard from "../components/PlantCard";

const Garden = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/plants")
      .then((res) => res.json())
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching plants:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading your garden...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🌱 My Garden</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
};

export default Garden;
