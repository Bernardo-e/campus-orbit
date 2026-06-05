"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
}

interface College {
  id: string;
  name: string;
  location: string;
  rating: number;
  fees: number;
  image: string | null;
  description: string;
  courses: Course[];
  reviews: Review[];
}

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const { user } = useAuth();

  // 1. Load comparison IDs from URL searchParams or localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const idsQuery = urlParams.get("ids");
      
      let ids: string[] = [];
      if (idsQuery) {
        ids = idsQuery.split(",");
      } else {
        const stored = localStorage.getItem("campus_orbit_compare_ids");
        if (stored) {
          ids = JSON.parse(stored);
        }
      }
      setCompareIds(ids);
    }
  }, []);

  // 2. Fetch full college details including relations once IDs are loaded
  useEffect(() => {
    const fetchCompareData = async () => {
      if (compareIds.length === 0) {
        setColleges([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          ids: compareIds.join(","),
          include: "courses,reviews",
        });
        
        const res = await fetch(`/api/colleges?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch comparison data");
        const data = await res.json();
        
        const sortedColleges = compareIds
          .map((id) => data.colleges.find((c: College) => c.id === id))
          .filter(Boolean) as College[];

        setColleges(sortedColleges);
      } catch (err: any) {
        console.error(err);
        setError("An error occurred while loading comparison details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompareData();
  }, [compareIds]);

  // Remove a college from comparison
  const handleRemove = (id: string) => {
    const updated = compareIds.filter((item) => item !== id);
    setCompareIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("campus_orbit_compare_ids", JSON.stringify(updated));
      const url = new URL(window.location.href);
      if (updated.length > 0) {
        url.searchParams.set("ids", updated.join(","));
      } else {
        url.searchParams.delete("ids");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Clear all selections
  const handleClearAll = () => {
    setCompareIds([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("campus_orbit_compare_ids");
      const url = new URL(window.location.href);
      url.searchParams.delete("ids");
      window.history.replaceState({}, "", url.toString());
    }
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
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900/60 pb-6"
        >
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-[9px] font-bold text-zinc-550 hover:text-white transition-colors uppercase tracking-widest mb-2 group">
              <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Explorer
            </Link>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Compare Institutions
            </h1>
          </div>
          {colleges.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4.5 py-2 text-xs font-semibold border border-zinc-850 hover:border-zinc-755 bg-zinc-900/20 hover:bg-zinc-850/60 rounded-xl text-zinc-400 hover:text-white transition-all w-fit cursor-pointer"
            >
              Clear Comparison
            </button>
          )}
        </motion.div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-550 font-medium tracking-wide">Gathering academic records...</p>
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
          /* EMPTY STATE */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4 max-w-md mx-auto"
          >
            <div className="w-14 h-14 rounded-full bg-[#0c0c10]/80 flex items-center justify-center text-zinc-650 border border-zinc-900/80 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-zinc-200">No institutions selected</h3>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              Select up to 3 colleges from the listing page explorer to view their criteria side-by-side.
            </p>
            <Link
              href="/"
              className="px-5 py-2.5 text-xs font-semibold bg-white hover:bg-zinc-200 text-black rounded-full transition-all duration-300 shadow-sm block w-fit mx-auto"
            >
              Browse Colleges
            </Link>
          </motion.div>
        ) : (
          /* COMPARISON TABLE / GRID */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-900/50"
          >
            <div className="min-w-[750px] space-y-px bg-zinc-950/40 border border-zinc-900/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
              
              {/* Header Row: Images & Remove Actions */}
              <div className="grid grid-cols-4 bg-[#0a0a0d]/90 py-6 px-6 items-center">
                <div className="text-[10px] font-bold tracking-widest text-zinc-550 uppercase">Institution</div>
                {colleges.map((college) => (
                  <div key={college.id} className="px-4 relative space-y-4 group">
                    <button
                      onClick={() => handleRemove(college.id)}
                      className="absolute top-2 right-6 p-1.5 bg-black/60 hover:bg-red-950/80 text-zinc-450 hover:text-red-400 border border-white/5 rounded-xl transition-all z-10 cursor-pointer shadow-md"
                      title="Remove from comparison"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-900 bg-zinc-950 relative shadow-lg">
                      {college.image ? (
                        <img
                          src={college.image}
                          alt={college.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[10px] uppercase font-bold tracking-wider">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <Link href="/" key={i} className="mx-4 text-center text-zinc-600 hover:text-zinc-400 border border-dashed border-zinc-900 hover:border-zinc-700 rounded-xl aspect-video flex items-center justify-center text-xs font-semibold transition-all cursor-pointer bg-zinc-900/10">
                    + Add College
                  </Link>
                ))}
              </div>

              {/* Name Row */}
              <div className="grid grid-cols-4 bg-[#0c0c10]/70 py-4.5 px-6 border-b border-zinc-900/40 items-center">
                <div className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Name</div>
                {colleges.map((college) => (
                  <div key={college.id} className="px-4 font-bold text-white text-sm">
                    {college.name}
                  </div>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <div key={i} className="px-4 text-zinc-700 text-xs">-</div>
                ))}
              </div>

              {/* Location Row */}
              <div className="grid grid-cols-4 bg-[#0a0a0d]/60 py-4.5 px-6 border-b border-zinc-900/40 items-center">
                <div className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Location</div>
                {colleges.map((college) => (
                  <div key={college.id} className="px-4 text-xs text-zinc-350 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-zinc-550 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="truncate font-medium">{college.location}</span>
                  </div>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <div key={i} className="px-4 text-zinc-700 text-xs">-</div>
                ))}
              </div>

              {/* Rating Row */}
              <div className="grid grid-cols-4 bg-[#0c0c10]/70 py-4.5 px-6 border-b border-zinc-900/40 items-center">
                <div className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Rating</div>
                {colleges.map((college) => (
                  <div key={college.id} className="px-4 flex items-center gap-1.5 text-xs">
                    <div className="flex items-center text-amber-550">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(college.rating) ? "fill-current" : "stroke-current fill-none"}`}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.56-.375-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-bold text-zinc-200">{college.rating.toFixed(1)}</span>
                  </div>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <div key={i} className="px-4 text-zinc-700 text-xs">-</div>
                ))}
              </div>

              {/* Annual Tuition Fees Row */}
              <div className="grid grid-cols-4 bg-[#0a0a0d]/60 py-4.5 px-6 border-b border-zinc-900/40 items-center">
                <div className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Annual Fees</div>
                {colleges.map((college) => (
                  <div key={college.id} className="px-4 font-mono text-xs text-blue-400 font-bold">
                    ${college.fees.toLocaleString()} / Year
                  </div>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <div key={i} className="px-4 text-zinc-700 text-xs">-</div>
                ))}
              </div>

              {/* Courses Row */}
              <div className="grid grid-cols-4 bg-[#0c0c10]/70 py-6 px-6 border-b border-zinc-900/40 items-start">
                <div className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase pt-1">Courses</div>
                {colleges.map((college) => (
                  <div key={college.id} className="px-4 space-y-3">
                    {college.courses.length === 0 ? (
                      <span className="text-[10px] text-zinc-600 font-semibold uppercase">No courses listed</span>
                    ) : (
                      college.courses.map((course) => (
                        <div key={course.id} className="bg-zinc-900/40 border border-zinc-900/80 rounded-xl p-3 shadow-sm">
                          <h4 className="text-[11px] font-bold text-white">{course.name}</h4>
                          <div className="flex items-center justify-between text-[9px] text-zinc-500 mt-1.5 font-medium">
                            <span>{course.duration}</span>
                            <span className="font-mono text-blue-400">${course.fees.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <div key={i} className="px-4 text-zinc-700 text-xs">-</div>
                ))}
              </div>

              {/* Student Review Snippet Row */}
              <div className="grid grid-cols-4 bg-[#0a0a0d]/60 py-6 px-6 border-b border-zinc-900/40 items-start">
                <div className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase pt-1">Reviews</div>
                {colleges.map((college) => (
                  <div key={college.id} className="px-4 space-y-3">
                    {college.reviews.length === 0 ? (
                      <span className="text-[10px] text-zinc-600 font-semibold uppercase">No reviews listed</span>
                    ) : (
                      college.reviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="bg-zinc-900/20 border border-zinc-900/50 rounded-xl p-3 space-y-1 shadow-sm">
                          <div className="flex items-center text-amber-500 gap-1">
                            <span className="text-[9px] font-bold text-zinc-350">{review.rating} ★</span>
                          </div>
                          <p className="text-[10px] text-zinc-450 italic leading-relaxed">
                            "{review.comment}"
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <div key={i} className="px-4 text-zinc-700 text-xs">-</div>
                ))}
              </div>

              {/* Action Links Row */}
              <div className="grid grid-cols-4 bg-[#0c0c10]/70 py-5 px-6 items-center">
                <div className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Profile</div>
                {colleges.map((college) => (
                  <div key={college.id} className="px-4">
                    <Link
                      href={`/colleges/${college.id}`}
                      className="inline-block w-full text-center py-2 text-xs font-semibold border border-zinc-850 hover:border-zinc-750 bg-zinc-900/40 hover:bg-zinc-850 rounded-xl text-zinc-350 hover:text-white transition-all shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <div key={i} className="px-4 text-zinc-700 text-xs">-</div>
                ))}
              </div>

            </div>
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
