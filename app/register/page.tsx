"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Registration failed");
            }

            // Automatically log them in after successful registration or redirect
            router.push("/?registered=true");
        } catch (err: any) {
            setError(err.message || "Failed to connect to the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={`min-h-screen bg-[#F2F2F2] flex items-center justify-center ${inter.className}`}>
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-[#F2F2F2]">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BCB88]/10 rounded-2xl mb-4">
                        <svg className="w-8 h-8 text-[#8BCB88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-[#3A3A3A] tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-[#3A3A3A]/60 mt-2">Join to use the energy predictor</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
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
                            placeholder="Choose a username"
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
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#3A3A3A]/80 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[#F2F2F2] text-[#3A3A3A] border border-[#F2F2F2]
                       focus:outline-none focus:ring-2 focus:ring-[#4F83CC] focus:border-transparent 
                       transition-all duration-200"
                            placeholder="Confirm your password"
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
                        className="w-full bg-[#8BCB88] hover:bg-[#A8E05F] text-white font-semibold py-4 px-6 
                     rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-[#8BCB88]/30 
                     hover:shadow-[#8BCB88]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 text-center bg-[#F2F2F2] py-4 rounded-xl">
                    <p className="text-[#3A3A3A]/70 text-sm">
                        Already have an account?{" "}
                        <Link href="/" className="text-[#4F83CC] hover:text-[#3A3A3A] font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
