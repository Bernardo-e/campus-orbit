"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface College {
  id: string;
  name: string;
  location: string;
  rating: number;
  fees: number;
  image: string | null;
}

export default function SavedCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id || null;

  // 2. Fetch saved colleges
  const fetchSavedColleges = async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/colleges/save", {
        headers: { "x-user-id": uid },
      });
      if (!res.ok) throw new Error("Failed to fetch saved colleges");
      const data = await res.json();
      setColleges(data.colleges);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading your saved colleges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSavedColleges(userId);
    }
  }, [userId]);

  // 3. Remove a saved college
  const handleRemove = async (collegeId: string) => {
    if (!userId) return;
    try {
      const res = await fetch("/api/colleges/save", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ collegeId }),
      });

      if (res.ok) {
        setColleges((prev) => prev.filter((c) => c.id !== collegeId));
      } else {
        throw new Error("Failed to unsave college");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error removing saved college.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col relative overflow-hidden">
      
      {/* Background grid */}
      <div className="bg-grid-glow" />

      {/* HEADER / NAVIGATION BAR */}
      <Navbar />

      {/* PAGE CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col gap-6 relative z-10">
        
        {/* Title area with reveal animation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-zinc-900/60 pb-6 space-y-2.5"
        >
          <Link href="/" className="inline-flex items-center gap-1.5 text-[9px] font-bold text-zinc-550 hover:text-white transition-colors uppercase tracking-widest group">
            <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Explorer
          </Link>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Saved Institutions
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Manage your bookmarked colleges and academic opportunities.
          </p>
        </motion.div>

        {/* LOADING STATE */}
        {loading || authLoading ? (
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
        ) : error ? (
          /* ERROR STATE */
          <div className="bg-red-950/10 border border-red-900/20 rounded-2xl p-4 text-xs text-red-400 max-w-xl mx-auto flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        ) : colleges.length === 0 ? (
          /* EMPTY STATE WITH MICRO-ANIMATION */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4 max-w-md mx-auto"
          >
            <div className="w-14 h-14 rounded-full bg-[#0c0c10]/80 flex items-center justify-center text-zinc-650 border border-zinc-900/80 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-zinc-200">No saved colleges</h3>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              Explore available options on the College Explorer page and click the heart icon to save institutions.
            </p>
            <Link
              href="/"
              className="px-5 py-2.5 text-xs font-semibold bg-white hover:bg-zinc-200 text-black rounded-full transition-all duration-300 shadow-sm block animate-pulse hover:animate-none"
            >
              Start Exploring
            </Link>
          </motion.div>
        ) : (
          /* SAVED COLLEGES GRID */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {colleges.map((college) => (
                <motion.article
                  key={college.id}
                  variants={cardVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.9, y: 15, transition: { duration: 0.2 } }}
                  whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.35)", boxShadow: "0 8px 30px -15px rgba(59, 130, 246, 0.15)" }}
                  className="bg-[#0c0c10]/70 border border-zinc-900 hover:bg-[#0c0c10]/95 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[380px] justify-between group transition-all duration-300 relative"
                >
                  {/* Image & Remove Action */}
                  <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                    {college.image ? (
                      <img
                        src={college.image}
                        alt={college.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center text-zinc-700 text-xs font-medium uppercase tracking-wider">
                        No Image Available
                      </div>
                    )}
                    
                    {/* Remove Heart Button */}
                    <button
                      onClick={() => handleRemove(college.id)}
                      className="absolute top-3.5 left-3.5 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 text-red-500 hover:bg-black/80 hover:scale-105 transition-all cursor-pointer z-10"
                      title="Remove from Saved"
                    >
                      <svg className="w-3.5 h-3.5 fill-red-500 stroke-red-500" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                    <span className="absolute top-3.5 right-3.5 px-2.5 py-1 text-[8px] font-extrabold uppercase bg-black/60 backdrop-blur-md text-zinc-300 border border-white/5 rounded-lg tracking-widest">
                      {college.rating >= 4.7 ? "Featured" : "Popular"}
                    </span>
                  </div>

                  {/* Content details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-white group-hover:text-blue-450 transition-colors text-sm line-clamp-1">
                        {college.name}
                      </h3>
                      
                      {/* Rating */}
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
                        <span className="font-mono font-bold text-xs text-zinc-300">{college.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-450">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-zinc-550" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="font-medium">{college.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-zinc-550" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-mono text-blue-400 font-semibold">₹{college.fees.toLocaleString()} / Year</span>
                      </div>
                    </div>

                    {/* View Profile */}
                    <Link
                      href={`/colleges/${college.id}`}
                      className="w-full text-center py-2.5 text-xs font-semibold border border-zinc-850 hover:border-zinc-750 bg-zinc-900/20 hover:bg-zinc-850 rounded-xl text-zinc-300 hover:text-white transition-all block"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
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
