"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [targetExam, setTargetExam] = useState("JEE Main");
  const [targetBranch, setTargetBranch] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill existing user credentials
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setTargetExam(user.targetExam || "JEE Main");
      setTargetBranch(user.targetBranch || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Form validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          targetExam,
          targetBranch: targetBranch.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setSuccess(true);
      await refreshUser(); // Update navbar user state immediately
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col justify-between relative overflow-hidden">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col relative overflow-hidden">
      {/* Glow background grid */}
      <div className="bg-grid-glow" />

      {/* Navigation */}
      <Navbar />

      {/* Main Console */}
      <main className="max-w-2xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-zinc-900/60 pb-6 mb-8 space-y-2"
        >
          <span className="px-3 py-0.5 text-[9px] font-extrabold uppercase bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg tracking-widest inline-block select-none shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            User Workspace
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            My Profile Settings
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Customize your academic preferences, targets, and personal bio details.
          </p>
        </motion.div>

        {/* Profile Editing Form Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#0c0c10]/60 border border-zinc-900 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input - Email (Disabled/Locked) */}
            <div className="space-y-2">
              <label className="text-[9px] font-extrabold tracking-widest text-zinc-550 uppercase">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full bg-[#111116]/40 border border-zinc-900 rounded-xl px-4 py-3 text-xs text-zinc-500 cursor-not-allowed select-none focus:outline-none"
              />
              <p className="text-[10px] text-zinc-600 font-medium">Email address changes are managed securely by credentials administrators.</p>
            </div>

            {/* Input - Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* Grid for Exam and Branch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select - Target Exam */}
              <div className="space-y-2">
                <label htmlFor="targetExam" className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">
                  Target Exam
                </label>
                <div className="relative">
                  <select
                    id="targetExam"
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 appearance-none cursor-pointer"
                  >
                    <option>JEE Main</option>
                    <option>JEE Advanced</option>
                    <option>TNEA</option>
                    <option>VITEEE</option>
                    <option>SRMJEEE</option>
                    <option>SAEEE</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Input - Target Branch */}
              <div className="space-y-2">
                <label htmlFor="targetBranch" className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">
                  Target Branch
                </label>
                <input
                  id="targetBranch"
                  type="text"
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Input - Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                maxLength={500}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your academic goals..."
                className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all resize-none"
              />
              <div className="flex justify-end text-[10px] text-zinc-650 font-mono">
                {bio.length}/500 characters
              </div>
            </div>

            {/* Error and Success Banners */}
            <AnimatePresence mode="popLayout">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-950/10 border border-red-900/20 rounded-xl p-4 text-xs text-red-400 flex items-center gap-3 overflow-hidden"
                >
                  <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-950/10 border border-emerald-900/20 rounded-xl p-4 text-xs text-emerald-400 flex items-center gap-3 overflow-hidden"
                >
                  <svg className="w-5 h-5 flex-shrink-0 text-emerald-555" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Profile updated successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 text-xs font-semibold bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#060608] py-10 mt-auto relative z-10 text-center text-[10px] font-medium text-zinc-650">
        <span>&copy; {new Date().getFullYear()} Campus Orbit. All rights reserved.</span>
      </footer>
    </div>
  );
}
