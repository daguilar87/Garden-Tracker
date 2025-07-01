import React from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function PlantTimeline({ info }) {
  if (!info) return <p className="text-gray-500">No timeline data available.</p>;

  const startIndex = months.indexOf(info.start);
  const endIndex = months.indexOf(info.end);

  let harvestDateStr = null;
  if (info.planting_date && info.growth_days) {
    const plantingDate = new Date(info.planting_date);
    const harvestDate = new Date(plantingDate);
    harvestDate.setDate(harvestDate.getDate() + info.growth_days);
    harvestDateStr = harvestDate.toDateString();
  }

  return (
    <div>
      <div className="mb-2 text-sm text-gray-700">
        Best planting: <strong>{info.start}</strong> to <strong>{info.end}</strong>
      </div>

      <div className="grid grid-cols-12 gap-1 text-xs mb-4">
        {months.map((month, index) => {
          const isActive =
            startIndex !== -1 &&
            endIndex !== -1 &&
            (
              (startIndex <= endIndex && index >= startIndex && index <= endIndex) || 
              (startIndex > endIndex && (index >= startIndex || index <= endIndex))
            );

          return (
            <div
              key={month}
              className={`p-2 rounded text-center border ${
                isActive ? "bg-green-400 text-white font-semibold" : "bg-gray-100 text-gray-700"
              }`}
            >
              {month.slice(0, 3)}
            </div>
          );
        })}
      </div>

      {harvestDateStr && (
        <div className="text-sm text-gray-800">
          <strong>Expected Harvest Date:</strong> {harvestDateStr}
        </div>
      )}
    </div>
  );
}
