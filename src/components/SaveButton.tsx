"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SaveButtonProps {
  collegeId: string;
}

export default function SaveButton({ collegeId }: SaveButtonProps) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!userId) {
        setIsSaved(false);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/colleges/save", {
          headers: { "x-user-id": userId },
        });
        if (res.ok) {
          const data = await res.json();
          const savedIds = data.colleges.map((c: any) => c.id);
          setIsSaved(savedIds.includes(collegeId));
        }
      } catch (err) {
        console.error("Error checking college save status:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSaveStatus();
  }, [userId, collegeId]);

  const handleToggleSave = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    setLoading(true);

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
        setIsSaved(!isSaved);
      }
    } catch (err) {
      console.error("Error toggling college save:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleToggleSave}
      disabled={loading}
      className={`px-4 py-2 text-xs font-semibold border rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
        isSaved
          ? "bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
          : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 text-zinc-300 hover:text-white"
      } disabled:opacity-50`}
    >
      <motion.svg
        animate={{ scale: isSaved ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 0.3 }}
        className={`w-3.5 h-3.5 ${isSaved ? "fill-red-500 stroke-red-500" : "stroke-current fill-none"}`}
        viewBox="0 0 24 24"
        strokeWidth="2.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </motion.svg>
      {isSaved ? "Saved" : "Save Institution"}
    </motion.button>
  );
}
