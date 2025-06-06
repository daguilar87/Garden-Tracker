import React from 'react';

function PlantCard({ plant }) {
  return (
    <div style={{
      border: '1px solid #4CAF50',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      backgroundColor: '#f9fff9',
    }}>
      <h3>{plant.name}</h3>
      <p>Planted on: {plant.datePlanted}</p>
      <p>Growth Stage: {plant.growthStage}</p>
      {/* Add image, notes, more fields later */}
    </div>
  );
}

export default PlantCard;
