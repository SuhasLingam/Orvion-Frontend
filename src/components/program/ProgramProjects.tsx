"use client";

import { useState } from "react";
import { FolderGit2, Info, Target, LayoutGrid } from "lucide-react";
import type { Program } from "~/data/programs";

export default function ProgramProjects({ framework }: { framework: NonNullable<Program["projectsFramework"]> }) {
  const [activeSet, setActiveSet] = useState(0);

  if (!framework) return null;

  return (
    <section className="w-full px-4 py-20 bg-[#F8FAFC]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-[#305EFF] px-4 py-2 rounded-full font-bold text-[13px] uppercase tracking-wide mb-4">
            <FolderGit2 className="w-4 h-4" /> Project Allocation Framework
          </div>
          <h2 className="text-[36px] md:text-[46px] font-extrabold text-[#0B0F19] tracking-tight leading-tight mb-6 max-w-3xl">
            Real-World Project Execution
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#475569] max-w-[800px] leading-relaxed">
            {framework.overview}
          </p>
        </div>

        {/* Info Cards (Stages, Layout, Outcomes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2E8F0] shadow-sm">
            <h4 className="text-[18px] font-extrabold text-[#0B0F19] flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-[#305EFF]" /> Learning Stages
            </h4>
            <ul className="flex flex-col gap-3">
              {framework.stages.map((stage, i) => (
                <li key={i} className="flex flex-start gap-2 text-[14px] text-[#4B5563] font-medium leading-relaxed">
                  <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#CBD5E1]"></div>
                  {stage}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2E8F0] shadow-sm">
            <h4 className="text-[18px] font-extrabold text-[#0B0F19] flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-[#305EFF]" /> Implementation Guidelines
            </h4>
            <ul className="flex flex-col gap-3">
              {framework.guidelines.map((guide, i) => (
                <li key={i} className="flex flex-start gap-2 text-[14px] text-[#4B5563] font-medium leading-relaxed">
                  <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#CBD5E1]"></div>
                  {guide}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2E8F0] shadow-sm">
            <h4 className="text-[18px] font-extrabold text-[#0B0F19] flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[#305EFF]" /> Expected Outcomes
            </h4>
            <ul className="flex flex-col gap-3">
              {framework.learningOutcomes.map((outcome, i) => (
                <li key={i} className="flex flex-start gap-2 text-[14px] text-[#4B5563] font-medium leading-relaxed">
                  <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#cbd5e1]"></div>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Project Sets Explorer */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-[320px] bg-[#F8FAFC] flex flex-col border-b lg:border-b-0 lg:border-r border-[#E2E8F0] p-4 gap-2">
            <div className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-4 pt-2">
               Project Catalogue
            </div>
            <div className="flex flex-row overflow-x-auto lg:flex-col gap-2 custom-scrollbar pb-2 lg:pb-0">
              {framework.sets.map((set, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSet(i)}
                  className={`flex flex-col shrink-0 lg:shrink text-left px-5 py-4 rounded-xl transition-colors border ${
                    activeSet === i 
                      ? "bg-white border-[#E2E8F0] shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-[#F1F5F9]"
                  }`}
                >
                  <span className={`text-[15px] font-extrabold mb-1 ${activeSet === i ? "text-[#305EFF]" : "text-[#0B0F19]"}`}>
                    {set.setName}
                  </span>
                  <span className="text-[12px] font-bold text-[#64748B] tracking-wide uppercase line-clamp-1">
                    {set.level.split("–")[0]?.trim() ?? set.level}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Set Content */}
          {framework.sets[activeSet] && (
            <div className="flex-1 p-6 lg:p-10 relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#EEF2FF] text-[#305EFF] px-3 py-1 rounded border border-[#305EFF]/20 text-[12px] font-bold tracking-wide uppercase">
                  {framework.sets[activeSet].level}
                </div>
              </div>
              
              <h3 className="text-[28px] font-extrabold text-[#0B0F19] mb-3">
                {framework.sets[activeSet].setName}
              </h3>
              
              <p className="text-[16px] text-[#64748B] font-medium mb-10 pb-6 border-b border-[#E2E8F0]">
                {framework.sets[activeSet].description}
              </p>

              {/* Grid of 12 internal projects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {framework.sets[activeSet].projects.map((proj, pIdx) => (
                  <div key={pIdx} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl flex gap-4 items-start group hover:border-[#CBD5E1] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center font-bold text-[13px] shrink-0 font-mono">
                      {pIdx + 1}
                    </div>
                    <span className="text-[14px] text-[#1E293B] font-bold leading-snug pt-1">
                      {proj}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Conclusion */}
        <div className="max-w-[800px] mx-auto text-center px-6 py-8 mt-12 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hidden sm:block">
          <p className="text-[15px] sm:text-[16px] text-[#475569] leading-relaxed font-medium">
            {framework.conclusion}
          </p>
        </div>

      </div>
    </section>
  );
}
