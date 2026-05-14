"use client";

import { motion } from "framer-motion";
import { Flame, Clock, AlertTriangle } from "lucide-react";

interface Props {
  streak: number;
  lastActiveMinutesAgo: number;
  weeklyGoal: { target: number; completed: number; label: string; resetsIn: string };
}

function formatLastActive(mins: number) {
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

export default function StreakBanner({ streak, lastActiveMinutesAgo, weeklyGoal }: Props) {
  const isAtRisk = lastActiveMinutesAgo >= 20 * 60; // 20 hours

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Streak card */}
      <div
        className="flex-1 flex items-center gap-4 px-6 py-5 rounded-[24px] border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-md"
        style={{ borderColor: isAtRisk ? "#EF4444" : "#E2E8F0" }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFF7ED]"
        >
          <Flame className="w-8 h-8 text-[#F97316]" />
        </motion.div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-black text-[#1A202C] leading-none">{streak}</span>
            <span className="text-[14px] font-bold text-[#64748B]">day streak</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {isAtRisk ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
            )}
            <span className={`text-[12px] font-bold ${isAtRisk ? "text-[#EF4444]" : "text-[#94A3B8]"}`}>
              {isAtRisk ? "Streak at risk! " : "Last active "}
              {formatLastActive(lastActiveMinutesAgo)}
            </span>
          </div>
        </div>
      </div>

      {/* Weekly goal card */}
      <div
        className="flex-1 flex flex-col justify-center px-6 py-5 rounded-[24px] border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-md border-[#E2E8F0]"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-black text-[#305EFF] uppercase tracking-widest">Weekly Goal</span>
          <span className="text-[11px] font-bold text-[#94A3B8]">Resets {weeklyGoal.resetsIn}</span>
        </div>
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-[24px] font-black text-[#1A202C]">{weeklyGoal.completed}</span>
          <span className="text-[14px] font-bold text-[#64748B]">/ {weeklyGoal.target} {weeklyGoal.label}</span>
        </div>
        <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#305EFF] to-[#1E3A8A]"
            initial={{ width: 0 }}
            animate={{ width: `${(weeklyGoal.completed / weeklyGoal.target) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
