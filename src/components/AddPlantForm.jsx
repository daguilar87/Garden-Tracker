import React, { useState, useEffect } from "react";

const AddPlantForm = ({ onPlantAdded }) => {
  const [plantOptions, setPlantOptions] = useState([]);
  const [useCustom, setUseCustom] = useState(false);
  const [plantId, setPlantId] = useState("");
  const [customName, setCustomName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/plants")
      .then((res) => res.json())
      .then((data) => setPlantOptions(data))
      .catch((err) => {
        console.error("Error loading plant options:", err);
        setError("Failed to load plant list.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    if (!plantingDate || (!useCustom && !plantId) || (useCustom && !customName)) {
      setError("All fields are required.");
      return;
    }

    const payload = {
      planting_date: plantingDate,
      notes,
      ...(useCustom
        ? { plant_name: customName }
        : { plant_id: plantId }),
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/api/user/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add plant.");
      } else {
        setError("");
        setPlantId("");
        setCustomName("");
        setPlantingDate("");
        setNotes("");
        onPlantAdded();
      }
    } catch (err) {
      console.error("Error submitting plant:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">Add a Plant</h3>

      {!useCustom ? (
        <div>
          <label className="block mb-1">Select a plant:</label>
          <select
            value={plantId}
            onChange={(e) => setPlantId(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">-- Choose from list --</option>
            {plantOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setUseCustom(true);
              setPlantId("");
            }}
            className="text-sm text-blue-500 mt-2 underline"
          >
            Enter manually instead
          </button>
        </div>
      ) : (
        <div>
          <label className="block mb-1">Plant name:</label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="e.g., Zucchini"
          />
          <button
            type="button"
            onClick={() => {
              setUseCustom(false);
              setCustomName("");
            }}
            className="text-sm text-blue-500 mt-2 underline"
          >
            Choose from list instead
          </button>
        </div>
      )}

      <div>
        <label className="block mb-1">Planting date:</label>
        <input
          type="date"
          value={plantingDate}
          onChange={(e) => setPlantingDate(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Notes (optional):</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="p-2 border rounded w-full"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Add Plant
      </button>
    </form>
  );
};

export default AddPlantForm;
