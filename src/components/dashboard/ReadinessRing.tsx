"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BADGE_COLORS: Record<string, string> = {
  "Beginner":       "#8B949E",
  "Intermediate":   "#305EFF",
  "Job Ready":      "#3FB950",
  "Top Performer":  "#E3B341",
};

interface Props {
  score: number;         // 0–100
  badge: string;
  size?: number;
}

export default function ReadinessRing({ score, badge, size = 160 }: Props) {
  const [animated, setAnimated] = useState(false);
  const offset = CIRCUMFERENCE * (1 - (animated ? score : 0) / 100);
  const color = BADGE_COLORS[badge] ?? "#305EFF";

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background track */}
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={RADIUS}
            fill="none" stroke="#21262D" strokeWidth="10"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="text-[32px] font-black text-[#F0F6FC] leading-none"
          >
            {score}
          </motion.span>
          <span className="text-[11px] text-[#8B949E] font-medium mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Badge label */}
      <div
        className="px-3 py-1 rounded-full text-[12px] font-bold tracking-wide"
        style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
      >
        {badge}
      </div>
    </div>
  );
}
