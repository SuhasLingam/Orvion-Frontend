"use client";
import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Zap, Bot, ArrowRight, BrainCircuit, AlertTriangle, Lightbulb } from "lucide-react";
import { useInsightStore } from "~/stores/insightStore";

export default function AIPage() {
  const {
    isLoading,
    lastFetchedMinutesAgo,
    weakAreas,
    strengths,
    nextActions,
    fetchInsights,
  } = useInsightStore();

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20 pt-4 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-br from-[#305EFF] to-[#1E3A8A] p-8 rounded-[32px] relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-20 -translate-y-20" />
        
        <div className="relative z-10 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-[42px] font-extrabold mb-2 flex items-center gap-4"
          >
            AI Mentor <BrainCircuit className="w-10 h-10" />
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-white/90 text-[16px] font-medium max-w-lg leading-relaxed"
          >
            Personalized intelligence analyzing your learning patterns, test scores, and interview performance to guide your next steps.
          </motion.p>
          
          <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-white/70 uppercase tracking-widest">
            <Zap className="w-4 h-4" />
            {lastFetchedMinutesAgo !== null ? `Last analysis ${lastFetchedMinutesAgo}m ago` : "No analysis yet"}
            {lastFetchedMinutesAgo !== null && lastFetchedMinutesAgo > 60 * 12 && (
              <span className="text-[#FFD700] ml-2">· Stale Data</span>
            )}
          </div>
        </div>

        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          onClick={fetchInsights} disabled={isLoading}
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#1E3A8A] text-[14px] font-extrabold rounded-full hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full md:w-auto mt-4 md:mt-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Running Analysis..." : "Refresh Insights"}
        </motion.button>
      </div>

      {/* Weak areas + Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-8 rounded-[24px] border border-[#F0ECE1] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-[#F0FDF4] flex items-center justify-center border border-[#10B98122]">
              <Lightbulb className="w-5 h-5 text-[#10B981]" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1A202C]">Your Strengths</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.map(s => (
              <span key={s} className="text-[13px] font-bold px-4 py-2 rounded-full bg-[#F1F5F9] text-[#10B981] border border-[#E2E8F0] hover:border-[#10B98144] transition-colors shadow-sm">{s}</span>
            ))}
          </div>
        </motion.div>

        {/* Weak Areas */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-8 rounded-[24px] border border-[#F0ECE1] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center border border-[#EF444422]">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1A202C]">Areas to Improve</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {weakAreas.map(w => (
              <span key={w} className="text-[13px] font-bold px-4 py-2 rounded-full bg-[#F1F5F9] text-[#EF4444] border border-[#E2E8F0] hover:border-[#EF444444] transition-colors shadow-sm">{w}</span>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Action items */}
      <div className="bg-white border border-[#E2E8F0] rounded-[32px] p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-[#305EFF] rounded-full" />
          <h3 className="text-[22px] font-extrabold text-[#1A202C]">Recommended Action Plan</h3>
        </div>
        
        <div className="flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-[#F1F5F9] border border-[#E2E8F0] rounded-[20px] animate-pulse" />
              ))
            : nextActions.map((action, idx) => (
                <motion.div 
                  key={action.id} 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}
                  className="group relative flex flex-col sm:flex-row sm:items-center gap-5 p-6 rounded-[20px] border border-[#E2E8F0] bg-white hover:border-[#305EFF] hover:shadow-[0_8px_30px_rgba(48,94,255,0.1)] transition-all cursor-pointer overflow-hidden"
                >
                  {/* Status Strip */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: action.priority === "high" ? "#EF4444" : action.priority === "medium" ? "#305EFF" : "#10B981" }} />
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#FDFBF7] border border-[#F0ECE1] shrink-0 group-hover:scale-110 group-hover:bg-[#FFFBF0] transition-transform">
                    <span className="text-[22px]">
                      {action.type === "review" ? "📚" : action.type === "practice" ? "💻" : "🚀"}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-[18px] font-extrabold text-[#1A202C] group-hover:text-[#305EFF] transition-colors">{action.title}</h4>
                      <span 
                        className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm"
                        style={{ 
                          backgroundColor: action.priority === "high" ? "#FEF2F2" : action.priority === "medium" ? "#EFF6FF" : "#F0FDF4",
                          color: action.priority === "high" ? "#EF4444" : action.priority === "medium" ? "#305EFF" : "#10B981"
                        }}
                      >
                        {action.priority} Priority
                      </span>
                    </div>
                    <p className="text-[14px] text-[#4A5568] font-medium leading-relaxed max-w-3xl">{action.reason}</p>
                  </div>
                  
                  {/* Action Arrow */}
                  <div className="mt-4 sm:mt-0 w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center group-hover:bg-[#1A202C] transition-colors shrink-0">
                    <ArrowRight className="w-5 h-5 text-[#94A3B8] group-hover:text-white transition-colors" />
                  </div>
                </motion.div>
              ))}
        </div>
      </div>

      {/* LLM note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px]">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-[#305EFF] shrink-0" />
          <p className="text-[13px] font-semibold text-[#4A5568]">
            Insights are actively generated by AI using your live course progression and mock interview transcripts.
          </p>
        </div>
        <div className="text-[11px] font-black uppercase tracking-widest text-[#94A3B8]">
          Powered by Orvion AI
        </div>
      </div>
      
    </div>
  );
}
