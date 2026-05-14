"use client";

import { motion } from "framer-motion";

const LEVEL_LABELS = ["", "Beginner", "Intermediate", "Advanced", "Expert"];

interface Props {
  xp: number;
  xpToNextLevel: number;
  level: number;
}

export default function XPBar({ xp, xpToNextLevel, level }: Props) {
  const pct = Math.min((xp / xpToNextLevel) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-[#305EFF] uppercase tracking-widest">
            Level {level}
          </span>
          <span className="text-[11px] text-[#CBD5E1]">·</span>
          <span className="text-[12px] font-bold text-[#64748B]">
            {LEVEL_LABELS[level]}
          </span>
        </div>
        <span className="text-[13px] font-black text-[#10B981]">
          {xp.toLocaleString()} <span className="text-[#94A3B8] font-bold">/ {xpToNextLevel.toLocaleString()} XP</span>
        </span>
      </div>

      {/* Track */}
      <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #305EFF 0%, #1E3A8A 100%)",
            boxShadow: "0 2px 8px rgba(48,94,255,0.2)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">⚡ {xp.toLocaleString()} XP earned</span>
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{(xpToNextLevel - xp).toLocaleString()} XP to Level {level + 1}</span>
      </div>
    </div>
  );
}
