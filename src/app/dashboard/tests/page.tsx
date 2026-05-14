"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, ClipboardList } from "lucide-react";
import ScoreBarChart from "~/components/dashboard/charts/ScoreBarChart";
import { useProgressStore } from "~/stores/progressStore";

interface StatusStyle {
  label: string;
  bg: string;
  text: string;
}

const STATUS_STYLE: Record<string, StatusStyle> = {
  pending:   { label: "Pending",   bg: "#F1F5F9",   text: "#94A3B8"  },
  completed: { label: "Completed", bg: "#F0FDF4",   text: "#10B981"  },
};

export default function TestsPage() {
  const { tests } = useProgressStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20 pt-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-[38px] font-extrabold text-[#1A202C] mb-2 flex items-center gap-3"
          >
            Assessments <ClipboardList className="w-8 h-8 text-[#305EFF]" />
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[#4A5568] text-[16px] font-medium"
          >
            {tests.filter(t => t.status !== "pending").length} / {tests.length} assignments attempted
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-[20px] px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0]"
        >
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Average Score</span>
          <span className="text-[24px] font-extrabold text-[#1A202C]">84%</span>
        </motion.div>
      </div>

      <div className="flex flex-col gap-4">
        {tests.map((test, i) => {
          const s = STATUS_STYLE[test.status] ?? STATUS_STYLE.pending!;
          const isOpen = expanded === test.id;
          const weakTopics = test.topics ? test.topics.filter(t => t.score < 60) : [];

          return (
            <motion.div key={test.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`rounded-[24px] border transition-all duration-300 overflow-hidden bg-white ${
                isOpen ? "border-[#305EFF] shadow-[0_8px_30px_rgba(48,94,255,0.1)]" : "border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md"
              }`}>
              
              {/* Card header */}
              <button onClick={() => setExpanded(isOpen ? null : test.id)}
                className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-6 transition-colors text-left gap-4 ${isOpen ? 'bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]'}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ background: s.bg, color: s.text, borderColor: `${s.text}33` }}>{s.label}</span>
                  <div className="min-w-0">
                    <p className={`text-[17px] font-extrabold transition-colors ${isOpen ? 'text-[#305EFF]' : 'text-[#1A202C]'}`}>{test.title}</p>
                    <p className="text-[12px] font-medium text-[#94A3B8]">
                      {test.topics && test.topics.length > 0 ? test.topics.map(t => t.topic).join(', ') : "General Assessment"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 sm:ml-auto">
                  {test.score !== null && test.score !== undefined && (
                    <div className="flex flex-col items-end">
                      <span className="text-[#94A3B8] font-bold text-[10px] uppercase">Score</span>
                      <span className="text-[20px] font-black" style={{ color: test.score >= 60 ? "#10B981" : "#EF4444" }}>
                        {test.score}%
                      </span>
                    </div>
                  )}
                  {weakTopics.length > 0 && (
                    <div className="bg-[#FEF2F2] p-2 rounded-full border border-[#EF444422]">
                      <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                    </div>
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#305EFF10]' : 'bg-transparent'}`}>
                    <ChevronDown className={`w-5 h-5 text-[#94A3B8] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </button>

              {/* Expanded panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-6 pb-6 border-t border-[#E2E8F0] pt-6 space-y-8">
                      {test.topics && test.topics.length > 0 ? (
                        <>
                          {/* Chart */}
                          <div className="bg-[#F8FAFC] rounded-[20px] p-6 border border-[#E2E8F0]">
                            <p className="text-[12px] font-bold text-[#305EFF] uppercase tracking-widest mb-6 flex items-center gap-2">
                              <ClipboardList className="w-4 h-4" /> Performance Breakdown
                            </p>
                            <div className="h-[250px]">
                              <ScoreBarChart data={test.topics} />
                            </div>
                          </div>

                          {/* Weak areas */}
                          {weakTopics.length > 0 && (
                            <div className="bg-[#FEF2F2] border border-[#EF444422] rounded-[20px] p-6">
                              <p className="text-[12px] font-bold text-[#EF4444] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {weakTopics.map(t => (
                                  <span key={t.topic} className="text-[12px] font-bold px-4 py-2 rounded-full bg-white text-[#EF4444] border border-[#EF444422] shadow-sm">
                                    {t.topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-[#F8FAFC] rounded-[20px] p-8 text-center border border-dashed border-[#E2E8F0]">
                          <p className="text-[14px] font-medium text-[#94A3B8]">No specific topic breakdown available for this assessment.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
