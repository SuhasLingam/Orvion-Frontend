"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, RefreshCw, Clock, Sparkles } from "lucide-react";

interface Props {
  tip: string;
  lastFetchedMinutesAgo: number | null;
  isLoading: boolean;
  onRefresh: () => void;
}

function formatAge(mins: number | null) {
  if (mins === null) return "Unknown";
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

export default function LLMInsightCard({ tip, lastFetchedMinutesAgo, isLoading, onRefresh }: Props) {
  return (
    <div className="w-full rounded-2xl border border-[#30363D] bg-[#161B22] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#30363D]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#305EFF22] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#305EFF]" />
          </div>
          <span className="text-[13px] font-bold text-[#F0F6FC]">AI Insight</span>
          <span className="text-[10px] text-[#8B949E] bg-[#21262D] px-2 py-0.5 rounded-full font-medium">
            Tip of the Day
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#8B949E]" />
            <span className="text-[11px] text-[#8B949E]">
              {lastFetchedMinutesAgo !== null && lastFetchedMinutesAgo > 60 * 12
                ? <span className="text-[#E3B341]">Insights from {formatAge(lastFetchedMinutesAgo)}</span>
                : <span>{formatAge(lastFetchedMinutesAgo)}</span>
              }
            </span>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#305EFF] hover:text-blue-400 disabled:opacity-40 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 min-h-[80px] flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#E3B341] mt-0.5 shrink-0" />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 space-y-2.5"
            >
              {/* "Thinking..." skeleton */}
              <div className="flex items-center gap-2 text-[#8B949E] text-[12px] font-medium">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  AI is thinking
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: 0 }}
                >•</motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: 0.3 }}
                >•</motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: 0.6 }}
                >•</motion.span>
              </div>
              <div className="h-3 bg-[#30363D] rounded-full w-full animate-pulse" />
              <div className="h-3 bg-[#30363D] rounded-full w-4/5 animate-pulse" />
            </motion.div>
          ) : (
            <motion.p
              key="content"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[14px] text-[#F0F6FC] leading-relaxed font-medium"
            >
              {tip}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
