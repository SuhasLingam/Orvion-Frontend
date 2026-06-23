"use client";
import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Mic,
  Sparkles,
  Target,
  Zap,
  MessageCircle,
} from "lucide-react";
import InterviewRadar from "~/components/dashboard/charts/InterviewRadar";
import { useProgressStore } from "~/stores/progressStore";

interface ResultStyle {
  bg: string;
  text: string;
}

const RESULT_STYLE: Record<string, ResultStyle> = {
  Correct: { bg: "#F0FDF4", text: "#10B981" },
  Partial: { bg: "#EFF6FF", text: "#305EFF" },
  Incorrect: { bg: "#FEF2F2", text: "#EF4444" },
};
const LEVEL_COLOR = {
  Easy: "#10B981",
  Medium: "#305EFF",
  Hard: "#EF4444",
} as const;

export default function InterviewsPage() {
  const { interviews, isLoading } = useProgressStore();
  const [expanded, setExpanded] = useState<string | null>(
    interviews[0]?.id ?? null,
  );

  const radarData = [
    {
      subject: "Technical",
      A: interviews[0]?.technicalScore ?? 0,
      B: interviews[1]?.technicalScore ?? 0,
    },
    {
      subject: "Communication",
      A: interviews[0]?.communicationScore ?? 0,
      B: interviews[1]?.communicationScore ?? 0,
    },
    {
      subject: "Problem Solving",
      A: interviews[0]?.problemSolvingScore ?? 0,
      B: interviews[1]?.problemSolvingScore ?? 0,
    },
    {
      subject: "Clarity",
      A: interviews[0]?.clarityScore ?? 0,
      B: interviews[1]?.clarityScore ?? 0,
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-5 pt-4 pb-20 md:px-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 flex items-center gap-3 text-3xl font-extrabold text-[#1A202C] md:text-[38px]"
          >
            Interview Suite <Mic className="h-8 w-8 text-[#305EFF]" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[16px] font-medium text-[#4A5568]"
          >
            Review your AI mock interviews to perfect your delivery.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] border border-[#E2E8F0] bg-white px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          <span className="mb-1 block text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
            Total Sessions
          </span>
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-[#E2E8F0]" />
          ) : (
            <span className="text-[24px] font-extrabold text-[#1A202C]">
              {interviews.length} Completed
            </span>
          )}
        </motion.div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="h-64 animate-pulse rounded-[24px] border border-[#E2E8F0] bg-white xl:col-span-1" />
          <div className="flex flex-col gap-5 xl:col-span-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-[24px] border border-[#E2E8F0] bg-white"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && interviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 py-24 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F1F5F9]">
            <Mic className="h-8 w-8 text-[#CBD5E1]" />
          </div>
          <h3 className="text-[20px] font-extrabold text-[#1A202C]">
            No interviews yet
          </h3>
          <p className="max-w-sm text-[14px] font-medium text-[#94A3B8]">
            Complete a Mockwin session and sync it here. Your scores, feedback,
            and question breakdown will all appear in this view.
          </p>
        </motion.div>
      )}

      {/* Interview content */}
      {!isLoading && interviews.length > 0 && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Left Col: Radar Chart */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-6 rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-[#305EFF]" />
                <h3 className="text-[16px] font-extrabold text-[#1A202C]">
                  Skill Radar
                </h3>
              </div>

              <div className="mb-4 rounded-[20px] border border-[#E2E8F0] bg-[#F1F5F9] p-4">
                <InterviewRadar
                  data={radarData}
                  labelA={interviews[0]?.title ?? ""}
                  labelB={interviews[1]?.title ?? ""}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[13px] font-bold text-[#1A202C]">
                  <div className="h-3 w-3 rounded-full bg-[#305EFF]" />{" "}
                  {interviews[0]?.title ?? "Recent"}
                </div>
                <div className="flex items-center gap-3 text-[13px] font-bold text-[#94A3B8]">
                  <div className="h-3 w-3 rounded-full bg-[#E2E8F0]" />{" "}
                  {interviews[1]?.title ?? "Previous"}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Col: Interview Logs */}
          <div className="flex flex-col gap-5 xl:col-span-2">
            {interviews.map((interview, i) => {
              const isOpen = expanded === interview.id;
              return (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`overflow-hidden rounded-[24px] border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-[#305EFF] shadow-[0_8px_30px_rgba(48,94,255,0.1)]"
                      : "border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : interview.id)}
                    className="flex w-full flex-col justify-between gap-4 p-6 text-left transition-colors hover:bg-[#F8FAFC] sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? "bg-[#305EFF] text-white" : "bg-[#F1F5F9] text-[#305EFF]"}`}
                      >
                        <Mic className="h-5 w-5" />
                      </div>
                      <div>
                        <h3
                          className={`mb-1 text-[18px] font-extrabold transition-colors ${isOpen ? "text-[#305EFF]" : "text-[#1A202C]"}`}
                        >
                          {interview.title}
                        </h3>
                        <p className="text-[13px] font-semibold text-[#94A3B8]">
                          {interview.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-6 sm:ml-auto">
                      <div className="hidden items-center gap-4 text-[13px] md:flex">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">
                            Tech
                          </span>
                          <span className="font-extrabold text-[#1A202C]">
                            {interview.technicalScore}/100
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">
                            Comm
                          </span>
                          <span className="font-extrabold text-[#1A202C]">
                            {interview.communicationScore}/100
                          </span>
                        </div>
                      </div>
                      <div className="hidden h-10 w-px bg-[#E2E8F0] sm:block" />
                      <div className="flex flex-col items-center">
                        <span className="mb-0.5 text-[10px] font-semibold text-[#94A3B8] uppercase">
                          Overall
                        </span>
                        <span className="text-[20px] font-black text-[#305EFF]">
                          {interview.overallScore}
                        </span>
                      </div>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isOpen ? "bg-[#F1F5F9]" : "bg-transparent"}`}
                      >
                        <ChevronDown
                          className={`h-5 w-5 text-[#94A3B8] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </div>
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
                        <div className="border-t border-[#E2E8F0] px-6 pt-2 pb-6">
                          <div className="relative mb-6 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                            <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 transform rounded-full border border-[#305EFF22] bg-[#EFF6FF] p-2">
                              <Sparkles className="h-5 w-5 text-[#305EFF]" />
                            </div>
                            <h4 className="mb-2 flex items-center gap-1.5 text-[12px] font-bold tracking-widest text-[#305EFF] uppercase">
                              <MessageCircle className="h-4 w-4" /> Mentor
                              Feedback
                            </h4>
                            <p className="text-[14px] leading-relaxed font-medium text-[#1A202C]">
                              {interview.feedback}
                            </p>
                          </div>

                          <h4 className="mb-4 flex items-center gap-1.5 text-[12px] font-bold tracking-widest text-[#A8A39D] uppercase">
                            <Zap className="h-4 w-4" /> Question Breakdown
                          </h4>

                          <div className="space-y-4">
                            {interview.questions.map((q, qIdx) => {
                              const rs =
                                RESULT_STYLE[q.result] ?? RESULT_STYLE.Partial!;
                              return (
                                <div
                                  key={q.id}
                                  className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 transition-colors hover:border-[#CBD5E1]"
                                >
                                  <div className="mb-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                    <div className="flex-1">
                                      <div className="mb-2 flex items-center gap-2">
                                        <span className="rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-black text-[#94A3B8]">
                                          Q{qIdx + 1}
                                        </span>
                                        <span
                                          className="text-[10px] font-bold tracking-widest uppercase"
                                          style={{
                                            color:
                                              LEVEL_COLOR[q.level] ?? "#94A3B8",
                                          }}
                                        >
                                          {q.level}
                                        </span>
                                      </div>
                                      <p className="text-[15px] leading-snug font-extrabold text-[#1A202C]">
                                        {q.question}
                                      </p>
                                    </div>
                                    <div className="shrink-0">
                                      <span
                                        className="border-opacity-50 rounded-full border px-3 py-1.5 text-[12px] font-bold"
                                        style={{
                                          backgroundColor: rs.bg,
                                          color: rs.text,
                                          borderColor: rs.text,
                                        }}
                                      >
                                        {q.result}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="relative rounded-[12px] border border-[#E2E8F0] bg-[#F1F5F9] p-3">
                                    <div className="absolute top-0 left-0 h-full w-1 rounded-l-[12px] bg-[#305EFF]" />
                                    <p className="pl-2 text-[13px] font-medium text-[#4A5568]">
                                      <span className="mr-1 font-bold text-[#1A202C]">
                                        AI Note:
                                      </span>
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
      )}
    </div>
  );
}
