import React, { useState, useEffect } from "react";

const AddPlantForm = ({ onPlantAdded }) => {
  const [plants, setPlants] = useState([]);
  const [plantId, setPlantId] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/plants")
      .then((res) => res.json())
      .then((data) => {
        setPlants(data);
        if (data.length > 0) {
          setPlantId(data[0].id);
        }
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/user/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        plant_id: plantId,
        planting_date: plantingDate,
        notes: notes,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add plant");
        return res.json();
      })
      .then((data) => {
        setMessage("🌱 Plant added to your garden!");
        setNotes("");
        setPlantingDate("");
        onPlantAdded(); // refresh garden list
      })
      .catch((err) => {
        setMessage("❌ Error adding plant.");
        console.error(err);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 bg-white shadow max-w-md mb-6"
    >
      <h3 className="text-lg font-semibold mb-2">Add a Plant to Your Garden</h3>

      <label className="block mb-2">
        Plant:
        <select
          value={plantId}
          onChange={(e) => setPlantId(e.target.value)}
          className="ml-2 p-1 border rounded"
        >
          {plants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-2">
        Planting Date:
        <input
          type="date"
          value={plantingDate}
          onChange={(e) => setPlantingDate(e.target.value)}
          className="ml-2 p-1 border rounded"
          required
        />
      </label>

      <label className="block mb-2">
        Notes:
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="block w-full p-1 border rounded mt-1"
        />
      </label>

      <button
        type="submit"
        className="mt-3 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Plant
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
};

export default AddPlantForm;
