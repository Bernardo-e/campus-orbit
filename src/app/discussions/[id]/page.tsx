"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface Author {
  id: string;
  name: string;
  targetExam?: string | null;
}

interface Answer {
  id: string;
  body: string;
  author: Author;
  createdAt: string;
}

interface Question {
  id: string;
  title: string;
  body: string;
  tags: string[];
  author: Author;
  createdAt: string;
  answers: Answer[];
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

export default function QuestionDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [answerBody, setAnswerBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discussions/${id}`);
      if (res.status === 404) { setNotFound(true); return; }
      const data = await res.json();
      setQuestion(data.question);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchQuestion(); }, [fetchQuestion]);

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnswerError(null);
    if (!answerBody.trim()) { setAnswerError("Answer cannot be empty."); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/discussions/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post answer.");
      setQuestion((prev) =>
        prev ? { ...prev, answers: [...prev.answers, data.answer] } : prev
      );
      setAnswerBody("");
    } catch (err: unknown) {
      setAnswerError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col">
        <div className="bg-grid-glow" />
        <Navbar />
        <main className="max-w-3xl mx-auto w-full px-6 py-12 flex-1 space-y-6 relative z-10">
          <div className="animate-pulse space-y-4">
            <div className="h-3 w-24 bg-zinc-800 rounded" />
            <div className="h-8 w-3/4 bg-zinc-800 rounded" />
            <div className="h-4 w-full bg-zinc-900 rounded" />
            <div className="h-4 w-5/6 bg-zinc-900 rounded" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#0c0c10]/40 border border-zinc-900 rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800" />
                <div className="h-3 bg-zinc-800 rounded w-28" />
              </div>
              <div className="h-3 bg-zinc-900 rounded w-full" />
              <div className="h-3 bg-zinc-900 rounded w-4/5" />
            </div>
          ))}
        </main>
      </div>
    );
  }

  if (notFound || !question) {
    return (
      <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col">
        <div className="bg-grid-glow" />
        <Navbar />
        <main className="max-w-3xl mx-auto w-full px-6 py-12 flex-1 flex flex-col items-center justify-center gap-5 relative z-10 text-center">
          <div className="w-14 h-14 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-white">Question not found</h2>
          <p className="text-xs text-zinc-500">This question may have been deleted or doesn&apos;t exist.</p>
          <button onClick={() => router.push("/discussions")} className="px-5 py-2 text-xs font-bold bg-white text-black hover:bg-zinc-200 rounded-xl transition-all cursor-pointer">
            Back to Discussions
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans flex flex-col relative overflow-hidden">
      <div className="bg-grid-glow" />
      <Navbar />

      <main className="max-w-3xl mx-auto w-full px-6 py-12 flex-1 flex flex-col gap-8 relative z-10">

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/discussions" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-300 transition-colors group">
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Discussions
          </Link>
        </motion.div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="bg-[#0c0c10]/70 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl"
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColor(question.author.name)}`}>
              {question.author.name[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">{question.author.name}</span>
                {question.author.targetExam && (
                  <span className="px-2 py-0.5 text-[8px] font-extrabold uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md tracking-wider">
                    {question.author.targetExam}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500">{timeAgo(question.createdAt)}</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-md tracking-widest inline-block">
              Question
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white leading-snug">{question.title}</h1>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{question.body}</p>
          </div>

          {/* Tags */}
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {question.tags.map((t) => (
                <span key={t} className="px-2.5 py-0.5 rounded bg-zinc-900/50 border border-zinc-850/60 text-zinc-400 text-[10px] font-semibold tracking-wide">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Answers section header */}
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
          </h2>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>

        {/* Answers list */}
        {question.answers.length > 0 && (
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
            initial="hidden" animate="show"
            className="flex flex-col gap-4"
          >
            {question.answers.map((ans, idx) => (
              <motion.div
                key={ans.id}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } } }}
                className="bg-[#0c0c10]/60 border border-zinc-900 rounded-2xl p-5 space-y-3 relative"
              >
                {/* Answer number badge */}
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-[9px] font-extrabold text-emerald-400">{idx + 1}</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${avatarColor(ans.author.name)}`}>
                    {ans.author.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{ans.author.name}</span>
                      {ans.author.targetExam && (
                        <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md tracking-wider">
                          {ans.author.targetExam}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500">{timeAgo(ans.createdAt)}</span>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{ans.body}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Answer form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#0c0c10]/60 border border-zinc-900 rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-sm font-black text-white">
            {user ? "Post Your Answer" : "Sign in to Answer"}
          </h3>

          {user ? (
            <form onSubmit={handleAnswer} className="space-y-3">
              <textarea
                rows={5} maxLength={3000}
                value={answerBody} onChange={(e) => setAnswerBody(e.target.value)}
                placeholder="Write a detailed, helpful answer..."
                className="w-full bg-[#111116] border border-zinc-850 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/10 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600 font-mono">{answerBody.length}/3000</span>

                <AnimatePresence>
                  {answerError && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-xs text-red-400"
                    >
                      {answerError}
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={submitting || !answerBody.trim()}
                  className="px-6 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : "Post Answer"}
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-zinc-500">You need to be signed in to post an answer.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-white text-black hover:bg-zinc-200 rounded-xl transition-all"
              >
                Sign in to Answer
              </Link>
            </div>
          )}
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#060608] py-10 mt-auto relative z-10 text-center text-[10px] font-medium text-zinc-650">
        <span>&copy; {new Date().getFullYear()} Campus Orbit. All rights reserved.</span>
      </footer>
    </div>
  );
}
