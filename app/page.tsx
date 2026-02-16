"use client";

import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [formData, setFormData] = useState({
    square_meters: "",
    year_built: "",
    primary_use: "",
    date: "",
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          square_meters: parseFloat(formData.square_meters),
          year_built: parseInt(formData.year_built),
          primary_use: parseInt(formData.primary_use),
          date: formData.date,
        }),
      });

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      setPrediction(data.predicted_energy_kwh);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError("Failed to connect to the prediction API. Please ensure the server is running.");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 ${inter.className}`}>
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Building Energy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">
              Predictor
            </span>
          </h1>
          <p className="text-blue-200/80 text-lg max-w-2xl mx-auto font-light">
            Estimate daily energy consumption using machine learning based on building characteristics
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30">
                1
              </span>
              Building Details
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Square Meters</label>
                <input
                  type="number"
                  name="square_meters"
                  required
                  step="0.01"
                  min="1"
                  value={formData.square_meters}
                  onChange={handleChange}
                  placeholder="e.g., 1500"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                           placeholder-blue-300/50 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Year Built</label>
                <input
                  type="number"
                  name="year_built"
                  required
                  min="1800"
                  max="2024"
                  value={formData.year_built}
                  onChange={handleChange}
                  placeholder="e.g., 2005"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                           placeholder-blue-300/50 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Primary Use</label>
                <div className="relative">
                  <select
                    name="primary_use"
                    required
                    value={formData.primary_use}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                             appearance-none cursor-pointer transition-all duration-200"
                  >
                    <option value="" disabled className="bg-slate-800 text-blue-200">
                      Select building type...
                    </option>
                    <option value="0" className="bg-slate-800">🎓 Education</option>
                    <option value="1" className="bg-slate-800">🎭 Entertainment/Public Assembly</option>
                    <option value="2" className="bg-slate-800">🍽️ Food Sales and Service</option>
                    <option value="3" className="bg-slate-800">🏥 Healthcare</option>
                    <option value="4" className="bg-slate-800">🏨 Lodging/Residential</option>
                    <option value="5" className="bg-slate-800">🏢 Office</option>
                    <option value="6" className="bg-slate-800">🅿️ Parking</option>
                    <option value="7" className="bg-slate-800">🏛️ Public Services</option>
                    <option value="8" className="bg-slate-800">⛪ Religious Worship</option>
                    <option value="9" className="bg-slate-800">🛍️ Retail</option>
                    <option value="10" className="bg-slate-800">⚡ Utility</option>
                    <option value="11" className="bg-slate-800">📦 Warehouse/Storage</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-amber-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                           transition-all duration-200 [color-scheme:dark]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 
                         text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] 
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg 
                         shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Calculating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Predict Energy Consumption
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-sm flex items-start gap-2 backdrop-blur-sm">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-amber-500/30">
                2
              </span>
              Prediction Results
            </h2>

            {prediction !== null ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-2xl p-6 text-center backdrop-blur-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-2xl mb-3">
                    <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-amber-200 text-sm font-medium mb-2">Predicted Daily Energy</p>
                  <p className="text-5xl font-bold text-white mb-1">{prediction.toFixed(2)}</p>
                  <p className="text-2xl text-amber-300">kWh</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/10">
                    <span className="text-blue-200">Monthly Estimate</span>
                    <span className="text-white font-semibold">{(prediction * 30).toFixed(2)} kWh</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/10">
                    <span className="text-blue-200">Annual Estimate</span>
                    <span className="text-white font-semibold">{(prediction * 365).toFixed(2)} kWh</span>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-blue-200 text-sm leading-relaxed">
                    💡 This prediction is based on building characteristics and historical patterns. Actual
                    consumption may vary based on occupancy, equipment, and weather conditions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                  <svg className="w-10 h-10 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-blue-200 mb-2">No prediction yet</p>
                <p className="text-blue-300/60 text-sm">Fill out the form and click predict to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}