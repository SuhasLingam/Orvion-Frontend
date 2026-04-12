"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import type { Program, Month } from "~/data/programs";

// ─── Position helpers ─────────────────────────────────────────────────────────

type Pos = { monthIdx: number; weekIdx: number; lessonIdx: number };

function totalLessons(c: Month[]) {
  return c.reduce((s, m) => s + m.weeks.reduce((ws, w) => ws + w.topics.length, 0), 0);
}
function lessonNumber(c: Month[], p: Pos) {
  let n = 0;
  for (let mi = 0; mi < c.length; mi++)
    for (let wi = 0; wi < c[mi]!.weeks.length; wi++)
      for (let li = 0; li < c[mi]!.weeks[wi]!.topics.length; li++) {
        n++;
        if (mi === p.monthIdx && wi === p.weekIdx && li === p.lessonIdx) return n;
      }
  return n;
}
function prevPos(c: Month[], p: Pos): Pos | null {
  if (p.lessonIdx > 0) return { ...p, lessonIdx: p.lessonIdx - 1 };
  if (p.weekIdx > 0) {
    const pw = c[p.monthIdx]!.weeks[p.weekIdx - 1]!;
    return { ...p, weekIdx: p.weekIdx - 1, lessonIdx: pw.topics.length - 1 };
  }
  if (p.monthIdx > 0) {
    const pm = c[p.monthIdx - 1]!;
    const pw = pm.weeks[pm.weeks.length - 1]!;
    return { monthIdx: p.monthIdx - 1, weekIdx: pm.weeks.length - 1, lessonIdx: pw.topics.length - 1 };
  }
  return null;
}
function nextPos(c: Month[], p: Pos): Pos | null {
  const m = c[p.monthIdx]!;
  const w = m.weeks[p.weekIdx]!;
  if (p.lessonIdx < w.topics.length - 1) return { ...p, lessonIdx: p.lessonIdx + 1 };
  if (p.weekIdx < m.weeks.length - 1) return { ...p, weekIdx: p.weekIdx + 1, lessonIdx: 0 };
  if (p.monthIdx < c.length - 1) return { monthIdx: p.monthIdx + 1, weekIdx: 0, lessonIdx: 0 };
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LearnPage({ program }: { program: Program }) {
  const curriculum = program.curriculum ?? [];
  const total = totalLessons(curriculum);

  const [pos, setPos] = useState<Pos>({ monthIdx: 0, weekIdx: 0, lessonIdx: 0 });
  const [openMonths, setOpenMonths] = useState<Set<number>>(new Set([0]));
  const mainRef = useRef<HTMLDivElement>(null);

  const month = curriculum[pos.monthIdx]!;
  const week = month.weeks[pos.weekIdx]!;
  const topic = week.topics[pos.lessonIdx]!;
  const lessonNum = lessonNumber(curriculum, pos);
  const prev = prevPos(curriculum, pos);
  const next = nextPos(curriculum, pos);
  const progress = (lessonNum / total) * 100;

  // Lock body scroll — prevent browser scrollbar from showing behind the overlay
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Scroll main area to top whenever the lesson changes
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pos]);

  function goTo(p: Pos) {
    setPos(p);
    setOpenMonths((s) => new Set([...s, p.monthIdx]));
  }

  return (
    // Fixed overlay — covers root Navbar/Footer entirely
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-[#F4F7FB]"
      style={{ fontFamily: "SF Pro Display, sans-serif" }}
    >
      {/* ── TOP BAR ────────────────────────────────────────────────────────── */}
      <header
        className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-[#E2E8F0]"
        style={{ background: "linear-gradient(90deg,#FFFFFF 0%,#EBF0F5 100%)" }}
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/programs/${program.id}`}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#596273] hover:text-[#305EFF] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <span className="hidden sm:block text-[#D1D5DB]">|</span>

          <span className="text-[13px] font-bold text-[#0B0F19] truncate">
            {program.title} {program.titleHighlight}
          </span>

          <div className="hidden md:flex items-center gap-1.5 text-[12px] text-[#94A3B8] font-medium">
            <span>/</span>
            <span>{month.title}</span>
            <span>/</span>
            <span>Week {week.week}</span>
          </div>
        </div>

        {/* Right: progress */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[12px] text-[#64748B] font-medium hidden sm:block">
            {lessonNum} / {total} lessons
          </span>
          <div className="hidden sm:block w-[100px] h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#305EFF] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      {/* ── BODY ───────────────────────────────────────────────────────────── */}
      {/*
        CRITICAL: both direct children must be able to scroll independently.
        The parent needs min-h-0 to not grow beyond the viewport.
        Each child that should scroll needs overflow-y-auto + min-h-0.
      */}
      <div className="flex flex-1 min-h-0">

        {/* ── LEFT: Main content (scrollable) ──────────────────────────── */}
        <div
          ref={mainRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
          style={{ scrollbarWidth: "none" }}
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Video — full bleed, dark, no horizontal padding */}
          <div
            className="w-full bg-[#0B0F19] relative"
            style={{ aspectRatio: "16/9" }}
          >
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Blue glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_60%,rgba(48,94,255,0.14)_0%,transparent_100%)]" />

            {/* Animated play area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${pos.monthIdx}-${pos.weekIdx}-${pos.lessonIdx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-sm flex items-center justify-center hover:bg-white/[0.14] transition-colors cursor-pointer"
                >
                  <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                </motion.div>
                <p className="text-white/30 text-[13px] font-medium">Video coming soon</p>
              </motion.div>
            </AnimatePresence>

            {/* Lesson badge */}
            <div className="absolute top-4 left-4 bg-[#305EFF] px-3 py-1 rounded-full shadow-md">
              <span className="text-[11px] text-white font-bold uppercase tracking-widest">
                Lesson {lessonNum}
              </span>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Clock className="w-3 h-3 text-white/50" />
              <span className="text-[11px] text-white/50 font-medium">~15 min</span>
            </div>
          </div>

          {/* ── Info below video ──────────────────────────────────────────── */}
          <div className="px-6 md:px-10 py-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${pos.monthIdx}-${pos.weekIdx}-${pos.lessonIdx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Breadcrumb label */}
                <p className="text-[11px] font-bold text-[#305EFF] uppercase tracking-widest mb-2">
                  {month.title} · Week {week.week} · Lesson {pos.lessonIdx + 1} of {week.topics.length}
                </p>

                {/* Lesson title */}
                <h1 className="text-[22px] md:text-[28px] font-extrabold text-[#0B0F19] leading-tight mb-6">
                  {topic}
                </h1>

                {/* Week lesson list */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-3.5 h-3.5 text-[#305EFF]" />
                    <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      All lessons this week
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {week.topics.map((t, i) => {
                      const isActive = i === pos.lessonIdx;
                      return (
                        <button
                          key={i}
                          onClick={() => goTo({ ...pos, lessonIdx: i })}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                            isActive
                              ? "bg-[#EEF2FF] border border-[#305EFF]/20"
                              : "bg-white border border-[#E2E8F0] hover:border-[#305EFF]/30 hover:shadow-sm"
                          }`}
                        >
                          <div
                            className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isActive ? "border-[#305EFF] bg-[#305EFF]" : "border-[#CBD5E1]"
                            }`}
                          >
                            {isActive && <Play className="w-2.5 h-2.5 text-white fill-white ml-px" />}
                          </div>
                          <span
                            className={`text-[13px] font-medium ${
                              isActive ? "text-[#305EFF]" : "text-[#475569]"
                            }`}
                          >
                            {t}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Month-end assessment badge */}
                {month.assessment &&
                  pos.weekIdx === month.weeks.length - 1 &&
                  pos.lessonIdx === week.topics.length - 1 && (
                    <div className="flex items-center gap-3 bg-[#FFFBEB] border border-[#F59E0B]/30 rounded-2xl p-4 mb-8">
                      <CheckCircle2 className="w-5 h-5 text-[#B45309] shrink-0" />
                      <div>
                        <p className="text-[13px] font-bold text-[#92400E]">Month-end Assessment</p>
                        <p className="text-[12px] text-[#B45309] mt-0.5">{month.assessment}</p>
                      </div>
                    </div>
                  )}

                {/* Prev / Next */}
                <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => prev && goTo(prev)}
                    disabled={!prev}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                      prev
                        ? "bg-white border border-[#E2E8F0] text-[#0B0F19] hover:border-[#305EFF]/40 hover:text-[#305EFF] shadow-sm hover:-translate-y-0.5"
                        : "opacity-30 cursor-not-allowed bg-white border border-[#E2E8F0] text-[#94A3B8]"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <span className="text-[12px] text-[#94A3B8] font-medium">
                    {lessonNum} / {total}
                  </span>

                  <button
                    onClick={() => next && goTo(next)}
                    disabled={!next}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                      next
                        ? "bg-[#305EFF] text-white hover:bg-blue-600 shadow-[0_4px_14px_rgba(48,94,255,0.3)] hover:-translate-y-0.5"
                        : "opacity-30 cursor-not-allowed bg-[#305EFF] text-white"
                    }`}
                  >
                    Next Lesson <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT: Course contents panel (independently scrollable) ──── */}
        {/*
          For a flex child to scroll, it needs: overflow-y-auto + a constrained
          height. Since this is a direct child of a flex row with min-h-0, we
          use "h-full" + "overflow-y-auto" — NOT flex-col with flex-1 inside,
          because that chain only works when every ancestor has min-h-0.
        */}
        <div
          className="hidden lg:flex flex-col w-[300px] xl:w-[340px] shrink-0 border-l border-[#E2E8F0] bg-white"
        >
          {/* Fixed header inside the panel */}
          <div className="shrink-0 px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-0.5">
              <BookOpen className="w-3 h-3" /> Course Contents
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              {total} lessons · {curriculum.length} months
            </p>
          </div>

          {/* Scrollable lesson tree — min-h-0 is the key fix */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#E2E8F0 transparent" }}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
          >
            {curriculum.map((m, mIdx) => {
              const isOpen = openMonths.has(mIdx);
              return (
                <div key={mIdx} className="border-b border-[#F8FAFC] last:border-0">
                  {/* Month accordion header */}
                  <button
                    onClick={() =>
                      setOpenMonths((s) => {
                        const n = new Set(s);
                        if (n.has(mIdx)) {
                          n.delete(mIdx);
                        } else {
                          n.add(mIdx);
                        }
                        return n;
                      })
                    }
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded bg-[#EEF2FF] flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-[#305EFF]">M{m.month}</span>
                      </div>
                      <span className="text-[12px] font-bold text-[#0B0F19] truncate">{m.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#94A3B8] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Weeks + lessons */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        {m.weeks.map((w, wIdx) => (
                          <div key={wIdx}>
                            {/* Week label */}
                            <div className="px-4 py-1.5 pl-9">
                              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                                Week {w.week} · {w.title}
                              </p>
                            </div>

                            {/* Lesson rows */}
                            {w.topics.map((t, lIdx) => {
                              const isActive =
                                pos.monthIdx === mIdx &&
                                pos.weekIdx === wIdx &&
                                pos.lessonIdx === lIdx;
                              return (
                                <button
                                  key={lIdx}
                                  onClick={() => goTo({ monthIdx: mIdx, weekIdx: wIdx, lessonIdx: lIdx })}
                                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 pl-9 text-left transition-all border-l-2 ${
                                    isActive
                                      ? "bg-[#EEF2FF] border-l-[#305EFF]"
                                      : "border-l-transparent hover:bg-[#F8FAFC]"
                                  }`}
                                >
                                  {isActive ? (
                                    <PlayCircle className="w-3.5 h-3.5 text-[#305EFF] shrink-0" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-[#CBD5E1] shrink-0" />
                                  )}
                                  <span
                                    className={`text-[12px] font-medium leading-snug line-clamp-2 ${
                                      isActive ? "text-[#305EFF]" : "text-[#64748B] hover:text-[#0B0F19]"
                                    }`}
                                  >
                                    {t}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
