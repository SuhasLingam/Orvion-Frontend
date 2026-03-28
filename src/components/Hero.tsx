"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

export default function Hero() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="w-full px-3 pt-3 pb-6">
      <section className="w-full bg-[#EEF2F8] rounded-[28px] pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col items-center text-center">
        <motion.div
          className="w-full max-w-[820px] mx-auto px-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-[52px] sm:text-[72px] md:text-[90px] font-extrabold tracking-tight leading-[1] mb-6" style={{ fontFamily: "SF Pro Display, sans-serif" }}>
            <span className="text-[#000000]">Transform Your</span> <br />
            <span className="bg-gradient-to-r from-black to-blue-600 bg-clip-text text-transparent">Tech Career</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={fadeUp} className="text-[#4A5568] text-[18px] md:text-[20px] font-medium leading-[1.6] mb-12 max-w-2xl mx-auto" style={{ fontFamily: "SF Pro Display, sans-serif" }}>
            Learn cutting edge tech skills <span className="mx-1 text-[#4A5568]">→</span> Build real <br className="hidden sm:block" />
            world projects <span className="mx-1 text-[#4A5568]">→</span> Land your dream job
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24">
            <button
              onClick={() => window.dispatchEvent(new Event("openEnrollModal"))}
              className="w-full sm:w-[170px] bg-[#305EFF] text-white py-3 rounded-xl font-semibold text-[17px] hover:bg-blue-600 transition-colors shadow-sm"
            >
              Enroll Now
            </button>
            <Link
              href="/contact"
              className="w-full sm:w-[170px] bg-white text-[#305EFF] border-[1.5px] border-[#305EFF] py-3 rounded-xl font-semibold text-[17px] hover:bg-blue-50 transition-colors shadow-sm"
            >
              Book a call
            </Link>
          </motion.div>

          {/* Features / Laurels */}
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
            <FeatureLaurel text="100%" subtext="Real Time Projects" />
            <FeatureLaurel text="100%" subtext="Live Teaching" />
            <FeatureLaurel text="100%" subtext="Opportunities" />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

function FeatureLaurel({ text, subtext }: { text: string; subtext: string }) {
  // Formatting text exactly like the screenshot
  const formattedSubtext = subtext === "Real Time Projects"
    ? "Real Time\nProjects"
    : subtext === "Live Teaching"
      ? "Live\nTeaching"
      : "Opportunities";

  return (
    <div className="relative flex flex-col items-center justify-center w-[180px] h-[90px]">
      <Image src="/leaf.svg" alt="Laurel wreath" fill className="object-contain pointer-events-none drop-shadow-sm" />
      {/* Text sits perfectly centered relative to the laurel SVG */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center -mt-10">
        <span className="text-[#462A00] font-bold text-[30px] leading-none mb-0.5">{text}</span>
        <span className="text-[#462A00] font-bold text-[10px] uppercase tracking-[0.1em] leading-[1.3] whitespace-pre-line">{formattedSubtext}</span>
      </div>
    </div>
  );
}
