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
    <main className={`min-h-screen bg-[#F2F2F2] ${inter.className}`}>
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#3A3A3A] mb-3 tracking-tight">
            Building Energy{" "}
            <span className="text-[#4F83CC]">Predictor</span>
          </h1>
          <p className="text-[#3A3A3A]/70 text-lg max-w-2xl mx-auto font-light">
            Estimate daily energy consumption using machine learning based on building characteristics
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#F2F2F2]">
            <h2 className="text-2xl font-semibold text-[#3A3A3A] mb-6 flex items-center gap-3">
              Building Details
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A]/80 mb-2">Square Meters</label>
                <input
                  type="number"
                  name="square_meters"
                  required
                  step="0.01"
                  min="1"
                  value={formData.square_meters}
                  onChange={handleChange}
                  placeholder="e.g., 1500"
                  className="w-full px-4 py-3 rounded-xl bg-[#F2F2F2] text-[#3A3A3A] border border-[#F2F2F2]
                           focus:outline-none focus:ring-2 focus:ring-[#4F83CC] focus:border-transparent 
                           placeholder-[#3A3A3A]/40 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A]/80 mb-2">Year Built</label>
                <input
                  type="number"
                  name="year_built"
                  required
                  min="1800"
                  max="2024"
                  value={formData.year_built}
                  onChange={handleChange}
                  placeholder="e.g., 2005"
                  className="w-full px-4 py-3 rounded-xl bg-[#F2F2F2] text-[#3A3A3A] border border-[#F2F2F2]
                           focus:outline-none focus:ring-2 focus:ring-[#4F83CC] focus:border-transparent 
                           placeholder-[#3A3A3A]/40 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A]/80 mb-2">Primary Use</label>
                <div className="relative">
                  <select
                    name="primary_use"
                    required
                    value={formData.primary_use}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F2F2F2] text-[#3A3A3A] border border-[#F2F2F2]
                             focus:outline-none focus:ring-2 focus:ring-[#4F83CC] focus:border-transparent 
                             appearance-none cursor-pointer transition-all duration-200"
                  >
                    <option value="" disabled className="bg-white text-[#3A3A3A]">
                      Select building type...
                    </option>
                    <option value="0" className="bg-white">🎓 Education</option>
                    <option value="1" className="bg-white">🎭 Entertainment/Public Assembly</option>
                    <option value="2" className="bg-white">🍽️ Food Sales and Service</option>
                    <option value="3" className="bg-white">🏥 Healthcare</option>
                    <option value="4" className="bg-white">🏨 Lodging/Residential</option>
                    <option value="5" className="bg-white">🏢 Office</option>
                    <option value="6" className="bg-white">🅿️ Parking</option>
                    <option value="7" className="bg-white">🏛️ Public Services</option>
                    <option value="8" className="bg-white">⛪ Religious Worship</option>
                    <option value="9" className="bg-white">🛍️ Retail</option>
                    <option value="10" className="bg-white">⚡ Utility</option>
                    <option value="11" className="bg-white">📦 Warehouse/Storage</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#4F83CC]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A]/80 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#F2F2F2] text-[#3A3A3A] border border-[#F2F2F2]
                           focus:outline-none focus:ring-2 focus:ring-[#4F83CC] focus:border-transparent 
                           transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#4F83CC] hover:bg-[#6FA3E6] text-white font-semibold py-4 px-6 
                         rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 
                         disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-[#4F83CC]/30 
                         hover:shadow-[#4F83CC]/50 flex items-center justify-center gap-2"
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
              <div className="mt-4 p-4 bg-rose-100 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-start gap-2">
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
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#F2F2F2]">
            <h2 className="text-2xl font-semibold text-[#3A3A3A] mb-6 flex items-center gap-3">
              Prediction Results
            </h2>

            {prediction !== null ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#8BCB88]/20 to-[#A8E05F]/20 border border-[#8BCB88]/30 rounded-2xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BCB88]/20 rounded-2xl mb-3">
                    <svg className="w-8 h-8 text-[#8BCB88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-[#3A3A3A]/70 text-sm font-medium mb-2">Predicted Daily Energy</p>
                  <p className="text-5xl font-bold text-[#3A3A3A] mb-1">{prediction.toFixed(2)}</p>
                  <p className="text-2xl text-[#8BCB88]">kWh</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#F2F2F2] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-[#3A3A3A]/70">Monthly Estimate</span>
                    <span className="text-[#3A3A3A] font-semibold">{(prediction * 30).toFixed(2)} kWh</span>
                  </div>
                  <div className="bg-[#F2F2F2] rounded-xl p-4 flex justify-between items-center">
                    <span className="text-[#3A3A3A]/70">Annual Estimate</span>
                    <span className="text-[#3A3A3A] font-semibold">{(prediction * 365).toFixed(2)} kWh</span>
                  </div>
                </div>

                <div className="bg-[#F2F2F2] border border-[#8BCB88]/20 rounded-xl p-4">
                  <p className="text-[#3A3A3A]/70 text-sm leading-relaxed">
                    💡 This prediction is based on building characteristics and historical patterns. Actual
                    consumption may vary based on occupancy, equipment, and weather conditions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-20 h-20 bg-[#F2F2F2] rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[#4F83CC]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-[#3A3A3A] mb-2">No prediction yet</p>
                <p className="text-[#3A3A3A]/40 text-sm">Fill out the form and click predict to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Optional Energy Yellow Accent - Used sparingly for visual interest */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-[#3A3A3A]/60">
            <svg className="w-4 h-4 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
            </svg>
            <span>Powered by advanced machine learning algorithms</span>
          </div>
        </div>
      </div>
    </main>
  );
}