"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

interface College {
  id: string;
  name: string;
  location: string;
  rating: number;
  fees: number;
  image: string | null;
  description: string;
}

export default function CollegePredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState<College[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setColleges(null);

    const rankNum = parseInt(rank, 10);
    if (isNaN(rankNum) || rankNum <= 0) {
      setError("Please enter a valid positive rank.");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        exam,
        rank: rankNum.toString(),
      });
      const res = await fetch(`/api/predictor?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch predictions.");
      }

      setColleges(data.colleges);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 100, damping: 15 } 
    },
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col relative overflow-hidden">
      
      {/* Background grid */}
      <div className="bg-grid-glow" />

      {/* HEADER / NAVIGATION BAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col gap-10 relative z-10">
        
        {/* Title area with reveal animation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-zinc-900/60 pb-6 space-y-2"
        >
          <span className="px-3 py-0.5 text-[9px] font-extrabold uppercase bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg tracking-widest inline-block select-none shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            Admission Trajectory
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
            College Trajectory Predictor
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Enter your exam rank to discover matching college options based on previous cutoff ranges.
          </p>
        </motion.div>

        {/* INPUT FORM BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-2xl bg-[#0c0c10]/60 border border-zinc-900 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md"
        >
          <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* EXAM SELECTOR */}
            <div className="space-y-2">
              <label htmlFor="exam" className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">
                Select Exam
              </label>
              <div className="relative">
                <select
                  id="exam"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 appearance-none cursor-pointer"
                >
                  <option>JEE Main</option>
                  <option>JEE Advanced</option>
                  <option>TNEA</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* RANK INPUT */}
            <div className="space-y-2">
              <label htmlFor="rank" className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">
                Your Rank / Cutoff
              </label>
              <input
                id="rank"
                type="number"
                required
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 5000"
                min="1"
                className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* PREDICT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-semibold bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <span>Predict Trajectory</span>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* ERROR STATE */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-950/10 border border-red-900/20 rounded-2xl p-4 text-xs text-red-400 flex items-center gap-3 max-w-2xl"
            >
              <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING SHIMMER SKELETONS */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#0c0c10]/40 border border-zinc-900 rounded-2xl overflow-hidden h-[380px] animate-shimmer flex flex-col justify-between p-5">
                <div className="bg-zinc-950/80 h-40 w-full rounded-xl" />
                <div className="space-y-3 mt-4 flex-1">
                  <div className="h-4 bg-zinc-900/60 rounded-md w-3/4" />
                  <div className="h-3 bg-zinc-900/40 rounded-md w-1/2" />
                </div>
                <div className="h-8 bg-zinc-900/60 rounded-xl w-full mt-2" />
              </div>
            ))}
          </div>
        )}

        {/* RESULTS CONTAINER */}
        {!loading && colleges && (
          <div className="space-y-6">
            <h2 className="text-xs font-bold tracking-widest text-zinc-550 uppercase">
              Predicted Options ({colleges.length})
            </h2>

            {colleges.length === 0 ? (
              /* EMPTY STATE */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-dashed border-zinc-850 rounded-2xl py-20 text-center space-y-4 max-w-lg bg-[#0c0c10]/20"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center mx-auto text-zinc-600 border border-zinc-850">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-200">No matching institutions found</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Your rank does not fall within cutoff boundaries for any indexed institutions for this exam. Try entering a higher rank value.
                </p>
              </motion.div>
            ) : (
              /* CARDS GRID */
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {colleges.map((college) => (
                  <motion.article
                    key={college.id}
                    variants={cardVariants}
                    whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.35)", boxShadow: "0 10px 30px -15px rgba(59, 130, 246, 0.2)" }}
                    className="bg-[#0c0c10]/70 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[385px] justify-between group transition-all duration-300 relative"
                  >
                    {/* Image */}
                    <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                      {college.image ? (
                        <img
                          src={college.image}
                          alt={college.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center text-zinc-700 text-xs font-semibold uppercase tracking-wider">
                          No Image
                        </div>
                      )}
                      <span className="absolute top-3.5 right-3.5 px-2.5 py-1 text-[8px] font-extrabold uppercase bg-black/60 backdrop-blur-md text-zinc-300 border border-white/5 rounded-lg tracking-widest">
                        {college.rating >= 4.7 ? "Top Tier" : "Matched"}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-white group-hover:text-blue-450 transition-colors text-sm line-clamp-1">
                          {college.name}
                        </h3>

                        {/* Stars */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center text-amber-550">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(college.rating) ? "fill-current" : "stroke-current fill-none"}`}
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.56-.375-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z" />
                              </svg>
                            ))}
                          </div>
                          <span className="font-mono font-bold text-xs text-zinc-350">{college.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-zinc-450">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-zinc-550" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <span className="font-medium truncate">{college.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-zinc-550" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-mono text-blue-400 font-semibold">${college.fees.toLocaleString()} / Year</span>
                        </div>
                      </div>

                      {/* View Details Link */}
                      <Link
                        href={`/colleges/${college.id}`}
                        className="w-full text-center py-2.5 text-xs font-semibold border border-zinc-850 hover:border-zinc-755 bg-zinc-900/20 hover:bg-zinc-850 rounded-xl text-zinc-300 hover:text-white transition-all block"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#060608] py-12 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <Link href="/" className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full bg-blue-600" />
              </div>
              <span>Campus Orbit</span>
            </Link>
            <p className="text-xs text-zinc-555 leading-relaxed max-w-sm">
              Elevating the academic search experience through precise data and sophisticated discovery tools.
            </p>
          </div>
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3 text-xs font-semibold text-zinc-555">
            <Link href="/" className="hover:text-white transition-colors">About</Link>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Help Center</span>
            <span className="hover:text-white transition-colors cursor-pointer">API</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-zinc-950 flex items-center justify-between text-[10px] font-medium text-zinc-650">
          <span>&copy; {new Date().getFullYear()} Campus Orbit. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
