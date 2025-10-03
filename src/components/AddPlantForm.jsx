import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

const AddPlantForm = ({ onPlantAdded }) => {
  const [plantOptions, setPlantOptions] = useState([]);
  const [useCustom, setUseCustom] = useState(false);
  const [plantId, setPlantId] = useState("");
  const [customName, setCustomName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [loadedPlants, setLoadedPlants] = useState(false);

  useEffect(() => {
    if (open && !loadedPlants) {
      fetch("https://gardenflask.fly.dev/api/plants")
        .then((res) => res.json())
        .then((data) => {
          setPlantOptions(data);
          setLoadedPlants(true);
        })
        .catch(() => setError("Failed to load plant list."));
    }
  }, [open, loadedPlants]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) return setError("You must be logged in.");

    if (!plantingDate || (!useCustom && !plantId) || (useCustom && !customName))
      return setError("Please fill in all required fields.");

    const payload = {
      planting_date: plantingDate,
      notes,
      ...(useCustom ? { plant_name: customName } : { plant_id: plantId }),
    };

    try {
      const res = await fetch("https://gardenflask.fly.dev/api/user/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        setError(data.error || "Failed to add plant.");
      } else {
        if (onPlantAdded) onPlantAdded(data);

        setPlantId("");
        setCustomName("");
        setPlantingDate("");
        setNotes("");
        setSuccess("✅ Plant added successfully!");

        setTimeout(() => {
          setSuccess("");
          setOpen(false);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-6">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full text-left text-lg font-semibold text-green-700"
      >
        <span className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add a Plant
        </span>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {!useCustom ? (
            <div>
              <label className="block mb-1 font-medium">Select a plant:</label>
              <select
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                className="p-2 border rounded-lg w-full"
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
                className="mt-2 text-green-600 hover:text-green-800 text-sm"
              >
                Or enter a custom name
              </button>
            </div>
          ) : (
            <div>
              <label className="block mb-1 font-medium">Plant name:</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="p-2 border rounded-lg w-full"
                placeholder="e.g., Zucchini"
              />
              <button
                type="button"
                onClick={() => {
                  setUseCustom(false);
                  setCustomName("");
                }}
                className="mt-2 text-green-600 hover:text-green-800 text-sm"
              >
                Choose from list instead
              </button>
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Planting date:</label>
            <input
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="p-2 border rounded-lg w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Notes (optional):</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="p-2 border rounded-lg w-full"
              placeholder="Any tips or observations..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
          >
            Add Plant
          </button>
        </form>
      )}
    </div>
  );
};

export default AddPlantForm;
