"use client";
import { motion } from "framer-motion";
import { Trophy, Flame, ShieldCheck, Zap } from "lucide-react";
import XPLineChart from "~/components/dashboard/charts/XPLineChart";
import HeatmapGrid from "~/components/dashboard/charts/HeatmapGrid";
import BadgeGrid from "~/components/dashboard/BadgeGrid";
import { useUserStore } from "~/stores/userStore";

export default function ProfilePage() {
  const { name, initials, program, level, levelLabel, readinessScore, readinessBadge, xp, streak, badges, xpHistory, activityHeatmap, joinedAt } = useUserStore();

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20 pt-4 space-y-8">

      {/* Profile header */}
      <motion.div 
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center md:items-start gap-8 px-8 py-10 rounded-[32px] border border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#F1F5F9] to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#305EFF] to-[#1E3A8A] flex items-center justify-center shrink-0 shadow-lg border-4 border-white z-10 relative">
          <span className="text-[40px] font-extrabold text-white">{initials}</span>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
            <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <h2 className="text-3xl md:text-[38px] font-extrabold text-[#1A202C] leading-tight">{name}</h2>
          <p className="text-[15px] text-[#4A5568] font-medium mt-1">{program} · <span className="text-[#94A3B8]">Joined {joinedAt}</span></p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <Trophy className="w-4 h-4 text-[#305EFF]" />
              <span className="text-[13px] font-bold text-[#1A202C]">Level {level} <span className="text-[#94A3B8] font-medium">({levelLabel})</span></span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span className="text-[13px] font-bold text-[#10B981]">{readinessBadge}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <Flame className="w-4 h-4 text-[#EF4444]" />
              <span className="text-[13px] font-bold text-[#1A202C]">{streak}-Day Streak</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <Zap className="w-4 h-4 text-[#305EFF]" />
              <span className="text-[13px] font-bold text-[#1A202C]">{xp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center justify-center z-10 mt-6 md:mt-0">
          <div className="relative w-32 h-32 flex items-center justify-center bg-[#F8FAFC] rounded-full border-[6px] border-[#E2E8F0] shadow-inner">
            <div className="absolute inset-0 rounded-full border-[6px] border-[#305EFF] opacity-20" />
            <motion.svg 
              className="absolute inset-0 w-full h-full transform -rotate-90"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            >
              <circle cx="64" cy="64" r="58" fill="none" stroke="#305EFF" strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - readinessScore / 100)} />
            </motion.svg>
            <div className="text-center">
              <span className="text-[28px] font-black text-[#1A202C] leading-none">{readinessScore}</span>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block mt-1">Readiness</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* XP Chart + Badge grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* XP History */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-8 rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-[#305EFF] rounded-full" />
            <h3 className="text-[18px] font-extrabold text-[#1A202C]">XP Progression</h3>
          </div>
          <div className="h-[250px]">
            <XPLineChart data={xpHistory} />
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-8 rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-[#305EFF] rounded-full" />
              <h3 className="text-[18px] font-extrabold text-[#1A202C]">Achievements</h3>
            </div>
            <span className="text-[13px] font-bold text-[#305EFF] bg-[#EFF6FF] px-3 py-1 rounded-full">
              {badges.filter(b => b.isEarned).length} / {badges.length} Unlocked
            </span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <BadgeGrid badges={badges} />
          </div>
        </motion.div>
      </div>

      {/* Activity heatmap */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-8 rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-x-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-6 bg-[#305EFF] rounded-full" />
          <h3 className="text-[18px] font-extrabold text-[#1A202C]">Learning Consistency</h3>
        </div>
        <div className="min-w-[600px]">
          <HeatmapGrid data={activityHeatmap} />
        </div>
      </motion.div>

    </div>
  );
}
