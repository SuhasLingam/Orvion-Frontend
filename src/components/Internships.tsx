"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Palette, Cloud, BrainCircuit, Shield, Atom, Network, Database, type LucideIcon } from "lucide-react";
import { programs } from "~/data/programs";

const iconMap: Record<string, LucideIcon> = {
  "ui-ux-design": Palette,
  "devops-cloud": Cloud,
  "ai-data-science": BrainCircuit,
  "machine-learning": Network,
  "data-engineering": Database,
  "cybersecurity": Shield,
  "quantum-computing": Atom,
};

export default function Internships() {
  return (
    <section id="internships" className="w-full px-4 md:px-8 xl:px-12 py-24 bg-white flex flex-col items-center cursor-default">
      <div className="w-full max-w-[1640px] flex flex-col items-center">

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 xl:gap-7 w-full">
          {programs.map((program, i) => {
            const Icon = iconMap[program.id] ?? BrainCircuit;

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group block h-full"
              >
                <Link href={`/internships/${program.id}`} className="block h-full">
                  {/* Gradient Border Wrapper */}
                  <div className="h-full w-full rounded-[24px] p-[4px] bg-gradient-to-b from-[#305EFF] via-[#E2E8F0]/80 to-[#E2E8F0]/30 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative flex flex-col group">
                    
                    {/* Oversized Paperclip matching the UI */}
                    <div className="absolute -top-7 -right-4 drop-shadow-md z-20 transition-transform duration-300 group-hover:rotate-3 group-hover:-translate-y-1">
                      <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-[25deg]">
                        <path d="M21.5 8.5L12 18C10.5 19.5 10.5 22 12 23.5V23.5C13.5 25 16 25 17.5 23.5L27.5 13.5C30 11 30 7 27.5 4.5V4.5C25 2 21 2 18.5 4.5L8.5 14.5C5.18629 17.8137 5.18629 23.1863 8.5 26.5V26.5C11.8137 29.8137 17.1863 29.8137 20.5 26.5L28.5 18.5"
                          stroke="#081A4E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Inner Card Content */}
                    <div className="h-full bg-[#f8fafc] rounded-[20px] p-5 sm:px-6 sm:py-5 flex flex-col items-center text-center relative overflow-hidden">
                      
                      {/* Grey Icon Rounded Square */}
                      <div className="w-[48px] h-[48px] bg-[#D1D5DB]/60 rounded-xl flex items-center justify-center mb-4">
                         <Icon className="w-5 h-5 text-[#9CA3AF]" strokeWidth={2} />
                      </div>

                      <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0B0F19] mb-1.5 leading-tight font-heading">
                        {program.title} {program.titleHighlight} Internships
                      </h3>
                      
                      <p className="text-[13px] text-[#4B5563] font-medium leading-relaxed mb-5 line-clamp-2">
                        {program.description}
                      </p>

                      {/* Bottom Section */}
                      <div className="w-full flex justify-center mt-auto">
                        <div className="bg-[#B9CAE8]/50 border border-[#94A3B8]/30 text-[#0B0F19] text-[12px] font-medium px-4 py-1.5 rounded-lg">
                          {program.duration}
                        </div>
                      </div>

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
