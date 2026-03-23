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

export default function Programs() {
  return (
    <section id="programs" className="w-full px-3 py-24 bg-white flex flex-col items-center">
      <div className="w-full max-w-[1240px] flex flex-col items-center">
        
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[42px] md:text-[56px] font-extrabold text-[#0B0F19] tracking-tight mb-4"
          >
            Premium Programs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[18px] text-[#4B5563] font-medium"
          >
            Industry-designed curriculum for the modern tech professional
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full px-4 md:px-0">
          {programs.map((program, i) => {
            const Icon = iconMap[program.id] ?? BrainCircuit;

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group block"
              >
                <Link href={`/programs/${program.id}`}>
                  <div className="h-full flex flex-col items-center text-center bg-[#F8FAFC] rounded-2xl p-8 pt-10 
                               border-t-2 border-l-2 border-[#1B324D] 
                               border-b border-r border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                               hover:shadow-[0_8px_30px_rgb(27,50,77,0.12)] hover:-translate-y-1 transition-all duration-300">
                    
                    {/* Premium Bookmark overlapping the top border */}
                    <div className="absolute -top-[2px] right-8 drop-shadow-md">
                      <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H24V34L12 26L0 34V0Z" fill="#1B324D"/>
                      </svg>
                    </div>

                    {/* White Icon Circle */}
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#E2E8F0] relative z-10">
                      <Icon className="w-6 h-6 text-[#1B324D]" strokeWidth={2} />
                    </div>

                    <h3 className="text-[20px] font-bold text-[#0B0F19] mb-3 leading-tight font-heading group-hover:text-[#1B324D] transition-colors">
                      {program.title} <span className="text-[#1B324D]">{program.titleHighlight}</span>
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
            href="#programs"
            className="inline-block bg-[#1B324D] text-white px-10 py-4 rounded-xl font-semibold text-[16px] hover:bg-[#112338] shadow-[0_4px_14px_rgba(27,50,77,0.3)] transition-all hover:-translate-y-0.5"
          >
            Explore All Programs
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
