"use client";

import { motion } from "framer-motion";
import { Check, Lock, Play, Star } from "lucide-react";
import { useProgressStore } from "~/stores/progressStore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { programs } from "~/data/programs";

export default function LearnPage() {
  const router = useRouter();
  const { learningPath, subProgress, isLoading } = useProgressStore();
  const allLessons = learningPath;
  const done = allLessons.filter((l) => l.status === "completed").length;
  const total = allLessons.length;
  const currentId = allLessons.find((l) => l.status === "active")?.id ?? null;
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nodeCenters, setNodeCenters] = useState<{ x: number; y: number }[]>(
    [],
  );

  useEffect(() => {
    let animationFrameId: number;

    const updatePath = () => {
      if (!svgRef.current) return;
      const svgRect = svgRef.current.getBoundingClientRect();
      const centers = nodeRefs.current.map((node) => {
        if (!node) return { x: 0, y: 0 };
        const rect = node.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - svgRect.left,
          y: rect.top + rect.height / 2 - svgRect.top,
        };
      });

      setNodeCenters((prev) => {
        if (prev.length !== centers.length) return centers;
        const hasChanged = centers.some((pt, i) => {
          const prevPt = prev[i];
          if (!prevPt) return true;
          return Math.abs(pt.x - prevPt.x) > 1 || Math.abs(pt.y - prevPt.y) > 1;
        });
        return hasChanged ? centers : prev;
      });

      animationFrameId = requestAnimationFrame(updatePath);
    };

    updatePath();

    const observer = new ResizeObserver(() => {
      updatePath();
    });
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("resize", updatePath);
    return () => {
      window.removeEventListener("resize", updatePath);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [allLessons]);

  const handleStartLearning = (lessonId: string) => {
    router.push(`/dashboard/learn/${lessonId}`);
  };

  const getOffset = (i: number) => {
    const pattern = [0, 90, 160, 90, 0, -90, -160, -90];
    return pattern[i % pattern.length];
  };

  return (
    <div className="relative mx-auto max-w-[1200px] overflow-x-hidden pt-4 pb-32 md:overflow-x-visible">
      {/* Sticky Progress Indicator */}
      <div className="fixed right-8 bottom-8 z-50 rounded-full border border-[#E2E8F0] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <svg
            className="h-full w-full -rotate-90 transform"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
              stroke="#305EFF"
              strokeWidth="8"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPct) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <TrendingUpIcon className="mb-0.5 h-4 w-4 text-[#305EFF]" />
            <span className="text-[13px] leading-none font-extrabold text-[#1A202C]">
              {progressPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 text-center"
      >
        <h2 className="mb-3 text-[32px] font-extrabold text-[#2C2A29] md:text-[40px]">
          Your Learning Journey
        </h2>
        <p className="text-[16px] font-medium text-[#7A7571]">
          Follow the path from beginner to placement-ready professional
        </p>
      </motion.div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col items-center gap-10 px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`flex w-full max-w-[900px] ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div className="h-40 w-full animate-pulse rounded-[24px] border border-[#E2E8F0] bg-white md:w-[46%]" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && allLessons.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F1F5F9]">
            <Star className="h-8 w-8 text-[#CBD5E1]" />
          </div>
          <h3 className="text-[20px] font-extrabold text-[#1A202C]">
            Journey not loaded yet
          </h3>
          <p className="max-w-sm text-[14px] font-medium text-[#94A3B8]">
            Your personalised learning path will appear here once your program
            is confirmed. Check back soon!
          </p>
        </motion.div>
      )}

      {/* Journey Map */}
      {!isLoading && allLessons.length > 0 && (
        <div
          className="relative flex w-full flex-col items-center"
          ref={containerRef}
        >
          <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full">
            <svg className="h-full w-full" ref={svgRef}>
              {nodeCenters.length > 1 && nodeCenters[0] && (
                <path
                  d={
                    `M ${nodeCenters[0].x} ${nodeCenters[0].y} ` +
                    nodeCenters
                      .slice(1)
                      .map((pt, i) => {
                        const prev = nodeCenters[i];
                        if (!prev) return "";
                        const midY = (prev.y + pt.y) / 2;
                        return `C ${prev.x} ${midY}, ${pt.x} ${midY}, ${pt.x} ${pt.y}`;
                      })
                      .join(" ")
                  }
                  stroke="#CBD5E1"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
              {nodeCenters.length > 1 && nodeCenters[0] && (
                <path
                  d={
                    `M ${nodeCenters[0].x} ${nodeCenters[0].y} ` +
                    nodeCenters
                      .slice(1)
                      .map((pt, i) => {
                        const prev = nodeCenters[i];
                        if (!prev) return "";
                        const midY = (prev.y + pt.y) / 2;
                        return `C ${prev.x} ${midY}, ${pt.x} ${midY}, ${pt.x} ${pt.y}`;
                      })
                      .join(" ")
                  }
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </div>

          {allLessons.map((lesson, i) => {
            const isLeft = i % 2 === 0;
            const isCompleted = lesson.status === "completed";
            const isActive =
              lesson.status === "active" || lesson.id === currentId;
            const isLocked = lesson.status === "locked";

            let nodeProgress = isCompleted ? 100 : 0;
            if (isActive) {
              const parts = lesson.id.split("_");
              const pId = parts[1];
              const mIdx = parseInt(parts[2]?.replace("m", "") ?? "0");
              const wIdx = parseInt(parts[3]?.replace("w", "") ?? "0");
              const program = programs.find((p) => p.id === pId);
              const topics = program?.curriculum?.[mIdx]?.weeks?.[wIdx]?.topics;
              if (topics && topics.length > 0) {
                const completedCount = subProgress[lesson.id]?.length ?? 0;
                nodeProgress = Math.round(
                  (completedCount / topics.length) * 100,
                );
              }
            }

            return (
              <div
                key={lesson.id}
                style={
                  {
                    "--desktop-offset": `${getOffset(i)}px`,
                  } as React.CSSProperties
                }
                className={`relative mb-12 flex w-full max-w-[900px] items-center px-4 md:mb-20 md:px-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} translate-x-0 flex-row transition-transform duration-500 md:translate-x-[var(--desktop-offset)]`}
              >
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="z-10 w-full pl-24 md:w-[46%] md:pl-0"
                >
                  <div
                    className={`rounded-[24px] border bg-white p-6 ${isActive ? "border-[#305EFF] shadow-[0_8px_30px_rgba(48,94,255,0.15)]" : "border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"} relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[1px]" />
                    )}

                    <div className="mb-4 flex items-start justify-between">
                      <span className="text-[11px] font-black tracking-widest text-[#94A3B8] uppercase">
                        {lesson.type === "video"
                          ? "LEARNING"
                          : lesson.type === "quiz"
                            ? "EVALUATION"
                            : "PROJECT"}
                      </span>
                      <div className="flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1">
                        <Star
                          className={`h-3.5 w-3.5 ${isCompleted ? "text-[#305EFF]" : "text-[#94A3B8]"}`}
                          fill={isCompleted ? "currentColor" : "none"}
                        />
                        <span className="text-[12px] font-bold text-[#4A5568]">
                          {lesson.xpReward}
                        </span>
                      </div>
                    </div>

                    <h3 className="mb-1 text-[18px] font-extrabold text-[#1A202C] md:text-[20px]">
                      {lesson.title}
                    </h3>
                    <p className="mb-6 line-clamp-2 text-[13px] leading-relaxed font-medium text-[#4A5568]">
                      {lesson.description}
                    </p>

                    <div className="mb-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#4A5568]">
                          Progress
                        </span>
                        <span className="text-[12px] font-extrabold text-[#1A202C]">
                          {nodeProgress}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                        <div
                          className="h-full rounded-full bg-[#305EFF] transition-all duration-500"
                          style={{ width: `${nodeProgress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isActive || isCompleted)
                          handleStartLearning(lesson.id);
                      }}
                      disabled={isLocked}
                      className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14px] font-bold transition-all ${
                        isCompleted
                          ? "bg-gradient-to-r from-[#305EFF] to-[#1E3A8A] text-white shadow-md hover:opacity-90"
                          : isActive
                            ? "transform bg-gradient-to-r from-[#305EFF] to-[#254EDB] text-white shadow-md hover:scale-[1.02] hover:shadow-lg"
                            : "cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]"
                      }`}
                    >
                      {isCompleted
                        ? "Review"
                        : isActive
                          ? "Start Learning"
                          : "Locked"}
                      {!isLocked && (
                        <Play className="ml-1 h-4 w-4 fill-current" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <div className="absolute left-6 z-20 flex justify-center md:static md:w-[8%]">
                  <div>
                    <motion.div
                      ref={(el) => {
                        nodeRefs.current[i] = el;
                      }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-[6px] border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] md:h-16 md:w-16 ${
                        isCompleted
                          ? "bg-[#305EFF] text-white"
                          : isActive
                            ? "bg-[#1E3A8A] text-white"
                            : "bg-[#E2E8F0] text-[#94A3B8]"
                      } relative`}
                    >
                      {isActive && (
                        <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#305EFF] opacity-20"></span>
                      )}
                      {isCompleted ? (
                        <Check
                          className="h-6 w-6 md:h-8 md:w-8"
                          strokeWidth={3}
                        />
                      ) : isLocked ? (
                        <Lock
                          className="h-5 w-5 md:h-6 md:w-6"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Star
                          className="h-6 w-6 md:h-7 md:w-7"
                          fill="currentColor"
                        />
                      )}
                    </motion.div>
                  </div>
                </div>

                <div className="hidden md:block md:w-[46%]" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
