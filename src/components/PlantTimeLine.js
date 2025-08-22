import React from "react";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function PlantTimeline({ info, zone }) {
  if (!info || !info.zones) return <p className="text-gray-500">No timeline data available.</p>;

  // Find zone key case-insensitively
  const zoneKey = Object.keys(info.zones).find(z => z.toLowerCase() === zone.toLowerCase());
  if (!zoneKey) return <p className="text-gray-500">No timeline data available.</p>;

  const zoneInfo = info.zones[zoneKey];

  const startIndex = months.indexOf(zoneInfo.start_month);
  const endIndex = months.indexOf(zoneInfo.end_month);

  let harvestDateStr = null;
  if (info.average_days_to_harvest) {
    const plantingDate = new Date();
    const harvestDate = new Date(plantingDate);
    harvestDate.setDate(harvestDate.getDate() + info.average_days_to_harvest);
    harvestDateStr = harvestDate.toDateString();
  }

  return (
    <div>
      <div className="mb-2 text-sm text-gray-700">
        Best planting: <strong>{zoneInfo.start_month}</strong> to <strong>{zoneInfo.end_month}</strong>
      </div>

      <div className="grid grid-cols-12 gap-1 text-xs mb-4">
        {months.map((month, index) => {
          const isActive =
            startIndex !== -1 &&
            endIndex !== -1 &&
            ((startIndex <= endIndex && index >= startIndex && index <= endIndex) ||
             (startIndex > endIndex && (index >= startIndex || index <= endIndex)));

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
          <strong>Expected Harvest:</strong> {harvestDateStr}
        </div>
      )}
    </div>
  );
}
