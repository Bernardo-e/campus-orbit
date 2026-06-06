"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
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

interface Question {
  id: string;
  title: string;
  tags: string[];
  author: { name: string; targetExam?: string | null };
  createdAt: string;
  _count: { answers: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatFees(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1)  return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TAG_COLORS: Record<string, string> = {
  "JEE Main":    "bg-blue-600/15 text-blue-400 border-blue-500/20",
  "JEE Advanced":"bg-indigo-600/15 text-indigo-400 border-indigo-500/20",
  "TNEA":        "bg-emerald-600/15 text-emerald-400 border-emerald-500/20",
  "VITEEE":      "bg-amber-600/15 text-amber-400 border-amber-500/20",
  "SRMJEEE":     "bg-rose-600/15 text-rose-400 border-rose-500/20",
  "SAEEE":       "bg-purple-600/15 text-purple-400 border-purple-500/20",
};
const tagColor = (t: string) => TAG_COLORS[t] || "bg-zinc-800/60 text-zinc-400 border-zinc-700/40";

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => setDisplay(Math.round(v)));
  }, [spring]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const userId = user?.id || null;
  const router = useRouter();

  // College search state
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"rating" | "fees" | "">("rating");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [programTypes, setProgramTypes] = useState<string[]>([]);
  const [rankingRange, setRankingRange] = useState(100);
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Discussions
  const [discussions, setDiscussions] = useState<Question[]>([]);

  // Featured colleges (top 6 by rating for carousel)
  const [featured, setFeatured] = useState<College[]>([]);

  // Section refs for scroll reveal
  const statsRef = useRef<HTMLElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  // ── Keyboard shortcut ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        document.getElementById("explore-section")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── localStorage compare ─────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("campus_orbit_compare_ids");
      if (stored) setCompareIds(JSON.parse(stored));
    }
  }, []);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) { alert("You can compare up to 3 colleges."); return prev; }
        updated = [...prev, id];
      }
      localStorage.setItem("campus_orbit_compare_ids", JSON.stringify(updated));
      return updated;
    });
  };

  // ── Saved colleges ───────────────────────────────────────────────────────────
  const fetchSavedColleges = useCallback(async (uid: string) => {
    try {
      const res = await fetch("/api/colleges/save", { headers: { "x-user-id": uid } });
      if (res.ok) {
        const data = await res.json();
        setSavedIds(data.colleges.map((c: College) => c.id));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (userId) fetchSavedColleges(userId);
    else setSavedIds([]);
  }, [userId, fetchSavedColleges]);

  const toggleSave = async (collegeId: string) => {
    if (!userId) { router.push("/login"); return; }
    const isSaved = savedIds.includes(collegeId);
    try {
      const res = await fetch("/api/colleges/save", {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ collegeId }),
      });
      if (res.ok) setSavedIds((prev) => isSaved ? prev.filter((id) => id !== collegeId) : [...prev, collegeId]);
    } catch {}
  };

  // ── College search fetch ─────────────────────────────────────────────────────
  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ search, page: page.toString(), limit: "6" });
      if (sort) { params.append("sort", sort); params.append("order", order); }
      if (locationFilter && locationFilter !== "All Locations") params.append("location", locationFilter);
      if (programTypes.length > 0) params.append("programTypes", programTypes.join(","));
      if (rankingRange) params.append("rankingRange", rankingRange.toString());
      if (minFees) params.append("minFees", minFees);
      if (maxFees) params.append("maxFees", maxFees);
      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch college list");
      const data: ApiResponse = await res.json();
      setColleges(data.colleges);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, [search, page, sort, order, locationFilter, programTypes, rankingRange, minFees, maxFees]);

  useEffect(() => {
    const timer = setTimeout(fetchColleges, 300);
    return () => clearTimeout(timer);
  }, [fetchColleges]);

  // ── Featured colleges (for carousel) ────────────────────────────────────────
  useEffect(() => {
    fetch("/api/colleges?sort=rating&order=desc&limit=6&page=1")
      .then((r) => r.json())
      .then((d) => setFeatured(d.colleges ?? []))
      .catch(() => {});
  }, []);

  // ── Discussions ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/discussions")
      .then((r) => r.json())
      .then((d) => setDiscussions((d.questions ?? []).slice(0, 4)))
      .catch(() => {});
  }, []);

  // ── Sort/filter handlers ─────────────────────────────────────────────────────
  const handleSortChange = (newSort: "rating" | "fees") => {
    if (sort === newSort) setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else { setSort(newSort); setOrder(newSort === "rating" ? "desc" : "asc"); }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch(""); setSort("rating"); setOrder("desc"); setPage(1);
    setLocationFilter("All Locations"); setProgramTypes([]);
    setRankingRange(500); setMinFees(""); setMaxFees("");
  };

  const handleProgramTypeChange = (type: string) => {
    setProgramTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
    setPage(1);
  };

  // ── Animation variants ───────────────────────────────────────────────────────
  const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } } };
  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const cardItem = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } } };

  // ── Stats data ───────────────────────────────────────────────────────────────
  const stats = [
    { label: "Universities Listed", value: 6, suffix: "+", icon: "🏛️", color: "from-blue-500/20 to-blue-600/5" },
    { label: "Active Students",     value: 12000, suffix: "+", icon: "🎓", color: "from-emerald-500/20 to-emerald-600/5" },
    { label: "Community Q&As",      value: 8, suffix: "+", icon: "💬", color: "from-purple-500/20 to-purple-600/5" },
    { label: "Courses Indexed",     value: 30, suffix: "+", icon: "📚", color: "from-amber-500/20 to-amber-600/5" },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col relative selection:bg-blue-600/30 selection:text-blue-200 overflow-x-hidden">
      <div className="bg-grid-glow" />
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-20 pt-32 overflow-hidden">
        {/* Ambient orbs */}
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />
        <div className="hero-orb-3" />

        {/* Noise overlay */}
        <div className="absolute inset-0 noise-overlay pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full gap-8">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="float-badge"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/8 text-blue-400 text-[11px] font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(59,130,246,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Tamil Nadu&apos;s Premier College Discovery Platform
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 70 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.0] text-white"
          >
            <span className="gradient-text">Find Your</span>
            <br />
            <span className="relative inline-block gradient-text-blue">
              Academic Orbit
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-400 to-transparent origin-left"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed font-medium"
          >
            The intelligent college discovery platform built for JEE, TNEA, VITEEE & SAEEE aspirants.
            Search, compare, predict, and connect — all in one place.
          </motion.p>

          {/* Hero search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, type: "spring" }}
            className="w-full max-w-2xl group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 via-indigo-500/20 to-purple-600/20 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500 border-glow" />
            <div className="relative flex items-center bg-[#0d0d12]/95 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl focus-within:border-blue-500/60 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.12)] transition-all duration-500">
              <div className="pl-5 text-zinc-500 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search universities, programs, or locations..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-transparent border-0 px-4 py-4.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-0"
              />
              <div className="pr-4 flex items-center gap-3">
                <kbd className="hidden sm:block px-2.5 py-1 text-[10px] font-mono bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 shadow-sm select-none">
                  ⌘ K
                </kbd>
                <a
                  href="#explore-section"
                  onClick={(e) => { e.preventDefault(); document.getElementById("explore-section")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer flex-shrink-0 hidden sm:block"
                >
                  Search
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {["JEE Main", "TNEA", "VITEEE", "SRMJEEE", "SAEEE", "JEE Advanced"].map((tag) => (
              <button
                key={tag}
                onClick={() => { setSearch(tag); document.getElementById("explore-section")?.scrollIntoView({ behavior: "smooth" }); }}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${tagColor(tag)} hover:scale-105 hover:shadow-md`}
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center gap-4 flex-wrap justify-center mt-2"
          >
            <motion.a
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              href="#explore-section"
              onClick={(e) => { e.preventDefault(); document.getElementById("explore-section")?.scrollIntoView({ behavior: "smooth" }); }}
              className="flex items-center gap-2 px-7 py-3 text-sm font-bold bg-white text-black hover:bg-zinc-100 rounded-2xl transition-all shadow-lg shadow-white/10 cursor-pointer"
            >
              Explore Colleges
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </motion.a>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link href="/predictor" className="flex items-center gap-2 px-7 py-3 text-sm font-bold border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 rounded-2xl transition-all cursor-pointer">
                Rank Predictor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600"
        >
          <span className="text-[9px] font-bold tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — LIVE STATISTICS
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative z-10 py-20 px-6">
        <div className="section-divider mb-20" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden" animate={statsInView ? "show" : "hidden"} variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label} variants={fadeUp}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`stat-card rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 bg-gradient-to-br ${s.color} relative overflow-hidden group cursor-default`}
              >
                <div className="card-shine absolute inset-0 rounded-2xl" />
                <div className="text-2xl">{s.icon}</div>
                <div>
                  <div className="text-3xl font-black text-white">
                    {statsInView && <AnimatedCounter target={s.value} suffix={s.suffix} />}
                  </div>
                  <div className="text-[11px] font-semibold text-zinc-500 mt-1 tracking-wide">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — FEATURED COLLEGES CAROUSEL
      ══════════════════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="relative z-10 py-20 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
              className="flex items-end justify-between"
            >
              <div className="space-y-2">
                <span className="px-3 py-1 text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full tracking-widest inline-block">
                  Featured Institutions
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Top-Ranked Colleges</h2>
                <p className="text-xs text-zinc-500 font-medium">Discover India's finest academic institutions</p>
              </div>
              <a
                href="#explore-section"
                onClick={(e) => { e.preventDefault(); document.getElementById("explore-section")?.scrollIntoView({ behavior: "smooth" }); }}
                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                View All
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="carousel-fade-left absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" />
            <div className="carousel-fade-right absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" />
            <div className="overflow-hidden">
              <div className="carousel-track">
                {[...featured, ...featured].map((college, i) => (
                  <Link
                    key={`${college.id}-${i}`}
                    href={`/colleges/${college.id}`}
                    className="flex-shrink-0 w-72 bg-[#0c0c10]/80 border border-zinc-900 rounded-2xl overflow-hidden group hover:border-blue-500/30 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] transition-all duration-500"
                  >
                    <div className="h-40 bg-zinc-950 relative overflow-hidden">
                      {college.image ? (
                        <img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center">
                          <span className="text-4xl">🏛️</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-500/90 text-black rounded-md tracking-wider">
                          ★ {college.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">{college.name}</h3>
                      <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {college.location}
                      </p>
                      <p className="text-xs font-mono font-bold text-blue-400">{formatFees(college.fees)}<span className="text-zinc-600 font-sans font-normal">/yr</span></p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — PREDICTOR CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="section-divider mb-20" />
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, type: "spring" }}
            className="relative rounded-3xl overflow-hidden border border-zinc-800/60 bg-gradient-to-br from-[#0d0d18] via-[#080810] to-[#080810]"
          >
            {/* Background glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(59,130,246,0.12),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_100%,rgba(139,92,246,0.08),transparent_60%)]" />

            <div className="relative z-10 px-8 md:px-16 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="px-3 py-1 text-[9px] font-extrabold uppercase bg-blue-600/15 text-blue-400 border border-blue-500/25 rounded-full tracking-widest inline-block">
                    AI-Powered
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-snug">
                    Predict Your College<br />
                    <span className="gradient-text-blue">Before Results Day</span>
                  </h2>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                  Enter your JEE / TNEA / VITEEE rank and instantly see which colleges are within your reach.
                  Data-driven predictions based on historical cutoffs.
                </p>
                <div className="flex flex-wrap gap-3">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link href="/predictor" className="flex items-center gap-2 px-6 py-3 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-900/30 cursor-pointer">
                      Try Predictor Free
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Predictor visual mock */}
              <div className="hidden md:block">
                <div className="bg-[#0a0a10]/80 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-2xl">
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span>Rank Prediction</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  {[
                    { exam: "JEE Main", rank: "1,200", college: "NIT Trichy CSE", prob: 92, color: "bg-blue-500" },
                    { exam: "JEE Main", rank: "1,200", college: "NIT Warangal CSE", prob: 75, color: "bg-indigo-500" },
                    { exam: "JEE Main", rank: "1,200", college: "NIT Surathkal", prob: 58, color: "bg-purple-500" },
                  ].map((item) => (
                    <div key={item.college} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-200">{item.college}</span>
                        <span className="text-[10px] font-mono font-bold text-zinc-400">{item.prob}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} whileInView={{ width: `${item.prob}%` }}
                          viewport={{ once: true }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="text-[9px] text-zinc-600 pt-1">Based on JEE Main Rank: 1,200 | OBC | Tamil Nadu</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — TRENDING DISCUSSIONS
      ══════════════════════════════════════════════════════════════════════ */}
      {discussions.length > 0 && (
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
              className="flex items-end justify-between mb-12"
            >
              <div className="space-y-2">
                <span className="px-3 py-1 text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full tracking-widest inline-block">
                  Community Forum
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Trending Discussions</h2>
                <p className="text-xs text-zinc-500 font-medium">Ask questions, share experiences, get answers</p>
              </div>
              <Link href="/discussions" className="hidden md:flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors">
                All Threads
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}
              className="grid md:grid-cols-2 gap-4"
            >
              {discussions.map((q) => (
                <motion.div key={q.id} variants={fadeUp}>
                  <Link
                    href={`/discussions/${q.id}`}
                    className="block bg-[#0c0c10]/60 border border-zinc-900 rounded-2xl p-5 hover:border-emerald-500/25 hover:shadow-[0_8px_30px_rgba(16,185,129,0.06)] transition-all duration-300 group space-y-3"
                  >
                    <div className="flex flex-wrap gap-2">
                      {q.tags.slice(0, 2).map((t) => (
                        <span key={t} className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${tagColor(t)}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                      {q.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium pt-1 border-t border-zinc-900/60">
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                          {q.author.name[0]}
                        </span>
                        {q.author.name}
                        {q.author.targetExam && <span className="text-zinc-600">· {q.author.targetExam}</span>}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.92 1.786c-.082.095-.08.24.004.331.085.09.223.091.306.01a5.052 5.052 0 001.222-1.157c.307-.373.745-.558 1.196-.444.976.246 2 .38 3.072.38z" />
                        </svg>
                        <span className="font-mono font-bold text-zinc-400">{q._count.answers}</span>
                        {timeAgo(q.createdAt)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex justify-center"
            >
              <Link href="/discussions" className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 rounded-xl transition-all">
                Browse All Discussions
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — HOW IT WORKS (Feature grid)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="section-divider mb-20" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
            className="text-center mb-14 space-y-3"
          >
            <span className="px-3 py-1 text-[9px] font-extrabold uppercase bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 rounded-full tracking-widest inline-block">
              Platform Features
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Everything You Need to Decide</h2>
            <p className="text-sm text-zinc-500 max-w-xl mx-auto">From discovery to decision — Campus Orbit guides your entire college selection journey.</p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[
              { icon: "🔍", title: "Smart Discovery", desc: "Filter colleges by exam, location, fees, and program type with real-time results.", color: "from-blue-600/20 to-blue-600/0", border: "border-blue-600/20 hover:border-blue-500/40", href: "#explore-section" },
              { icon: "📊", title: "Side-by-Side Compare", desc: "Select up to 3 colleges and compare them on ratings, fees, courses, and more.", color: "from-indigo-600/20 to-indigo-600/0", border: "border-indigo-600/20 hover:border-indigo-500/40", href: "/compare" },
              { icon: "🎯", title: "Rank Predictor", desc: "Get instant college predictions based on your JEE / TNEA / VITEEE rank.", color: "from-purple-600/20 to-purple-600/0", border: "border-purple-600/20 hover:border-purple-500/40", href: "/predictor" },
              { icon: "💾", title: "Save & Shortlist", desc: "Bookmark your favourite colleges and revisit your shortlist anytime.", color: "from-rose-600/20 to-rose-600/0", border: "border-rose-600/20 hover:border-rose-500/40", href: "/profile" },
              { icon: "💬", title: "Peer Q&A Forum", desc: "Ask seniors, get cutoff data, and discuss campus life with real students.", color: "from-emerald-600/20 to-emerald-600/0", border: "border-emerald-600/20 hover:border-emerald-500/40", href: "/discussions" },
              { icon: "⚡", title: "Real-Time Data", desc: "All college data, cutoffs, and reviews are kept updated for accuracy.", color: "from-amber-600/20 to-amber-600/0", border: "border-amber-600/20 hover:border-amber-500/40", href: "#explore-section" },
            ].map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <a
                  href={f.href}
                  onClick={(e) => {
                    if (f.href.startsWith("#")) {
                      e.preventDefault();
                      document.getElementById(f.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`block h-full bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6 space-y-3 transition-all duration-300 group hover:shadow-xl cursor-pointer`}
                >
                  <div className="text-3xl">{f.icon}</div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">{f.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — EXPLORE (Search + Filters + Cards — original content)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="explore-section" className="relative z-10 py-20 px-6 scroll-mt-20">
        <div className="section-divider mb-20" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
            className="mb-12 space-y-2"
          >
            <span className="px-3 py-1 text-[9px] font-extrabold uppercase bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 rounded-full tracking-widest inline-block">
              College Explorer
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Browse All Colleges</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* ── Sidebar ── */}
            <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
              <div className="bg-[#0c0c10]/70 border border-zinc-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Filters</h3>
                  <button onClick={handleResetFilters} className="text-[9px] font-extrabold text-zinc-500 hover:text-blue-400 transition-colors uppercase tracking-widest cursor-pointer">
                    Reset
                  </button>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Location</label>
                  <div className="relative">
                    <select value={locationFilter} onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}
                      className="w-full bg-[#111116] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 appearance-none cursor-pointer">
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

                {/* Program Type */}
                <div className="space-y-3">
                  <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Program Type</label>
                  <div className="space-y-3">
                    {["Undergraduate", "Postgraduate", "PhD / Research"].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={programTypes.includes(type)} onChange={() => handleProgramTypeChange(type)}
                          className="rounded border-zinc-800 bg-[#111116] text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer" />
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors select-none">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ranking Range */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Ranking Range</label>
                    <span className="text-[10px] font-mono text-zinc-400">Top {rankingRange}</span>
                  </div>
                  <input type="range" min="10" max="500" step="10" value={rankingRange}
                    onChange={(e) => { setRankingRange(parseInt(e.target.value, 10)); setPage(1); }}
                    className="w-full accent-blue-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer" />
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-600">
                    <span>Top 10</span><span>Top 500</span>
                  </div>
                </div>

                {/* Fees */}
                <div className="space-y-2">
                  <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block">Annual Fees (INR)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={minFees} onChange={(e) => { setMinFees(e.target.value); setPage(1); }}
                      className="w-full bg-[#111116] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700" />
                    <span className="text-zinc-600 text-xs">-</span>
                    <input type="number" placeholder="Max" value={maxFees} onChange={(e) => { setMaxFees(e.target.value); setPage(1); }}
                      className="w-full bg-[#111116] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700" />
                  </div>
                </div>
              </div>

              {/* Scholarship alert */}
              <div className="bg-[#0b132b]/20 border border-blue-900/20 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
                <span className="text-[9px] font-extrabold tracking-widest text-blue-400 uppercase block mb-1">Scholarship Alert</span>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">Apply for the &apos;Orbit Global Grant&apos; before June 15.</p>
              </div>
            </aside>

            {/* ── Results panel ── */}
            <section className="lg:col-span-3 space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-zinc-500 font-medium">
                  Showing <span className="text-zinc-300">{loading ? "..." : total}</span> universities
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-[#0c0c10]/60 border border-zinc-900/60 rounded-xl p-1">
                    {(["rating", "fees"] as const).map((type) => (
                      <button key={type} onClick={() => handleSortChange(type)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                          sort === type ? "bg-zinc-800/80 text-white" : "text-zinc-500 hover:text-zinc-300"
                        }`}>
                        {type} {sort === type && (order === "desc" ? "↓" : "↑")}
                      </button>
                    ))}
                  </div>

                  {/* View Switchers */}
                  <div className="flex items-center bg-[#0c0c10]/60 border border-zinc-900/60 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === "grid" ? "bg-zinc-800 text-blue-400" : "text-zinc-500 hover:text-zinc-300"
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
                        viewMode === "list" ? "bg-zinc-800 text-blue-400" : "text-zinc-500 hover:text-zinc-300"
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

              {/* LOADING STATE */}
              {loading ? (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`bg-[#0c0c10]/40 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl ${
                        viewMode === "list" ? "flex flex-col sm:flex-row h-fit sm:h-44" : "h-[380px] flex flex-col justify-between"
                      }`}
                    >
                      <div className={`bg-zinc-950/80 ${viewMode === "list" ? "w-full sm:w-48 h-40 sm:h-full" : "h-40 w-full"}`} />
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-zinc-900/60 rounded-md w-3/4 animate-pulse" />
                          <div className="h-3 bg-zinc-900/40 rounded-md w-1/2 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-zinc-900/40 rounded-md w-5/6 animate-pulse" />
                          <div className="h-3 bg-zinc-900/30 rounded-md w-2/3 animate-pulse" />
                        </div>
                        <div className="h-8 bg-zinc-900/60 rounded-xl w-full mt-2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : colleges.length === 0 ? (
                /* Empty state */
                <div className="border border-dashed border-zinc-800 rounded-2xl py-20 text-center space-y-4 max-w-lg mx-auto bg-[#0c0c10]/20">
                  <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center mx-auto text-zinc-650 border border-zinc-800">
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
                    className="px-4 py-2.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl border border-zinc-800 transition-all cursor-pointer"
                  >
                    Clear Search & Filters
                  </button>
                </div>
              ) : (
                /* Rendered results */
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {colleges.map((college) => (
                    <motion.article
                      key={college.id}
                      variants={cardItem}
                      whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.35)", boxShadow: "0 10px 30px -15px rgba(59, 130, 246, 0.2)" }}
                      className={`bg-[#0c0c10]/70 border border-zinc-900 hover:bg-[#0c0c10]/90 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex group relative ${
                        viewMode === "list" ? "flex-col sm:flex-row h-fit sm:h-48" : "flex-col h-[390px] justify-between"
                      }`}
                    >
                      {/* Card Image Area */}
                      <div className={`relative overflow-hidden bg-zinc-950/80 ${
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
                          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center text-zinc-600 text-xs font-medium uppercase tracking-wider">
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
                            <div className="flex items-center text-amber-500">
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
                            <span className="text-[10px] font-mono font-bold text-zinc-400">{college.rating.toFixed(1)}</span>
                            <span className="text-[9px] text-zinc-500">(1.2k)</span>
                          </div>
                        </div>

                        {/* Metadata details */}
                        <div className="space-y-1.5 text-xs text-zinc-400">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="truncate font-medium">{college.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-mono text-blue-400 font-semibold">
                              {formatFees(college.fees)} / Year
                            </span>
                          </div>
                        </div>

                        {/* View Details & Compare Buttons */}
                        <div className="flex gap-2">
                          <Link
                            href={`/colleges/${college.id}`}
                            className="flex-1 text-center py-2 text-xs font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-800/40 rounded-xl text-zinc-300 hover:text-white transition-all block"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => toggleCompare(college.id)}
                            className={`px-3 py-2 text-xs font-semibold border rounded-xl transition-all cursor-pointer ${
                              compareIds.includes(college.id)
                                ? "bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 text-zinc-400 hover:text-white"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-1.5 pt-8">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-2.5 border border-zinc-900 rounded-xl text-zinc-500 hover:text-zinc-200 hover:border-zinc-800 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed bg-[#0c0c10]/40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button key={index + 1} onClick={() => setPage(index + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        page === index + 1 ? "bg-white text-black shadow-md" : "border border-zinc-900 text-zinc-500 hover:text-zinc-200 bg-[#0c0c10]/40"
                      }`}>
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-2.5 border border-zinc-900 rounded-xl text-zinc-500 hover:text-zinc-200 hover:border-zinc-800 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed bg-[#0c0c10]/40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </nav>
              )}
            </section>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-zinc-900/60 bg-[#060608] py-16 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center p-0.5">
                  <div className="w-full h-full rounded-full bg-blue-600" />
                </div>
                <span className="text-base font-bold text-white">Campus Orbit</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                Elevating the academic search experience through precise data and sophisticated discovery tools.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All systems operational
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Product</h4>
              <div className="space-y-3 text-xs font-medium">
                <a href="#explore-section" onClick={(e) => { e.preventDefault(); document.getElementById("explore-section")?.scrollIntoView({ behavior: "smooth" }); }} className="block text-zinc-500 hover:text-white transition-colors">College Explorer</a>
                <Link href="/predictor" className="block text-zinc-500 hover:text-white transition-colors">Rank Predictor</Link>
                <Link href="/compare" className="block text-zinc-500 hover:text-white transition-colors">Compare Colleges</Link>
                <Link href="/discussions" className="block text-zinc-500 hover:text-white transition-colors">Discussions Forum</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">Company</h4>
              <div className="space-y-3 text-xs font-medium">
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">About</a>
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Help Center</a>
              </div>
            </div>
          </div>

          <div className="section-divider" />
          <div className="mt-8 flex items-center justify-between flex-wrap gap-4 text-[10px] font-medium text-zinc-600">
            <span>&copy; {new Date().getFullYear()} Campus Orbit. All rights reserved.</span>
            <span>Built with ❤️ for Tamil Nadu aspirants</span>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════
          FLOATING COMPARE BAR
      ══════════════════════════════════════════════════════════════════════ */}
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
              <button onClick={() => setCompareIds([])} className="text-[9px] font-extrabold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest px-2 py-1 cursor-pointer">
                Clear
              </button>
              <Link href={`/compare?ids=${compareIds.join(",")}`} className="px-4 py-2 text-xs font-semibold bg-white hover:bg-zinc-200 text-black rounded-full transition-all shadow-md block">
                Compare Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
