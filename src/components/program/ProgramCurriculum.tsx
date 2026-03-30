"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CalendarDays, BookOpen, AlertCircle } from "lucide-react";
import type { Month, Week } from "~/data/programs";

export default function ProgramCurriculum({ curriculum }: { curriculum: Month[] }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!curriculum || curriculum.length === 0) return null;

  return (
    <section id="curriculum" className="w-full px-4 py-20 bg-white border-t border-[#F1F5F9]">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-[#305EFF] px-4 py-2 rounded-full font-bold text-[13px] uppercase tracking-wide mb-4">
            <BookOpen className="w-4 h-4" /> Curriculum
          </div>
          <h2 className="text-[36px] md:text-[46px] font-extrabold text-[#0B0F19] tracking-tight leading-tight mb-4">
            Master the Curriculum
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            A carefully structured linear syllabus designed line-by-line by industry experts, ensuring progressive mastery from ground zero to production-level readiness.
          </p>
        </div>

        {/* Tab System for Months */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 border-b border-[#E2E8F0] pb-2 sm:mb-8 justify-center">
            {curriculum.map((month, idx) => (
              <button
                key={month.month}
                onClick={() => setActiveTab(idx)}
                className={`flex flex-col items-center sm:block px-4 py-3 rounded-t-xl font-bold transition-all border-b-2 bg-transparent text-[14px] sm:text-[16px] ${
                  activeTab === idx 
                    ? "border-[#305EFF] text-[#305EFF] bg-[#F8FAFC]" 
                    : "border-transparent text-[#64748B] hover:text-[#0B0F19] hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="flex items-center gap-2 text-[13px] uppercase tracking-wider mb-1 opacity-70">
                  <CalendarDays className="w-4 h-4 hidden sm:block"/> Month {month.month}
                </div>
                {month.title}
              </button>
            ))}
          </div>

          {/* Active Month Content */}
          {curriculum[activeTab] && (
            <div className="mt-6 sm:mt-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 sm:p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[24px] font-extrabold text-[#0B0F19]">
                  Month {curriculum[activeTab].month}: <span className="text-[#305EFF]">{curriculum[activeTab].title}</span>
                </h3>
                {curriculum[activeTab].assessment && (
                  <div className="hidden sm:flex items-center gap-2 bg-[#FEF3C7] text-[#B45309] px-4 py-1.5 rounded-full text-[13px] font-bold">
                    <AlertCircle className="w-4 h-4" /> {curriculum[activeTab].assessment}
                  </div>
                )}
              </div>

              {/* Assessment Label for Mobile */}
              {curriculum[activeTab].assessment && (
                <div className="flex sm:hidden items-center gap-2 bg-[#FEF3C7] text-[#B45309] px-4 py-1.5 rounded-full text-[13px] font-bold w-fit mb-6">
                  <AlertCircle className="w-4 h-4" /> {curriculum[activeTab].assessment}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {curriculum[activeTab].weeks.map((week, wIdx) => (
                  <WeekAccordion key={week.week} week={week} defaultOpen={wIdx === 0} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

function WeekAccordion({ week, defaultOpen = false }: { week: Week, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden transition-all duration-300 shadow-sm border-l-4 border-l-transparent hover:border-l-[#305EFF]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 bg-white text-left focus:outline-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-[#64748B] font-bold text-[14px] uppercase tracking-wider shrink-0 w-[80px]">Week {week.week}</span>
          <span className="text-[#0B0F19] font-extrabold text-[16px] md:text-[18px]">{week.title}</span>
        </div>
        <div className={`shrink-0 w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-[6.5rem] pb-6 pt-0">
              <ul className="flex flex-col gap-3">
                {week.topics.map((topic: string, i: number) => (
                  <li key={i} className="flex flex-start gap-3 items-start">
                    <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#305EFF]"></div>
                    <span className="text-[15px] text-[#4B5563] font-medium leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
