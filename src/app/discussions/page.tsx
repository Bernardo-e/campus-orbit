"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

interface Thread {
  id: string;
  author: string;
  avatarColor: string;
  role: string;
  time: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  replies: number;
  liked?: boolean;
}

const mockThreads: Thread[] = [
  {
    id: "1",
    author: "Rahul Sharma",
    avatarColor: "bg-blue-600/30 text-blue-400 border-blue-500/20",
    role: "JEE Main Aspirant",
    time: "2 hours ago",
    title: "JEE Main cutoff predictions for NIT Trichy CSE?",
    content: "My rank in JEE Main is 1200. Do I stand a chance of securing Computer Science and Engineering at NIT Trichy under Home State quota? Or should I consider other options like NIT Surathkal?",
    tags: ["JEE Main", "NIT Trichy", "Admissions"],
    likes: 24,
    replies: 12,
  },
  {
    id: "2",
    author: "Ananya Patel",
    avatarColor: "bg-emerald-600/30 text-emerald-400 border-emerald-500/20",
    role: "IIT Madras Sophomore",
    time: "5 hours ago",
    title: "Life at IIT Madras - campus environment & research facilities",
    content: "For anyone curious about selecting IIT Madras this year: campus life is incredibly active. The research park is second to none, and hostels are getting upgraded. Ask me anything about courses and campus life!",
    tags: ["IIT Madras", "Campus Life", "Q&A"],
    likes: 56,
    replies: 28,
  },
  {
    id: "3",
    author: "Karthik Raja",
    avatarColor: "bg-amber-600/30 text-amber-400 border-amber-500/20",
    role: "TNEA Candidate",
    time: "1 day ago",
    title: "Anna University CEG vs MIT campus choice list recommendation",
    content: "Confused between CSE at CEG campus and IT at MIT campus for the upcoming TNEA counselling choice list. My cutoff score is 196.5. Which one has a better placement track record for software roles?",
    tags: ["TNEA", "Anna University", "Counseling"],
    likes: 18,
    replies: 7,
  },
  {
    id: "4",
    author: "Siddharth Rao",
    avatarColor: "bg-purple-600/30 text-purple-400 border-purple-500/20",
    role: "VIT Vellore Alumnus",
    time: "2 days ago",
    title: "Vellore Institute of Technology - Placement Trends (2025)",
    content: "Sharing some insights on placements at VIT Vellore. Despite the market conditions, software product roles saw good turnout. Average package hovered around 9 LPA for CSE. Make sure to maintain a good CGPA (>8.5) to clear initial filters.",
    tags: ["VIT Vellore", "Placements", "Insights"],
    likes: 42,
    replies: 19,
  },
];

export default function DiscussionsPage() {
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allTags = ["All", ...Array.from(new Set(mockThreads.flatMap((t) => t.tags)))];

  const handleLike = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const liked = !t.liked;
          return {
            ...t,
            liked,
            likes: liked ? t.likes + 1 : t.likes - 1,
          };
        }
        return t;
      })
    );
  };

  const filteredThreads = threads.filter((t) => {
    const matchesTag = selectedTag === "All" || t.tags.includes(selectedTag);
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 15 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <div className="bg-grid-glow" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full px-6 py-12 flex-1 flex flex-col gap-8 relative z-10">
        {/* Title area with reveal animation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-zinc-900/60 pb-6 space-y-2"
        >
          <span className="px-3 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-lg tracking-widest inline-block select-none shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            Community Discussions
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Peer & Mentor Trajectory Forum
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Connect with college candidates, alumni, and mentors to share cutoffs, counsel options, and campus life experiences.
          </p>
        </motion.div>

        {/* Filters and Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          {/* SEARCH BAR */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0c10]/60 border border-zinc-900 rounded-xl py-2.5 px-4 pl-10 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-zinc-800 transition-all"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* TAG FILTERS */}
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider select-none border transition-all cursor-pointer ${
                  selectedTag === tag
                    ? "bg-white text-black border-white"
                    : "bg-[#0c0c10]/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-850"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FEED / LISTING */}
        <AnimatePresence mode="popLayout">
          {filteredThreads.length === 0 ? (
            /* EMPTY SEARCH STATE */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border border-dashed border-zinc-850 rounded-2xl py-20 text-center space-y-4 max-w-lg mx-auto bg-[#0c0c10]/20 w-full"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center mx-auto text-zinc-600 border border-zinc-850">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">No conversations found</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                We couldn't find any threads matching "{searchQuery}" under "{selectedTag}". Try adjusting your keywords.
              </p>
            </motion.div>
          ) : (
            /* THREADS LIST */
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6"
            >
              {filteredThreads.map((thread) => (
                <motion.article
                  key={thread.id}
                  variants={cardVariants}
                  layout
                  whileHover={{ borderColor: "rgba(16, 185, 129, 0.25)", boxShadow: "0 10px 30px -15px rgba(16, 185, 129, 0.08)" }}
                  className="bg-[#0c0c10]/70 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl transition-all duration-300 relative group"
                >
                  {/* Author Meta Row */}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${thread.avatarColor}`}>
                      {thread.author[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{thread.author}</span>
                        <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md tracking-wider">
                          {thread.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">{thread.time}</span>
                    </div>
                  </div>

                  {/* Thread Content */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-450 transition-colors">
                      {thread.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                      {thread.content}
                    </p>
                  </div>

                  {/* Tag List */}
                  <div className="flex flex-wrap gap-2">
                    {thread.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-zinc-900/50 border border-zinc-850/60 text-zinc-400 text-[9px] font-semibold tracking-wide"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-zinc-900/60" />

                  {/* Action Bar */}
                  <div className="flex items-center gap-6">
                    {/* Upvote/Like Action */}
                    <button
                      onClick={() => handleLike(thread.id)}
                      className={`flex items-center gap-2 text-xs font-semibold select-none transition-colors cursor-pointer group/btn ${
                        thread.liked ? "text-emerald-400" : "text-zinc-550 hover:text-zinc-350"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${thread.liked ? "fill-emerald-400 stroke-none" : "stroke-current fill-none group-hover/btn:-translate-y-0.5"}`}
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.896 0 1.7-.33 2.318-.874L10.5 8.25v.75m0 0v8.25a3 3 0 106 0V10.5M10.5 9V3.75A1.875 1.875 0 008.625 1.875h-.75c-.536 0-1.05.214-1.428.595L3.623 5.385a3.748 3.748 0 00-1.123 2.657v1.833M20.25 10.5h-1.5m1.5 0a1.875 1.875 0 011.875 1.875v3.75a1.875 1.875 0 01-1.875 1.875h-1.5a1.875 1.875 0 01-1.875-1.875v-3.75A1.875 1.875 0 0120.25 10.5z" />
                      </svg>
                      <span className="font-mono text-xs font-bold">{thread.likes}</span>
                    </button>

                    {/* Replies count */}
                    <div className="flex items-center gap-2 text-zinc-550 font-semibold select-none text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.92 1.786c-.082.095-.08.24.004.331.085.09.223.091.306.01a5.052 5.052 0 001.222-1.157c.307-.373.745-.558 1.196-.444.976.246 2 .38 3.072.38z" />
                      </svg>
                      <span className="font-mono text-xs font-bold">{thread.replies}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#060608] py-12 mt-auto relative z-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full bg-blue-600" />
              </div>
              <span>Campus Orbit</span>
            </span>
            <p className="text-xs text-zinc-555 leading-relaxed max-w-sm">
              Elevating the academic search experience through precise data and sophisticated discovery tools.
            </p>
          </div>
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3 text-xs font-semibold text-zinc-555">
            <span className="hover:text-white transition-colors cursor-pointer">About</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
