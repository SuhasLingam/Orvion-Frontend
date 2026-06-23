"use client";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  CheckCircle2,
  ChevronRight,
  Code2,
  FolderKanban,
  TerminalSquare,
} from "lucide-react";
import Confetti from "~/components/dashboard/Confetti";
import { useProgressStore } from "~/stores/progressStore";
import { useNotifStore } from "~/stores/notifStore";
import { apiSubmitProject } from "~/utils/api";

interface ProjectStyle {
  bg: string;
  text: string;
  border: string;
}

const STATUS_STYLE: Record<string, ProjectStyle> = {
  locked: { bg: "#F1F5F9", text: "#94A3B8", border: "#E2E8F0" },
  in_progress: { bg: "#EFF6FF", text: "#305EFF", border: "#305EFF" },
  completed: { bg: "#F0FDF4", text: "#10B981", border: "#10B981" },
};

const STATUS_LABEL: Record<string, string> = {
  locked: "Locked",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function ProjectsPage() {
  const { projects, fetchProgress } = useProgressStore();
  const addToast = useNotifStore((s) => s.addToast);
  const [confettiFor, setConfettiFor] = useState<string | null>(null);

  async function handleComplete(id: number) {
    try {
      const githubUrl = window.prompt(
        "Enter GitHub Repository URL",
        "https://github.com/username/repository",
      );

      if (!githubUrl) return;

      const result = await apiSubmitProject({
        project_id: id,
        github_url: githubUrl,
      });

      // Trigger confetti + toast instead of alert
      setConfettiFor(String(id));
      setTimeout(() => setConfettiFor(null), 4000);

      addToast({
        type: "xp",
        title: "Project submitted!",
        body: `Code quality score: ${result.score ?? "—"}/100`,
      });

      // Re-sync project statuses from backend
      void fetchProgress();
    } catch (error) {
      console.error(error);
      addToast({
        type: "info",
        title: "Submission failed",
        body: error instanceof Error ? error.message : "Project submission failed",
      });
    }
  }

  const completedCount = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const progressPct =
    projects.length > 0
      ? Math.round((completedCount / projects.length) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-4 pb-20 md:px-10">
      <Confetti active={confettiFor !== null} />

      {/* Header Section */}
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 flex items-center gap-3 text-3xl font-extrabold text-[#1A202C] md:text-[38px]"
          >
            Project Studio <FolderKanban className="h-8 w-8 text-[#305EFF]" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[16px] font-medium text-[#7A7571]"
          >
            Build real-world applications to solidify your knowledge and
            portfolio.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex w-full items-center gap-4 rounded-[20px] border border-[#E2E8F0] bg-white px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:w-auto"
        >
          <div className="flex flex-col">
            <span className="mb-1 text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
              Overall Progress
            </span>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-32 overflow-hidden rounded-full bg-[#F1F5F9]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#305EFF] to-[#254EDB]"
                />
              </div>
              <span className="text-[16px] font-extrabold text-[#1A202C]">
                {completedCount}/{projects.length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
              className={`group relative overflow-hidden rounded-[24px] border bg-white transition-all duration-300 ${
                isLocked
                  ? "border-[#E2E8F0] shadow-sm"
                  : isInProgress
                    ? "border-[#305EFF] shadow-[0_8px_30px_rgba(48,94,255,0.15)] hover:-translate-y-1"
                    : "border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              {/* Locked Overlay */}
              {isLocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#F0ECE1] bg-white shadow-md">
                    <Lock className="h-5 w-5 text-[#A8A39D]" />
                  </div>
                  <p className="text-[14px] font-bold text-[#7A7571]">
                    Unlock by completing previous projects
                  </p>
                </div>
              )}

              {/* Card Top Accent Line */}
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: s.border }}
              />

              <div className="relative z-10 p-6 md:p-8">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full border px-3 py-1 text-[11px] font-black tracking-widest uppercase"
                      style={{
                        backgroundColor: s.bg,
                        color: s.text,
                        borderColor: `${s.border}40`,
                      }}
                    >
                      {STATUS_LABEL[project.status] ?? project.status}
                    </span>
                    <span className="rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1 text-[11px] font-bold text-[#94A3B8]">
                      {project.difficulty}
                    </span>
                  </div>

                  {/* Circular Progress for active/completed projects */}
                  {!isLocked && (
                    <div className="relative h-12 w-12 shrink-0">
                      <svg
                        className="absolute inset-0 -rotate-90 transform"
                        width={48}
                        height={48}
                      >
                        <circle
                          cx={24}
                          cy={24}
                          r={20}
                          fill="none"
                          stroke="#F1F5F9"
                          strokeWidth={4}
                        />
                        <motion.circle
                          cx={24}
                          cy={24}
                          r={20}
                          fill="none"
                          stroke={s.border}
                          strokeWidth={4}
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 20}
                          initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                          animate={{
                            strokeDashoffset:
                              2 * Math.PI * 20 * (1 - project.progress / 100),
                          }}
                          transition={{ duration: 1.5, delay: 0.2 + i * 0.1 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                        ) : (
                          <span className="text-[10px] font-bold text-[#1A202C]">
                            {project.progress}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="mb-2 text-[20px] leading-tight font-extrabold text-[#1A202C] transition-colors group-hover:text-[#305EFF] md:text-[22px]">
                  {project.title}
                </h3>
                <p className="mb-6 line-clamp-2 text-[14px] leading-relaxed font-medium text-[#7A7571]">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-1.5">
                    <TerminalSquare className="h-3.5 w-3.5 text-[#A8A39D]" />
                    <span className="text-[11px] font-bold tracking-widest text-[#A8A39D] uppercase">
                      Tech Stack
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((t) => (
                      <span
                        key={t}
                        className="rounded-[10px] border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1.5 text-[12px] font-semibold text-[#1A202C]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Code Quality & Actions Footer */}
                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#E2E8F0] pt-6 sm:flex-row sm:items-end">
                  {/* Code Quality */}
                  <div className="max-w-[200px] flex-1">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#94A3B8] uppercase">
                        <Code2 className="h-3 w-3" /> Code Quality
                      </span>
                      <span className="text-[12px] font-extrabold text-[#1A202C]">
                        {project.codeQuality}/100
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.codeQuality}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`h-full rounded-full ${project.codeQuality >= 80 ? "bg-[#10B981]" : project.codeQuality >= 50 ? "bg-[#305EFF]" : "bg-[#EF4444]"}`}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  {!isLocked && (
                    <button
                      onClick={() => handleComplete(Number(project.id))}
                      className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold transition-all ${
                        isCompleted
                          ? "border border-[#E2E8F0] bg-[#F1F5F9] text-[#1A202C] hover:bg-[#E2E8F0]"
                          : "bg-[#1A202C] text-white shadow-md hover:-translate-y-0.5 hover:bg-black"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          View Repository <ChevronRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Continue Building <ChevronRight className="h-4 w-4" />
                        </>
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
