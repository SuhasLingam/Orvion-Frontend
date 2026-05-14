"use client";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, ChevronRight, Code2, FolderKanban, TerminalSquare } from "lucide-react";
import Confetti from "~/components/dashboard/Confetti";
import { useProgressStore } from "~/stores/progressStore";

interface ProjectStyle {
  bg: string;
  text: string;
  border: string;
}

const STATUS_STYLE: Record<string, ProjectStyle> = {
  locked:      { bg: "#F1F5F9", text: "#94A3B8", border: "#E2E8F0" },
  in_progress: { bg: "#EFF6FF", text: "#305EFF", border: "#305EFF" },
  completed:   { bg: "#F0FDF4", text: "#10B981", border: "#10B981" },
};

const STATUS_LABEL: Record<string, string> = {
  locked:      "Locked",
  in_progress: "In Progress",
  completed:   "Completed",
};

export default function ProjectsPage() {
  const { projects } = useProgressStore();
  const [confettiFor] = useState<string | null>(null);

  function handleComplete(_id: string) {
    alert("Project submission and automated review engine coming soon!");
  }

  const completedCount = projects.filter(p => p.status === "completed").length;
  const progressPct = projects.length > 0 ? Math.round((completedCount / projects.length) * 100) : 0;

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20 pt-4">
      <Confetti active={confettiFor !== null} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-[38px] font-extrabold text-[#1A202C] mb-2 flex items-center gap-3"
          >
            Project Studio <FolderKanban className="w-8 h-8 text-[#305EFF]" />
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[#7A7571] text-[16px] font-medium"
          >
            Build real-world applications to solidify your knowledge and portfolio.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-[20px] px-6 py-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0] w-full md:w-auto"
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Overall Progress</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ delay: 0.5, duration: 1 }}
                  className="h-full bg-gradient-to-r from-[#305EFF] to-[#254EDB] rounded-full"
                />
              </div>
              <span className="text-[16px] font-extrabold text-[#1A202C]">{completedCount}/{projects.length}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, i) => {
          const s = STATUS_STYLE[project.status] ?? STATUS_STYLE.locked!;
          const isLocked = project.status === "locked";
          const isInProgress = project.status === "in_progress";
          const isCompleted = project.status === "completed";

          return (
            <motion.div 
              key={project.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-[24px] bg-white border overflow-hidden transition-all duration-300 group ${
                isLocked 
                  ? "border-[#E2E8F0] shadow-sm" 
                  : isInProgress
                    ? "border-[#305EFF] shadow-[0_8px_30px_rgba(48,94,255,0.15)] hover:-translate-y-1"
                    : "border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {/* Locked Overlay */}
              {isLocked && (
                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-3 border border-[#F0ECE1]">
                    <Lock className="w-5 h-5 text-[#A8A39D]" />
                  </div>
                  <p className="text-[14px] font-bold text-[#7A7571]">Unlock by completing previous projects</p>
                </div>
              )}

              {/* Card Top Accent Line */}
              <div className="h-1.5 w-full" style={{ backgroundColor: s.border }} />

              <div className="p-6 md:p-8 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                      style={{ backgroundColor: s.bg, color: s.text, borderColor: `${s.border}40` }}
                    >
                      {STATUS_LABEL[project.status] ?? project.status}
                    </span>
                    <span className="text-[11px] font-bold text-[#94A3B8] bg-[#F1F5F9] px-3 py-1 rounded-full border border-[#E2E8F0]">
                      {project.difficulty}
                    </span>
                  </div>
                  
                  {/* Circular Progress for active/completed projects */}
                  {!isLocked && (
                    <div className="relative w-12 h-12 shrink-0">
                      <svg className="absolute inset-0 -rotate-90 transform" width={48} height={48}>
                        <circle cx={24} cy={24} r={20} fill="none" stroke="#F1F5F9" strokeWidth={4} />
                        <motion.circle 
                          cx={24} cy={24} r={20} fill="none" stroke={s.border} strokeWidth={4} strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 20}
                          initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - project.progress / 100) }}
                          transition={{ duration: 1.5, delay: 0.2 + (i * 0.1) }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <span className="text-[10px] font-bold text-[#1A202C]">{project.progress}%</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-[20px] md:text-[22px] font-extrabold text-[#1A202C] leading-tight mb-2 group-hover:text-[#305EFF] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[14px] font-medium text-[#7A7571] leading-relaxed mb-6 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TerminalSquare className="w-3.5 h-3.5 text-[#A8A39D]" />
                    <span className="text-[11px] font-bold text-[#A8A39D] uppercase tracking-widest">Tech Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(t => (
                      <span key={t} className="text-[12px] font-semibold bg-[#F1F5F9] text-[#1A202C] px-3 py-1.5 rounded-[10px] border border-[#E2E8F0]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Code Quality & Actions Footer */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-8 pt-6 border-t border-[#E2E8F0]">
                  
                  {/* Code Quality */}
                  <div className="flex-1 max-w-[200px]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-1">
                        <Code2 className="w-3 h-3" /> Code Quality
                      </span>
                      <span className="text-[12px] font-extrabold text-[#1A202C]">{project.codeQuality}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${project.codeQuality}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className={`h-full rounded-full ${project.codeQuality >= 80 ? 'bg-[#10B981]' : project.codeQuality >= 50 ? 'bg-[#305EFF]' : 'bg-[#EF4444]'}`}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  {!isLocked && (
                    <button 
                      onClick={() => handleComplete(project.id)}
                      className={`px-5 py-2.5 rounded-full font-bold text-[13px] flex items-center gap-2 transition-all shrink-0 ${
                        isCompleted 
                          ? 'bg-[#F1F5F9] text-[#1A202C] border border-[#E2E8F0] hover:bg-[#E2E8F0]'
                          : 'bg-[#1A202C] text-white hover:bg-black shadow-md hover:-translate-y-0.5'
                      }`}
                    >
                      {isCompleted ? (
                        <>View Repository <ChevronRight className="w-4 h-4" /></>
                      ) : (
                        <>Continue Building <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
