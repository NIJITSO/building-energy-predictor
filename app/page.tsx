"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true");
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid username or password");
      }
    } catch (err: any) {
      setError("Failed to connect to the authentication server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen bg-[#F2F2F2] flex items-center justify-center ${inter.className}`}>
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-[#F2F2F2]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4F83CC]/10 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-[#4F83CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#3A3A3A] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-[#3A3A3A]/60 mt-2">Sign in to access the predictor</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A]/80 mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F2F2F2] text-[#3A3A3A] border border-[#F2F2F2]
                       focus:outline-none focus:ring-2 focus:ring-[#4F83CC] focus:border-transparent 
                       transition-all duration-200"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3A3A3A]/80 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F2F2F2] text-[#3A3A3A] border border-[#F2F2F2]
                       focus:outline-none focus:ring-2 focus:ring-[#4F83CC] focus:border-transparent 
                       transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F83CC] hover:bg-[#6FA3E6] text-white font-semibold py-4 px-6 
                     rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-[#4F83CC]/30 
                     hover:shadow-[#4F83CC]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center bg-[#F2F2F2] py-4 rounded-xl">
          <p className="text-[#3A3A3A]/70 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#4F83CC] hover:text-[#3A3A3A] font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
