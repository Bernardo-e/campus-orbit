"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface College {
  id: string;
  name: string;
  location: string;
  rating: number;
  fees: number;
  image: string | null;
}

interface ApiResponse {
  colleges: College[];
  total: number;
  page: number;
  totalPages: number;
}

export default function Home() {
  // --- API Bound States ---
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"rating" | "fees" | "">("rating");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // --- Client-side Visual UI States ---
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [programTypes, setProgramTypes] = useState<string[]>([]);
  const [rankingRange, setRankingRange] = useState(100);
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for search focus (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load comparison selections from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("campus_orbit_compare_ids");
      if (stored) {
        setCompareIds(JSON.parse(stored));
      }
    }
  }, []);

  // Add or remove college from comparison list, capping at 3 selections
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 colleges.");
          return prev;
        }
        updated = [...prev, id];
      }
      localStorage.setItem("campus_orbit_compare_ids", JSON.stringify(updated));
      return updated;
    });
  };

  const { user } = useAuth();
  const userId = user?.id || null;
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Fetch saved college IDs for the current user session
  const fetchSavedColleges = async (uid: string) => {
    try {
      const res = await fetch("/api/colleges/save", {
        headers: { "x-user-id": uid },
      });
      if (res.ok) {
        const data = await res.json();
        setSavedIds(data.colleges.map((c: any) => c.id));
      }
    } catch (err) {
      console.error("Error fetching saved colleges:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSavedColleges(userId);
    } else {
      setSavedIds([]);
    }
  }, [userId]);

  // Toggle save status of a college
  const toggleSave = async (collegeId: string) => {
    if (!userId) {
      router.push("/login");
      return;
    }
    const isSaved = savedIds.includes(collegeId);

    try {
      const method = isSaved ? "DELETE" : "POST";
      const res = await fetch("/api/colleges/save", {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ collegeId }),
      });

      if (res.ok) {
        setSavedIds((prev) =>
          isSaved ? prev.filter((id) => id !== collegeId) : [...prev, collegeId]
        );
      }
    } catch (err) {
      console.error("Error toggling save status:", err);
    }
  };

  // Fetch colleges from API based on query params
  const fetchColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: "6",
      });

      if (sort) {
        params.append("sort", sort);
        params.append("order", order);
      }

      if (locationFilter && locationFilter !== "All Locations") {
        params.append("location", locationFilter);
      }
      if (programTypes.length > 0) {
        params.append("programTypes", programTypes.join(","));
      }
      if (rankingRange) {
        params.append("rankingRange", rankingRange.toString());
      }
      if (minFees) {
        params.append("minFees", minFees);
      }
      if (maxFees) {
        params.append("maxFees", maxFees);
      }

      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch college list");
      const data: ApiResponse = await res.json();
      
      setColleges(data.colleges);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching colleges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchColleges();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, sort, order, page, locationFilter, programTypes, rankingRange, minFees, maxFees]);

  // Handle Sort changes
  const handleSortChange = (newSort: "rating" | "fees") => {
    if (sort === newSort) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(newSort);
      setOrder(newSort === "rating" ? "desc" : "asc");
    }
    setPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setSort("rating");
    setOrder("desc");
    setPage(1);
    setLocationFilter("All Locations");
    setProgramTypes([]);
    setRankingRange(500);
    setMinFees("");
    setMaxFees("");
  };

  const handleProgramTypeChange = (type: string) => {
    setProgramTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 120, damping: 18 } 
    },
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col relative selection:bg-blue-600/30 selection:text-blue-200 overflow-x-hidden">
      
      {/* Background radial glow & Grid */}
      <div className="bg-grid-glow" />

      {/* HEADER / NAVIGATION BAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="py-20 text-center max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="space-y-4"
        >
          <span className="px-3.5 py-1 text-[10px] font-extrabold uppercase bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full tracking-widest inline-block select-none shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            Traversing Education Space
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-tight md:leading-[1.1]">
            Find your academic trajectory.
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium">
            Search, compare, and save world-class institutions with Campus Orbit’s discovery console.
          </p>
        </motion.div>
        
        {/* Search Bar Spotlight Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative max-w-2xl mx-auto mt-10 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="relative flex items-center bg-[#0d0d12]/90 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/10 transition-all duration-350">
            <div className="pl-4 text-zinc-500 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search universities, programs, or locations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent border-0 px-3 py-4 text-sm text-white placeholder-zinc-550 focus:outline-none focus:ring-0"
            />
            <div className="pr-4 hidden sm:flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 text-[10px] font-mono bg-zinc-900 border border-zinc-800 rounded-md text-zinc-500 shadow-sm select-none">
                ⌘ K
              </kbd>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-10 relative z-10">
        
        {/* SIDEBAR FILTER PANEL */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-[#0c0c10]/70 border border-zinc-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Filters</h2>
              <button 
                onClick={handleResetFilters}
                className="text-[9px] font-extrabold text-zinc-500 hover:text-blue-400 transition-colors uppercase tracking-widest cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* LOCATION FILTER */}
            <div className="space-y-2">
              <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Location</label>
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}
                  className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-750 appearance-none cursor-pointer"
                >
                  <option>All Locations</option>
                  <option>Tamil Nadu, India</option>
                  <option>Chennai / Madras</option>
                  <option>Tiruchirappalli / Trichy</option>
                  <option>Vellore</option>
                  <option>Kattankulathur</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* PROGRAM TYPE FILTER */}
            <div className="space-y-3">
              <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Program Type</label>
              <div className="space-y-3">
                {["Undergraduate", "Postgraduate", "PhD / Research"].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={programTypes.includes(type)}
                      onChange={() => handleProgramTypeChange(type)}
                      className="rounded border-zinc-800 bg-[#111116] text-blue-600 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors select-none">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* RANKING RANGE FILTER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Ranking Range</label>
                <span className="text-[10px] font-mono text-zinc-400">Top {rankingRange}</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={rankingRange}
                onChange={(e) => { setRankingRange(parseInt(e.target.value, 10)); setPage(1); }}
                className="w-full accent-blue-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-650">
                <span>Top 10</span>
                <span>Top 500</span>
              </div>
            </div>

            {/* ANNUAL FEES FILTER */}
            <div className="space-y-2">
              <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Annual Fees (INR)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minFees}
                  onChange={(e) => { setMinFees(e.target.value); setPage(1); }}
                  className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-3 py-2.5 text-xs text-zinc-300 placeholder-zinc-650 focus:outline-none focus:border-zinc-700"
                />
                <span className="text-zinc-650 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxFees}
                  onChange={(e) => { setMaxFees(e.target.value); setPage(1); }}
                  className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-3 py-2.5 text-xs text-zinc-300 placeholder-zinc-650 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>
          </div>

          {/* SCHOLARSHIP ALERT PANEL */}
          <div className="bg-[#0b132b]/20 border border-blue-900/20 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
            <span className="text-[9px] font-extrabold tracking-widest text-blue-400 uppercase block mb-1">Scholarship Alert</span>
            <p className="text-xs text-zinc-350 leading-relaxed font-medium">
              Apply for the 'Orbit Global Grant' before June 15.
            </p>
          </div>
        </aside>

        {/* RESULTS & CARDS PANEL */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-zinc-550 font-medium">
              Showing <span className="text-zinc-300">{loading ? "..." : total}</span> universities matching criteria
            </p>

            <div className="flex items-center gap-4">
              {/* Sorting controls */}
              <div className="flex items-center gap-1 bg-[#0c0c10]/60 border border-zinc-900/60 rounded-xl p-1">
                {(["rating", "fees"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSortChange(type)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      sort === type
                        ? "bg-zinc-800/80 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {type} {sort === type && (order === "desc" ? "↓" : "↑")}
                  </button>
                ))}
              </div>

              {/* View Switchers */}
              <div className="flex items-center bg-[#0c0c10]/60 border border-zinc-900/60 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-zinc-800 text-blue-450" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Grid View"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "list" ? "bg-zinc-800 text-blue-450" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="List View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ERROR ALERT BLOCK */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-950/10 border border-red-900/20 rounded-2xl p-4 text-xs text-red-400 flex items-center gap-3"
              >
                <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LOADING STATE (PREMIUM SHIMMERING SKELETONS) */}
          {loading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`bg-[#0c0c10]/40 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl animate-shimmer ${
                    viewMode === "list" ? "flex flex-col sm:flex-row h-fit sm:h-44" : "h-[380px] flex flex-col justify-between"
                  }`}
                >
                  <div className={`bg-zinc-950/80 ${viewMode === "list" ? "w-full sm:w-48 h-40 sm:h-full" : "h-40 w-full"}`} />
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-zinc-900/60 rounded-md w-3/4" />
                      <div className="h-3 bg-zinc-900/40 rounded-md w-1/2" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-zinc-900/40 rounded-md w-5/6" />
                      <div className="h-3 bg-zinc-900/30 rounded-md w-2/3" />
                    </div>
                    <div className="h-8 bg-zinc-900/60 rounded-xl w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : colleges.length === 0 ? (
            /* Empty state */
            <div className="border border-dashed border-zinc-850 rounded-2xl py-20 text-center space-y-4 max-w-lg mx-auto bg-[#0c0c10]/20">
              <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center mx-auto text-zinc-600 border border-zinc-850">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">No colleges matched your criteria</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Try adjusting your search terms, changing the sorting order, or clearing active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl border border-zinc-800 transition-all cursor-pointer"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            /* Rendered results with Cascading Spring Motion */
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
            >
              {colleges.map((college) => (
                <motion.article
                  key={college.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.35)", boxShadow: "0 10px 30px -15px rgba(59, 130, 246, 0.2)" }}
                  className={`bg-[#0c0c10]/70 border border-zinc-900 hover:bg-[#0c0c10]/90 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex group relative ${
                    viewMode === "list" ? "flex-col sm:flex-row h-fit sm:h-48" : "flex-col h-[390px] justify-between"
                  }`}
                >
                  {/* Card Image Area */}
                  <div className={`relative overflow-hidden bg-zinc-950 ${
                    viewMode === "list" ? "w-full sm:w-56 h-40 sm:h-full flex-shrink-0" : "h-40 w-full"
                  }`}>
                    {college.image ? (
                      <img
                        src={college.image}
                        alt={college.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center text-zinc-700 text-xs font-medium uppercase tracking-wider">
                        No Image Available
                      </div>
                    )}
                     
                    {/* Heart Save Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSave(college.id);
                      }}
                      className="absolute top-3.5 left-3.5 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all text-zinc-400 hover:text-red-500 cursor-pointer z-10"
                      title={savedIds.includes(college.id) ? "Remove from Saved" : "Save College"}
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-all duration-300 ${
                          savedIds.includes(college.id) ? "fill-red-500 stroke-red-500" : "stroke-current fill-none"
                        }`}
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                    <span className="absolute top-3.5 right-3.5 px-2.5 py-1 text-[8px] font-extrabold uppercase bg-black/60 backdrop-blur-md text-zinc-300 border border-white/5 rounded-lg tracking-widest select-none">
                      {college.rating >= 4.7 ? "Featured" : "Popular"}
                    </span>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-white group-hover:text-blue-450 transition-colors text-sm line-clamp-1">
                        {college.name}
                      </h3>
                      
                      {/* Rating details */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-550">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(college.rating) ? "fill-current" : "stroke-current fill-none"
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.56-.375-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-zinc-350">{college.rating.toFixed(1)}</span>
                        <span className="text-[9px] text-zinc-600">(1.2k)</span>
                      </div>
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-1.5 text-xs text-zinc-450">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-zinc-550" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="truncate font-medium">{college.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-zinc-550" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-mono text-blue-400 font-semibold">
                          ₹{college.fees.toLocaleString()} / Year
                        </span>
                      </div>
                    </div>

                    {/* View Details & Compare Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/colleges/${college.id}`}
                        className="flex-1 text-center py-2 text-xs font-semibold border border-zinc-850 hover:border-zinc-750 bg-zinc-900/20 hover:bg-zinc-850/40 rounded-xl text-zinc-300 hover:text-white transition-all block"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => toggleCompare(college.id)}
                        className={`px-3 py-2 text-xs font-semibold border rounded-xl transition-all cursor-pointer ${
                          compareIds.includes(college.id)
                            ? "bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                            : "border-zinc-850 hover:border-zinc-750 bg-zinc-900/20 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {compareIds.includes(college.id) ? "✓ Added" : "+ Compare"}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {/* PAGINATION PANEL */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-1.5 pt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2.5 border border-zinc-900 rounded-xl text-zinc-500 hover:text-zinc-200 hover:border-zinc-800 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed bg-[#0c0c10]/40"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === pageNumber
                        ? "bg-white text-black shadow-md"
                        : "border border-zinc-900 text-zinc-500 hover:text-zinc-200 hover:border-zinc-800 bg-[#0c0c10]/40"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2.5 border border-zinc-900 rounded-xl text-zinc-500 hover:text-zinc-200 hover:border-zinc-800 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed bg-[#0c0c10]/40"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </nav>
          )}

        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900/60 bg-[#060608] py-12 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full bg-blue-600" />
              </div>
              <span>Campus Orbit</span>
            </h2>
            <p className="text-xs text-zinc-550 leading-relaxed max-w-sm">
              Elevating the academic search experience through precise data and sophisticated discovery tools.
            </p>
          </div>

          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3 text-xs font-semibold text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Help Center</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-zinc-950 flex items-center justify-between text-[10px] font-medium text-zinc-650">
          <span>&copy; {new Date().getFullYear()} Campus Orbit. All rights reserved.</span>
        </div>
      </footer>

      {/* FLOATING COMPARE BAR */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 bg-[#0e0e13]/95 border border-zinc-800/80 backdrop-blur-md rounded-2xl py-3.5 px-5 flex items-center gap-6 shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-xs text-zinc-300 font-semibold">
                Comparing <span className="text-white font-bold">{compareIds.length}</span> of 3 colleges
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setCompareIds([])}
                className="text-[9px] font-extrabold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
              <Link
                href={`/compare?ids=${compareIds.join(",")}`}
                className="px-4.5 py-2 text-xs font-semibold bg-white hover:bg-zinc-200 text-black rounded-full transition-all duration-300 shadow-md block"
              >
                Compare Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
