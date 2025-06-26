import { useState } from "react";

export default function ZipZoneForm({ onZoneUpdated }) {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/update-zip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ zip_code: zip }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to update ZIP");
    } else {
      localStorage.setItem("zone", data.zone);
      onZoneUpdated(data.zone);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Enter ZIP Code"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        className="border p-2 w-full"
      />
      {error && <p className="text-red-600">{error}</p>}
      <button className="bg-green-600 text-white py-2 px-4 rounded" type="submit">
        Save ZIP
      </button>
    </form>
  );
}
