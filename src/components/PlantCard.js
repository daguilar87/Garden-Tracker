import React from "react";

const PlantCard = ({ plant }) => {
  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h2 className="text-xl font-semibold">{plant.name}</h2>
      <p><strong>Date Planted:</strong> {plant.datePlanted}</p>
      <p><strong>Growth Stage:</strong> {plant.growthStage}</p>
    </div>
  );
};

export default PlantCard;
