"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      setSuccess(true);

      // Auto login user on success
      login({
        id: data.id,
        name: data.name,
        email: data.email,
      });

      // Redirect
      const redirectTo = searchParams.get("redirect") || "/";
      setTimeout(() => {
        router.push(redirectTo);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* LOGO */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white group mb-2">
            <div className="w-6 h-6 rounded-full border border-blue-500 flex items-center justify-center p-0.5 group-hover:border-blue-400 transition-all duration-300">
              <div className="w-full h-full rounded-full bg-blue-600 animate-pulse" />
            </div>
            <span>Campus Orbit</span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-white mt-4">
            Create an account
          </h2>
          <p className="text-xs text-zinc-550 mt-1.5 font-medium">
            Start tracking your academic orbit today.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#0c0c10] border border-zinc-900 rounded-2xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 text-xs text-red-400 flex items-center gap-3">
              <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-950/20 border border-green-900/40 rounded-xl p-4 text-xs text-green-400 flex items-center gap-3">
              <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Account created successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                disabled={loading || success}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all duration-300"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={loading || success}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all duration-300"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={loading || success}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all duration-300"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] disabled:shadow-none hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col justify-center items-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
