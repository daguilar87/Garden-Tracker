import React from "react";

const PlantCard = ({ plant }) => {
  let expectedHarvest = null;
  if (plant.date_planted && plant.growth_days) {
    const plantingDate = new Date(plant.date_planted);
    const harvestDate = new Date(plantingDate);
    harvestDate.setDate(harvestDate.getDate() + plant.growth_days);
    expectedHarvest = harvestDate.toDateString();
  }

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h2 className="text-xl font-semibold">{plant.plant_name}</h2>
      <p><strong>Date Planted:</strong> {plant.date_planted || "N/A"}</p>
      <p><strong>Growth Stage:</strong> {plant.growth_stage || "Unknown"}</p>
      {expectedHarvest && (
        <p><strong>Expected Harvest:</strong> {expectedHarvest}</p>
      )}
      {plant.notes && <p><em>Notes: {plant.notes}</em></p>}
    </div>
  );
};

export default PlantCard;
