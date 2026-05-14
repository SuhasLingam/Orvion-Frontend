"use client";
import { motion } from "framer-motion";
import type { Badge } from "~/stores/userStore";

interface Props { badges: Badge[] }

export default function BadgeGrid({ badges }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {badges.map((badge, i) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}
          key={badge.id}
          className={`flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-[20px] border transition-all ${
            badge.isEarned
              ? "bg-[#EFF6FF] border-[#305EFF] shadow-[0_4px_14px_rgba(48,94,255,0.1)] hover:-translate-y-1"
              : "bg-white border-[#E2E8F0] opacity-60 grayscale"
          }`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[28px] ${badge.isEarned ? 'bg-[#DBEAFE]' : 'bg-[#F1F5F9]'}`}>
            {badge.icon}
          </div>
          <div className="text-center">
            <p className={`text-[12px] font-extrabold leading-tight mb-1 ${badge.isEarned ? "text-[#1A202C]" : "text-[#94A3B8]"}`}>
              {badge.title}
            </p>
            {badge.isEarned && badge.earnedAt && (
              <p className="text-[10px] font-bold text-[#305EFF] uppercase tracking-widest">{badge.earnedAt}</p>
            )}
            {!badge.isEarned && (
              <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest bg-[#F1F5F9] px-2 py-0.5 rounded-full border border-[#E2E8F0]">Locked</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
