import React, { useState, useEffect } from "react";

const PlantCard = ({ plant, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(plant.notes || "");
  const [plantName, setPlantName] = useState(plant.plant_name || "");
  const [datePlanted, setDatePlanted] = useState(plant.date_planted || "");
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);


  useEffect(() => {
    if (plant.date_planted && plant.growth_days) {
      const plantedDate = new Date(plant.date_planted);
      const totalDays = plant.growth_days;
      const today = new Date();
      const daysPassed = Math.floor((today - plantedDate) / (1000 * 60 * 60 * 24));
      const remaining = totalDays - daysPassed;
      setDaysRemaining(remaining);

      const progress = Math.min((daysPassed / totalDays) * 100, 100);
      setProgressPercent(progress);
    } else {
      setDaysRemaining(null);
      setProgressPercent(0);
    }
  }, [plant.date_planted, plant.growth_days]);

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
    <div className="border rounded-xl p-4 shadow-lg bg-white hover:shadow-2xl transition duration-300">
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
          <h2 className="text-xl font-semibold mb-1">
            {plant.nickname || plant.plant_name}
          </h2>

         
          <p className="text-sm text-gray-600 mb-1">
            🌱 Planted:{" "}
            {plant.date_planted
              ? new Date(plant.date_planted).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>

          
          {!plant.date_planted && plant.timeline?.start_month && plant.timeline?.end_month && (
            <p className="text-sm text-green-700 mb-1">
              📍 Best planting: {plant.timeline.start_month} – {plant.timeline.end_month}
            </p>
          )}

          
          {plant.growth_days && (
            <p className="text-sm text-blue-700 mb-1">
              ⏳ Days to harvest: {plant.growth_days}
            </p>
          )}

          
          {daysRemaining != null && daysRemaining > 0 && (
            <p className="text-sm text-orange-700 mb-1">
              📅 Estimated harvest in: {daysRemaining} days
            </p>
          )}
          {daysRemaining != null && daysRemaining <= 0 && (
            <p className="text-sm text-green-600 font-semibold mb-1">
              ✅ Ready for harvest!
            </p>
          )}

          
          {daysRemaining > 0 && plant.expected_harvest && (
            <p className="text-sm text-purple-700 mb-2">
              🗓 Expected harvest date:{" "}
              {new Date(plant.expected_harvest).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          
          {plant.growth_days && (
            <div className="w-full h-6 bg-gray-200 rounded-full mb-2 relative">
              <div
                className={`h-6 rounded-full ${
                  daysRemaining <= 0 ? "bg-green-500" : "bg-blue-400"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
              <span className="absolute w-full text-center text-xs font-medium text-white top-0 left-0 h-6 flex items-center justify-center">
                {Math.floor(progressPercent)}%
              </span>
            </div>
          )}

         
          <p className="mt-2 text-gray-700">{plant.notes || "No notes"}</p>
        </>
      )}

      
      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleEdit}
        >
          {editing ? "Save" : "Edit"}
        </button>
        <button
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={() => onDelete(plant.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PlantCard;