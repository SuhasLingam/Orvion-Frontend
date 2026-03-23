"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Palette, Cloud, BrainCircuit, Shield, Atom, type LucideIcon } from "lucide-react";
import { programs } from "~/data/programs";

const iconMap: Record<string, LucideIcon> = {
  "ui-ux-design": Palette,
  "devops-cloud": Cloud,
  "ai-data-science": BrainCircuit,
  "cybersecurity": Shield,
  "quantum-computing": Atom,
};

export default function Internships() {
  return (
    <section id="internships" className="w-full px-3 py-16 bg-white flex flex-col items-center">
      <div className="w-full max-w-[1240px] flex flex-col items-center">

        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[44px] font-black text-[#0B0F19] tracking-tight mb-4"
          >
            Internship Program
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[18px] text-[#4B5563] font-medium"
          >
            Real-world experience with industry mentors
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full px-4 md:px-0">
          {programs.map((program, i) => {
            const Icon = iconMap[program.id] ?? BrainCircuit;

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group block"
              >
                <Link href={`/internships/${program.id}`}>
                  <div className="h-full flex flex-col items-center text-center bg-[#F8FAFC] rounded-2xl p-8 pt-10 
                               border-t-2 border-l-2 border-[#305EFF] 
                               border-b border-r border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                               hover:shadow-[0_8px_30px_rgb(48,94,255,0.12)] hover:-translate-y-1 transition-all duration-300">

                    {/* Custom SVG Paperclip matching the UI */}
                    <div className="absolute -top-3 -right-3 rotate-[15deg] drop-shadow-sm">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.5 8.5L12 18C10.5 19.5 10.5 22 12 23.5V23.5C13.5 25 16 25 17.5 23.5L27.5 13.5C30 11 30 7 27.5 4.5V4.5C25 2 21 2 18.5 4.5L8.5 14.5C5.18629 17.8137 5.18629 23.1863 8.5 26.5V26.5C11.8137 29.8137 17.1863 29.8137 20.5 26.5L28.5 18.5"
                          stroke="#1A3175" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* White Icon Circle */}
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#E2E8F0] relative z-10 transition-transform">
                      <Icon className="w-6 h-6 text-[#305EFF]" strokeWidth={2} />
                    </div>

                    <h3 className="text-[20px] font-bold text-[#0B0F19] mb-3 leading-tight font-heading transition-colors">
                      {program.title} <span className="text-[#305EFF]">{program.titleHighlight}</span>
                    </h3>

                    <p className="text-[13px] text-[#4B5563] font-medium leading-relaxed mb-6 px-2 line-clamp-2">
                      {program.description}
                    </p>

                    <div className="mt-auto">
                      <span className="inline-block bg-[#E2E8F0] text-[#1E293B] text-[11px] font-bold px-4 py-1.5 rounded-md">
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <Link
            href="#internships"
            className="inline-block bg-[#305EFF] text-white px-8 py-3.5 rounded-lg font-semibold text-[15px] hover:bg-blue-600 shadow-[0_4px_14px_rgba(48,94,255,0.3)] transition-all hover:-translate-y-0.5"
          >
            Explore All Tracks
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
