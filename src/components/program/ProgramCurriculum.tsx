"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, AlertCircle } from "lucide-react";
import Image from "next/image";
import type { Month, Week } from "~/data/programs";

// 4-month programs
const PYRAMIDS_4M: string[] = [
  "/pyramids/m1.svg",
  "/pyramids/m2.svg",
  "/pyramids/m3.svg",
  "/pyramids/m4.svg",
];

// 3-month programs
const PYRAMIDS_3M: string[] = [
  "/pyramids/3-months/3m1.svg",
  "/pyramids/3-months/3m2.svg",
  "/pyramids/3-months/3m3.svg",
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProgramCurriculum({
  curriculum,
}: {
  curriculum: Month[];
}) {
  const [activeMonth, setActiveMonth] = useState(0);
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set([0]));

  /* Reset open weeks when month changes */
  useEffect(() => {
    setOpenWeeks(new Set([0]));
  }, [activeMonth]);

  if (!curriculum || curriculum.length === 0) return null;

  const currentMonth: Month | undefined = curriculum[activeMonth];
  const pyramidSet = curriculum.length === 3 ? PYRAMIDS_3M : PYRAMIDS_4M;
  const pyramidSrc: string = pyramidSet[activeMonth] ?? pyramidSet[0] ?? "/pyramids/m1.svg";

  // Safety guard — activeMonth is always in bounds, but satisfies TypeScript
  if (!currentMonth) return null;

  function handleMonthSelect(idx: number) {
    if (idx === activeMonth) return;
    setActiveMonth(idx);
  }

  function toggleWeek(wIdx: number) {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(wIdx)) next.delete(wIdx);
      else next.add(wIdx);
      return next;
    });
  }

  return (
    <section
      id="curriculum"
      className="w-full px-2 md:px-4 py-20 bg-white border-t border-[#F1F5F9]"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-[#305EFF] px-4 py-2 rounded-full font-bold text-[13px] uppercase tracking-wide mb-4">
            <BookOpen className="w-4 h-4" /> Curriculum
          </div>
          <h2 className="text-[36px] md:text-[46px] font-extrabold text-[#0B0F19] tracking-tight leading-tight mb-4">
            Master the Curriculum
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#64748B] max-w-2xl leading-relaxed">
            A carefully structured syllabus designed by industry experts —
            progressive mastery from ground zero to production-level readiness.
          </p>
        </div>

        {/* ── Month pill tabs ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10 flex-wrap">
          {curriculum.map((month, idx) => {
            const isActive = idx === activeMonth;
            return (
              <button
                key={month.month}
                onClick={() => handleMonthSelect(idx)}
                className={[
                  "relative px-4 sm:px-6 py-2.5 rounded-full text-[13px] sm:text-[14px]",
                  "font-bold tracking-wide transition-all duration-200 focus:outline-none",
                  isActive
                    ? "bg-[#305EFF] text-white shadow-lg shadow-blue-200"
                    : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0B0F19]",
                ].join(" ")}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-[#305EFF]"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                  />
                )}
                <span className="relative z-10">
                  <span className="opacity-70 mr-1.5 text-[11px] uppercase tracking-widest">
                    M{month.month}
                  </span>
                  {month.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Content: Pyramid (left) + Weeks (right) ─────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">

          {/* ── Left: Pyramid + month label ────────────────────────────────── */}
          <div className="flex flex-col items-center shrink-0 w-full lg:w-[300px]">
            {/*
              Cross-dissolve in place: both images are absolute-positioned
              inside a sized container so they occupy the exact same space.
              mode="sync" lets exit + enter run simultaneously → true morph.
            */}
            <div
              className="relative w-full max-w-[260px] lg:max-w-none"
              style={{ aspectRatio: "509 / 545" }}
            >
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={activeMonth}
                  initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1,   filter: "blur(0px)" }}
                  exit={{    opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    filter:
                      "drop-shadow(0 12px 36px rgba(48,94,255,0.10)) drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
                  }}
                >
                  <Image
                    src={pyramidSrc}
                    alt={`Month ${currentMonth.month} pyramid`}
                    fill
                    className="object-contain"
                    unoptimized
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Month label below pyramid — no animation */}
            <div className="mt-5 text-center">
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest font-bold mb-1">
                Month {currentMonth.month}
              </p>
              <h3 className="text-[20px] md:text-[22px] font-extrabold text-[#0B0F19] leading-tight">
                {currentMonth.title}
              </h3>
              {currentMonth.assessment && (
                <div className="inline-flex items-center gap-1.5 mt-3 bg-[#FEF3C7] text-[#B45309] px-3 py-1.5 rounded-full text-[12px] font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {currentMonth.assessment}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Week accordions — no animation ──────────────────────── */}
          <div className="flex-1 w-full flex flex-col gap-3 min-w-0">
            {currentMonth.weeks.map((week, wIdx) => (
              <WeekAccordion
                key={week.week}
                week={week}
                isOpen={openWeeks.has(wIdx)}
                onToggle={() => toggleWeek(wIdx)}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

// ─── Week Accordion ──────────────────────────────────────────────────────────

function WeekAccordion({
  week,
  isOpen,
  onToggle,
}: {
  week: Week;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={[
        "bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm transition-colors duration-200",
        isOpen
          ? "border-l-4 border-l-[#305EFF]"
          : "border-l-4 border-l-transparent hover:border-l-[#305EFF]",
      ].join(" ")}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 bg-white text-left focus:outline-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-[#64748B] font-bold text-[13px] uppercase tracking-wider shrink-0 w-[76px]">
            Week {week.week}
          </span>
          <span className="text-[#0B0F19] font-extrabold text-[15px] md:text-[17px]">
            {week.title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.26, ease: "easeInOut" }}
          className="shrink-0 w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] ml-4"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
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
            <div className="px-5 md:px-20 pb-5 pt-1">
              <ul className="flex flex-col gap-2.5">
                {week.topics.map((topic: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-[#305EFF]" />
                    <span className="text-[14px] text-[#4B5563] font-medium leading-relaxed">
                      {topic}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
