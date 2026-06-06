"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface Author {
  id: string;
  name: string;
  targetExam?: string | null;
}

interface Question {
  id: string;
  title: string;
  body: string;
  tags: string[];
  author: Author;
  createdAt: string;
  _count: { answers: number };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const AVATAR_COLORS = [
  "bg-blue-600/30 text-blue-400 border-blue-500/20",
  "bg-emerald-600/30 text-emerald-400 border-emerald-500/20",
  "bg-amber-600/30 text-amber-400 border-amber-500/20",
  "bg-purple-600/30 text-purple-400 border-purple-500/20",
  "bg-rose-600/30 text-rose-400 border-rose-500/20",
  "bg-cyan-600/30 text-cyan-400 border-cyan-500/20",
];

function avatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function DiscussionsPage() {
  const { user } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // Ask modal state
  const [showAsk, setShowAsk] = useState(false);
  const [askTitle, setAskTitle] = useState("");
  const [askBody, setAskBody] = useState("");
  const [askTags, setAskTags] = useState("");
  const [askSubmitting, setAskSubmitting] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discussions");
      const data = await res.json();
      setQuestions(data.questions ?? []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const allTags = ["All", ...Array.from(new Set(questions.flatMap((q) => q.tags)))];

  const filtered = questions.filter((q) => {
    const matchTag = selectedTag === "All" || q.tags.includes(selectedTag);
    const q_ = searchQuery.toLowerCase();
    const matchSearch = !q_ ||
      q.title.toLowerCase().includes(q_) ||
      q.body.toLowerCase().includes(q_) ||
      q.author.name.toLowerCase().includes(q_);
    return matchTag && matchSearch;
  });

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setAskError(null);
    if (!askTitle.trim() || !askBody.trim()) {
      setAskError("Title and description are required.");
      return;
    }
    setAskSubmitting(true);
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: askTitle, questionBody: askBody, tags: askTags }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post.");
      setQuestions((prev) => [data.question, ...prev]);
      setShowAsk(false);
      setAskTitle(""); setAskBody(""); setAskTags("");
    } catch (err: unknown) {
      setAskError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setAskSubmitting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col relative overflow-hidden">
      <div className="bg-grid-glow" />
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-6 py-12 flex-1 flex flex-col gap-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="border-b border-zinc-900/60 pb-6 flex items-end justify-between gap-4 flex-wrap"
        >
          <div className="space-y-2">
            <span className="px-3 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-lg tracking-widest inline-block select-none shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              Community Discussions
            </span>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Peer &amp; Mentor Trajectory Forum
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Ask questions, share cutoffs, counsel options, and campus life experiences.
            </p>
          </div>
          {user ? (
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowAsk(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/30 cursor-pointer flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Ask a Question
            </motion.button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 rounded-xl transition-all flex-shrink-0"
            >
              Sign in to participate
            </Link>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full md:w-80">
            <input
              type="text" placeholder="Search questions..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0c10]/60 border border-zinc-900 rounded-xl py-2.5 px-4 pl-10 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-all"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {allTags.map((tag) => (
              <button
                key={tag} onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider select-none border transition-all cursor-pointer whitespace-nowrap ${
                  selectedTag === tag
                    ? "bg-white text-black border-white"
                    : "bg-[#0c0c10]/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Feed */}
        {loading ? (
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0c0c10]/40 border border-zinc-900 rounded-2xl p-6 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800" />
                  <div className="h-3 bg-zinc-800 rounded w-32" />
                </div>
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-900 rounded w-full" />
                <div className="h-3 bg-zinc-900 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="border border-dashed border-zinc-800 rounded-2xl py-20 text-center space-y-4 max-w-lg mx-auto bg-[#0c0c10]/20 w-full"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center mx-auto text-zinc-600 border border-zinc-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.92 1.786c-.082.095-.08.24.004.331.085.09.223.091.306.01a5.052 5.052 0 001.222-1.157c.307-.373.745-.558 1.196-.444.976.246 2 .38 3.072.38z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-200">
                  {questions.length === 0 ? "No questions yet" : "No conversations found"}
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  {questions.length === 0
                    ? "Be the first to ask a question and start the conversation!"
                    : `No threads match "${searchQuery}" under "${selectedTag}".`}
                </p>
                {user && questions.length === 0 && (
                  <button
                    onClick={() => setShowAsk(true)}
                    className="mx-auto mt-2 flex items-center gap-2 px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer"
                  >
                    Ask the first question
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
                initial="hidden" animate="show"
                className="flex flex-col gap-5"
              >
                {filtered.map((q) => (
                  <motion.article
                    key={q.id} variants={cardVariants} layout
                    whileHover={{ borderColor: "rgba(16,185,129,0.25)", boxShadow: "0 10px 30px -15px rgba(16,185,129,0.08)" }}
                    className="bg-[#0c0c10]/70 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl transition-all duration-300 group cursor-pointer"
                  >
                    <Link href={`/discussions/${q.id}`} className="flex flex-col gap-4">
                      {/* Author row */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs flex-shrink-0 ${avatarColor(q.author.name)}`}>
                          {q.author.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-xs">{q.author.name}</span>
                            {q.author.targetExam && (
                              <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md tracking-wider">
                                {q.author.targetExam}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-medium">{timeAgo(q.createdAt)}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors leading-snug">
                          {q.title}
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-medium line-clamp-2">{q.body}</p>
                      </div>

                      {/* Tags */}
                      {q.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {q.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-zinc-900/50 border border-zinc-800/60 text-zinc-400 text-[9px] font-semibold tracking-wide">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meta row */}
                      <div className="h-px bg-zinc-900/60" />
                      <div className="flex items-center gap-5 text-xs text-zinc-500 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.92 1.786c-.082.095-.08.24.004.331.085.09.223.091.306.01a5.052 5.052 0 001.222-1.157c.307-.373.745-.558 1.196-.444.976.246 2 .38 3.072.38z" />
                          </svg>
                          <span className="font-mono font-bold">{q._count.answers}</span>
                          <span>{q._count.answers === 1 ? "answer" : "answers"}</span>
                        </div>
                        <span className="text-emerald-500 text-[10px] font-bold tracking-wide uppercase ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          View thread →
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* ASK QUESTION MODAL */}
      <AnimatePresence>
        {showAsk && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAsk(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="w-full max-w-xl bg-[#0d0d12] border border-zinc-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-5"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-base font-black text-white tracking-tight">Ask a Question</h2>
                  <p className="text-[11px] text-zinc-500">Share your query with the community</p>
                </div>
                <button
                  onClick={() => setShowAsk(false)}
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAsk} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Question Title *</label>
                  <input
                    type="text" required maxLength={200}
                    value={askTitle} onChange={(e) => setAskTitle(e.target.value)}
                    placeholder="e.g. What are the cutoffs for NIT Trichy CSE 2025?"
                    className="w-full bg-[#111116] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-all"
                  />
                </div>

                {/* Body */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Description *</label>
                  <textarea
                    required rows={5} maxLength={2000}
                    value={askBody} onChange={(e) => setAskBody(e.target.value)}
                    placeholder="Provide more context about your question..."
                    className="w-full bg-[#111116] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-all resize-none"
                  />
                  <div className="text-right text-[10px] text-zinc-600 font-mono">{askBody.length}/2000</div>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase">Tags <span className="text-zinc-600">(comma-separated)</span></label>
                  <input
                    type="text"
                    value={askTags} onChange={(e) => setAskTags(e.target.value)}
                    placeholder="e.g. JEE Main, NIT Trichy, Admissions"
                    className="w-full bg-[#111116] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-all"
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {askError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="bg-red-950/10 border border-red-900/20 rounded-xl p-3 text-xs text-red-400 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {askError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button" onClick={() => setShowAsk(false)}
                    className="flex-1 py-2.5 text-xs font-semibold border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="submit" disabled={askSubmitting}
                    className="flex-1 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {askSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Posting...
                      </>
                    ) : "Post Question"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#060608] py-12 mt-auto relative z-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full bg-blue-600" />
              </div>
              Campus Orbit
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Elevating the academic search experience through precise data and sophisticated discovery tools.
            </p>
          </div>
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3 text-xs font-semibold text-zinc-500">
            <span className="hover:text-white transition-colors cursor-pointer">About</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
