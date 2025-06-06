import React from 'react';
import PlantCard from '../components/PlantCard';

function Garden() {
  // Example plants — later will come from Flask backend
  const examplePlants = [
    { name: 'Tomato', datePlanted: '2025-05-01', growthStage: 'Seedling' },
    { name: 'Basil', datePlanted: '2025-05-15', growthStage: 'Vegetative' },
    { name: 'Carrot', datePlanted: '2025-06-01', growthStage: 'Germination' },
  ];

  return (
    <div>
      <h2>Garden Tracker</h2>
      {examplePlants.map((plant, index) => (
        <PlantCard key={index} plant={plant} />
      ))}
    </div>
  );
}

export default Garden;
