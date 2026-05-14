"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  suffix?: string;
  delay?: number;
}

export default function StatCard({ label, value, icon: Icon, iconColor = "#305EFF", iconBg = "#EFF6FF", suffix, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col gap-3 px-6 py-5 rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#305EFF44] hover:shadow-md transition-all group"
    >
      <div
        className="w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
        style={{ background: iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      <div>
        <div className="text-[28px] font-black text-[#1A202C] leading-none mb-1">
          {value}{suffix && <span className="text-[14px] font-bold text-[#94A3B8] ml-1">{suffix}</span>}
        </div>
        <div className="text-[12px] text-[#64748B] font-bold uppercase tracking-widest">{label}</div>
      </div>
    </motion.div>
  );
}
