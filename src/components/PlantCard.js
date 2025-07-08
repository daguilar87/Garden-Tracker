import React, { useState } from "react";

const PlantCard = ({ plant, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(plant.notes || "");
  const [plantName, setPlantName] = useState(plant.plant_name || "");
  const [datePlanted, setDatePlanted] = useState(plant.date_planted || "");

  const handleEdit = () => {
    if (editing) {
      onEdit(plant.id, {
        notes,
        plant_name: plantName,
        date_planted: datePlanted,
      });
    }
    setEditing(!editing);
  };

  return (
    <div className="border rounded p-4 shadow bg-white">
      {editing ? (
        <>
          <input
            type="text"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="Plant Name"
          />
          <input
            type="date"
            value={datePlanted}
            onChange={(e) => setDatePlanted(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Notes"
          />
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold">{plant.plant_name}</h2>
          <p className="text-sm text-gray-500">
            Planted: {plant.date_planted || "N/A"}
          </p>
          <p className="mt-2">{plant.notes || "No notes"}</p>
        </>
      )}

      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={handleEdit}
        >
          {editing ? "Save" : "Edit"}
        </button>
        <button
          className="px-3 py-1 bg-red-600 text-white rounded"
          onClick={() => onDelete(plant.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
