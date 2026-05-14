"use client";
import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mic, Sparkles, Target, Zap, MessageCircle } from "lucide-react";
import InterviewRadar from "~/components/dashboard/charts/InterviewRadar";
import { useProgressStore } from "~/stores/progressStore";

interface ResultStyle {
  bg: string;
  text: string;
}

const RESULT_STYLE: Record<string, ResultStyle> = {
  Correct:   { bg: "#F0FDF4", text: "#10B981" },
  Partial:   { bg: "#EFF6FF", text: "#305EFF" },
  Incorrect: { bg: "#FEF2F2", text: "#EF4444" },
};
const LEVEL_COLOR = { Easy: "#10B981", Medium: "#305EFF", Hard: "#EF4444" } as const;

export default function InterviewsPage() {
  const { interviews } = useProgressStore();
  const [expanded, setExpanded] = useState<string | null>(interviews[0]?.id ?? null);

  // Build combined radar data from all interviews
  const radarData = [
    { subject: "Technical",       A: interviews[0]?.technicalScore ?? 0,       B: interviews[1]?.technicalScore ?? 0 },
    { subject: "Communication",   A: interviews[0]?.communicationScore ?? 0,    B: interviews[1]?.communicationScore ?? 0 },
    { subject: "Problem Solving", A: interviews[0]?.problemSolvingScore ?? 0,   B: interviews[1]?.problemSolvingScore ?? 0 },
    { subject: "Clarity",         A: interviews[0]?.clarityScore ?? 0,          B: interviews[1]?.clarityScore ?? 0 },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20 pt-4 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-[38px] font-extrabold text-[#1A202C] mb-2 flex items-center gap-3"
          >
            Interview Suite <Mic className="w-8 h-8 text-[#305EFF]" />
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[#4A5568] text-[16px] font-medium"
          >
            Review your AI mock interviews to perfect your delivery.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-[20px] px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0]"
        >
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Total Sessions</span>
          <span className="text-[24px] font-extrabold text-[#1A202C]">{interviews.length} Completed</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Radar Chart */}
        <div className="xl:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] sticky top-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-[#305EFF]" />
              <h3 className="text-[16px] font-extrabold text-[#1A202C]">Skill Radar</h3>
            </div>
            
            <div className="bg-[#F1F5F9] rounded-[20px] p-4 border border-[#E2E8F0] mb-4">
              <InterviewRadar data={radarData} labelA={interviews[0]?.title ?? ""} labelB={interviews[1]?.title ?? ""} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[13px] font-bold text-[#1A202C]">
                <div className="w-3 h-3 rounded-full bg-[#305EFF]" /> {interviews[0]?.title ?? "Recent"}
              </div>
              <div className="flex items-center gap-3 text-[13px] font-bold text-[#94A3B8]">
                <div className="w-3 h-3 rounded-full bg-[#E2E8F0]" /> {interviews[1]?.title ?? "Previous"}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Interview Logs */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          {interviews.map((interview, i) => {
            const isOpen = expanded === interview.id;
            return (
              <motion.div 
                key={interview.id} 
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                className={`bg-white rounded-[24px] border transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-[#305EFF] shadow-[0_8px_30px_rgba(48,94,255,0.1)]" : "border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md"
                }`}
              >
                {/* Header Button */}
                <button 
                  onClick={() => setExpanded(isOpen ? null : interview.id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-[#F8FAFC] transition-colors text-left gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#305EFF] text-white' : 'bg-[#F1F5F9] text-[#305EFF]'}`}>
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-[18px] font-extrabold mb-1 transition-colors ${isOpen ? 'text-[#305EFF]' : 'text-[#1A202C]'}`}>
                        {interview.title}
                      </h3>
                      <p className="text-[13px] font-semibold text-[#94A3B8]">{interview.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 shrink-0 sm:ml-auto">
                    <div className="hidden md:flex items-center gap-4 text-[13px]">
                      <div className="flex flex-col items-end">
                        <span className="text-[#94A3B8] font-semibold text-[10px] uppercase">Tech</span>
                        <span className="font-extrabold text-[#1A202C]">{interview.technicalScore}/100</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[#94A3B8] font-semibold text-[10px] uppercase">Comm</span>
                        <span className="font-extrabold text-[#1A202C]">{interview.communicationScore}/100</span>
                      </div>
                    </div>
                    <div className="h-10 w-px bg-[#E2E8F0] hidden sm:block" />
                    <div className="flex flex-col items-center">
                      <span className="text-[#94A3B8] font-semibold text-[10px] uppercase mb-0.5">Overall</span>
                      <span className="text-[20px] font-black text-[#305EFF]">{interview.overallScore}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#F1F5F9]' : 'bg-transparent'}`}>
                      <ChevronDown className={`w-5 h-5 text-[#94A3B8] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: "auto", opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }} 
                      transition={{ duration: 0.3, ease: "easeInOut" }} 
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-[#E2E8F0]">
                        
                        {/* Overall Feedback */}
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-5 mb-6 relative">
                          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-[#EFF6FF] rounded-full p-2 border border-[#305EFF22]">
                            <Sparkles className="w-5 h-5 text-[#305EFF]" />
                          </div>
                          <h4 className="text-[12px] font-bold text-[#305EFF] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4" /> Mentor Feedback
                          </h4>
                          <p className="text-[14px] text-[#1A202C] font-medium leading-relaxed">
                            {interview.feedback}
                          </p>
                        </div>

                        {/* Question Breakdown */}
                        <h4 className="text-[12px] font-bold text-[#A8A39D] uppercase tracking-widest mb-4 flex items-center gap-1.5">
                          <Zap className="w-4 h-4" /> Question Breakdown
                        </h4>
                        
                        <div className="space-y-4">
                          {interview.questions.map((q, qIdx) => {
                            const rs = RESULT_STYLE[q.result] ?? RESULT_STYLE.Partial!;
                            return (
                              <div key={q.id} className="bg-white border border-[#E2E8F0] rounded-[16px] p-5 hover:border-[#CBD5E1] transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-[10px] font-black bg-[#F1F5F9] text-[#94A3B8] px-2 py-0.5 rounded border border-[#E2E8F0]">Q{qIdx + 1}</span>
                                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: LEVEL_COLOR[q.level] ?? "#94A3B8" }}>{q.level}</span>
                                    </div>
                                    <p className="text-[15px] font-extrabold text-[#1A202C] leading-snug">{q.question}</p>
                                  </div>
                                  <div className="shrink-0">
                                    <span 
                                      className="text-[12px] font-bold px-3 py-1.5 rounded-full border border-opacity-50"
                                      style={{ backgroundColor: rs.bg, color: rs.text, borderColor: rs.text }}
                                    >
                                      {q.result}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="bg-[#F1F5F9] rounded-[12px] p-3 border border-[#E2E8F0] relative">
                                  <div className="w-1 h-full absolute left-0 top-0 bg-[#305EFF] rounded-l-[12px]" />
                                  <p className="text-[13px] text-[#4A5568] font-medium pl-2">
                                    <span className="font-bold text-[#1A202C] mr-1">AI Note:</span>
                                    {q.llmComment}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
