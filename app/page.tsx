"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    square_meters: "",
    year_built: "",
    primary_use: "",
    date: "",
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Updated to handle both inputs and select dropdowns
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          square_meters: parseFloat(formData.square_meters),
          year_built: parseInt(formData.year_built),
          primary_use: parseInt(formData.primary_use), // The dropdown value is parsed into a number here!
          date: formData.date,
        }),
      });

      const data = await response.json();
      setPrediction(data.predicted_energy_kwh);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to connect to the prediction API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Building Energy Predictor</h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4">
        <div>
          <label className="block text-sm mb-1">Square Meters</label>
          <input type="number" name="square_meters" required onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm mb-1">Year Built</label>
          <input type="number" name="year_built" required onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm mb-1">Primary Use</label>
          <select 
            name="primary_use" 
            required 
            value={formData.primary_use}
            onChange={handleChange} 
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="" disabled>Select building type...</option>
            <option value="0">Education</option>
            <option value="1">Entertainment/public assembly</option>
            <option value="2">Food sales and service</option>
            <option value="3">Healthcare</option>
            <option value="4">Lodging/residential</option>
            <option value="5">Office</option>
            <option value="6">Parking</option>
            <option value="7">Public services</option>
            <option value="8">Religious worship</option>
            <option value="9">Retail</option>
            <option value="10">Utility</option>
            <option value="11">Warehouse/storage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Date</label>
          <input type="date" name="date" required onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" />
        </div>

        <button type="submit" disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50">
          {loading ? "Predicting..." : "Predict Energy Consumption"}
        </button>
      </form>

      {prediction !== null && (
        <div className="mt-8 p-6 bg-green-900 border border-green-500 rounded-lg text-center w-full max-w-md">
          <h2 className="text-xl">Predicted Daily Energy</h2>
          <p className="text-3xl font-bold mt-2">{prediction.toFixed(2)} kWh</p>
        </div>
      )}
    </main>
  );
}