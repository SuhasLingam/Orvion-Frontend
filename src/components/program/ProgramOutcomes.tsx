"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function ProgramOutcomes({ outcomes, title = "Learning Outcomes" }: { outcomes: string[], title?: string }) {
  if (!outcomes || outcomes.length === 0) return null;

  return (
    <section className="w-full px-3 py-16 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[32px] md:text-[40px] font-extrabold text-[#0B0F19] tracking-tight mb-10"
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {outcomes.map((outcome, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 bg-[#EEF2F6] rounded-xl px-5 py-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-white/50 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <span className="w-7 h-7 rounded-full bg-[#132A6C] flex items-center justify-center shrink-0 shadow-sm">
                <Check className="w-4 h-4 text-white" strokeWidth={3.5} />
              </span>
              <span className="text-[14px] md:text-[15px] font-medium text-[#1A2638] leading-snug">
                {outcome}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
