const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function PlantTimeline({ info }) {
  if (!info) return <p>No timeline data available.</p>;

  const getIndex = (month) => months.indexOf(month);
  const pStart = getIndex(info.plant_start);
  const pEnd = getIndex(info.plant_end);
  const hStart = getIndex(info.harvest_start);
  const hEnd = getIndex(info.harvest_end);

  return (
    <div className="mt-4 space-y-1">
      <div className="flex text-xs">
        {months.map((m) => (
          <div key={m} className="flex-1 text-center">{m}</div>
        ))}
      </div>
      <div className="flex h-6">
        {months.map((m, i) => {
          let color = "";
          if (i >= pStart && i <= pEnd) color = "bg-green-400";
          if (i >= hStart && i <= hEnd) color = "bg-yellow-400";
          return <div key={i} className={`flex-1 border ${color}`}></div>;
        })}
      </div>
    </div>
  );
}
