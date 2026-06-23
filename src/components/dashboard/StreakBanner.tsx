"use client";

import { motion } from "framer-motion";
import { Flame, Clock, AlertTriangle } from "lucide-react";

interface Props {
  streak: number;
  lastActiveMinutesAgo: number;
  weeklyGoal: {
    target: number;
    completed: number;
    label: string;
    resetsIn: string;
  };
  streakBroke?: boolean;
}

function formatLastActive(mins: number) {
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

export default function StreakBanner({
  streak,
  lastActiveMinutesAgo,
  weeklyGoal,
  streakBroke = false,
}: Props) {
  const isAtRisk = lastActiveMinutesAgo >= 20 * 60;

  return (
    <div className="flex w-full flex-col gap-4">
      {streakBroke && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-4 rounded-[20px] border border-[#EF444430] bg-[#FEF2F2] px-6 py-4 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EF444415]">
              <Flame className="h-5 w-5 text-[#EF4444]" />
            </div>
            <div>
              <p className="text-[14px] font-extrabold text-[#1A202C]">
                Your streak broke — but you can come back!
              </p>
              <p className="text-[12px] font-medium text-[#EF4444]">
                Complete 3 lessons today to restart your streak and earn a
                Comeback badge.
              </p>
            </div>
          </div>
          <button className="shrink-0 rounded-full bg-[#EF4444] px-4 py-2 text-[12px] font-extrabold text-white transition-colors hover:bg-[#DC2626]">
            Accept Challenge
          </button>
        </motion.div>
      )}

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        {/* Streak card */}
        <div
          className="flex flex-1 items-center gap-4 rounded-[24px] border bg-white px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-md"
          style={{ borderColor: isAtRisk ? "#EF4444" : "#E2E8F0" }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF7ED]"
          >
            <Flame className="h-8 w-8 text-[#F97316]" />
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] leading-none font-black text-[#1A202C]">
                {streak}
              </span>
              <span className="text-[14px] font-bold text-[#64748B]">
                day streak
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              {isAtRisk ? (
                <AlertTriangle className="h-3.5 w-3.5 text-[#EF4444]" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
              )}
              <span
                className={`text-[12px] font-bold ${isAtRisk ? "text-[#EF4444]" : "text-[#94A3B8]"}`}
              >
                {isAtRisk ? "Streak at risk! " : "Last active "}
                {formatLastActive(lastActiveMinutesAgo)}
              </span>
            </div>
          </div>
        </div>

        {/* Weekly goal card */}
        <div className="flex flex-1 flex-col justify-center rounded-[24px] border border-[#E2E8F0] bg-white px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-black tracking-widest text-[#305EFF] uppercase">
              Weekly Goal
            </span>
            <span className="text-[11px] font-bold text-[#94A3B8]">
              Resets {weeklyGoal.resetsIn}
            </span>
          </div>
          <div className="mb-3 flex items-baseline gap-1.5">
            <span className="text-[24px] font-black text-[#1A202C]">
              {weeklyGoal.completed}
            </span>
            <span className="text-[14px] font-bold text-[#64748B]">
              / {weeklyGoal.target} {weeklyGoal.label}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#E2E8F0] bg-[#F1F5F9]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#305EFF] to-[#1E3A8A]"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((weeklyGoal.completed / weeklyGoal.target) * 100, 100)}%`,
              }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
