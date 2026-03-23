"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Palette, Cloud, BrainCircuit, Shield, Atom, type LucideIcon } from "lucide-react";
import type { Program } from "~/data/programs";

const iconMap: Record<string, LucideIcon> = {
  "ui-ux-design": Palette,
  "devops-cloud": Cloud,
  "ai-data-science": BrainCircuit,
  "cybersecurity": Shield,
  "quantum-computing": Atom,
};

export default function ProgramHero({ program }: { program: Program }) {
  const Icon = iconMap[program.id] ?? BrainCircuit;

  return (
    <div className="w-full px-3 pt-3 pb-0">
      <section
        className="w-full rounded-[28px] px-8 pt-12 pb-16 md:px-16 md:pt-16"
        style={{ background: "linear-gradient(107.9deg, #EBF0F5 53.99%, #B1C3FF 109.34%)" }}
      >
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Link
            href="/#programs"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#596273] border border-[#DDE2EE] bg-white px-4 py-2 rounded-full hover:text-[#305EFF] hover:border-[#305EFF]/40 transition-all"
            style={{ fontFamily: "SF Pro Display, sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to programs
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Title + Badges + Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1
              className="text-[52px] md:text-[68px] font-extrabold leading-[1.05] tracking-tight mb-5"
              style={{ fontFamily: "SF Pro Display, sans-serif" }}
            >
              <span
                className="bg-clip-text text-transparent block"
                style={{ backgroundImage: "linear-gradient(180deg, #000000 0%, #305EFF 100%)" }}
              >
                {program.title}<br />{program.titleHighlight}
              </span>
            </h1>

            <p
              className="text-[#596273] text-[17px] font-medium leading-[1.65] mb-8 max-w-md"
              style={{ fontFamily: "SF Pro Display, sans-serif" }}
            >
              {program.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[program.duration, program.level, program.mode].map((badge) => (
                <span
                  key={badge}
                  className="text-[13px] font-semibold text-[#596273] border border-[#C5CCE0] bg-white/70 px-4 py-2 rounded-lg"
                  style={{ fontFamily: "SF Pro Display, sans-serif" }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="bg-[#305EFF] text-white px-8 py-3.5 rounded-xl font-semibold text-[16px] text-center hover:bg-blue-600 hover:shadow-[0_8px_20px_rgba(48,94,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                style={{ fontFamily: "SF Pro Display, sans-serif" }}
              >
                Enroll Now
              </Link>
              <Link
                href="/contact"
                className="bg-white text-[#305EFF] border-[1.5px] border-[#305EFF] px-8 py-3.5 rounded-xl font-semibold text-[16px] text-center hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-300"
                style={{ fontFamily: "SF Pro Display, sans-serif" }}
              >
                Get Syllabus
              </Link>
            </div>
          </motion.div>

          {/* Right: Highlights Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md bg-[#F1F5F9] border border-[#E2E8F0] rounded-[24px] p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06)] relative overflow-hidden">
              {/* Subtle top glare/gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
              
              {/* Card header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#E2E8F0]">
                  <Icon className="w-5 h-5 text-[#11244E]" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold tracking-wide text-[#64748B] uppercase">
                    Program Highlights
                  </span>
                  <span className="text-[18px] font-extrabold text-[#0F172A] tracking-tight">
                    What You&apos;ll Get
                  </span>
                </div>
              </div>

              {/* Highlight items */}
              <div className="flex flex-col gap-4">
                {program.highlights.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-4 bg-[#DCE4F5] border border-[#CCD8F0] rounded-xl px-4 py-4"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#1e293b] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-[#eff6ff]" strokeWidth={2.5} />
                    </span>
                    <span className="text-[14px] leading-relaxed text-[#334155] font-medium pr-2">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
