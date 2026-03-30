"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Palette, Cloud, BrainCircuit, Shield, Atom, ArrowRight, Network, Database, type LucideIcon } from "lucide-react";
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

export default function Programs() {
  return (
    <section id="programs" className="w-full px-4 md:px-8 xl:px-12 py-24 bg-white flex flex-col items-center">
      <div className="w-full max-w-[1640px] flex flex-col items-center">

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 xl:gap-12 w-full">
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
                <Link href={`/programs/${program.id}`} className="block h-full">
                  {/* Gradient Border Wrapper */}
                  <div className="h-full w-full rounded-[24px] rounded-tr-[100px] p-[4px] bg-gradient-to-tr from-[#E2E8F0] via-[#E2E8F0]/30 to-[#305EFF] shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col">

                    {/* Inner Card Content */}
                    <div className="h-full bg-[#f8fafc] rounded-[20px] rounded-tr-[96px] p-6 sm:px-8 sm:py-7 flex flex-col items-start text-left relative overflow-hidden">
                      
                      {/* Grey Icon Circle */}
                      <div className="w-[64px] h-[64px] bg-[#D1D5DB]/60 rounded-full flex items-center justify-center mb-6">
                        <Icon className="w-7 h-7 text-[#9CA3AF]" strokeWidth={2} />
                      </div>

                      <h3 className="text-[24px] sm:text-[26px] font-bold text-[#0B0F19] mb-2 leading-tight font-heading">
                        {program.title} {program.titleHighlight}
                      </h3>
                      
                      <p className="text-[14px] sm:text-[15px] text-[#4B5563] font-medium leading-relaxed mb-8 line-clamp-2">
                        {program.description}
                      </p>

                      {/* Bottom Section */}
                      <div className="w-full flex justify-between items-end mt-auto">
                        <div className="bg-[#B9CAE8]/50 border border-[#94A3B8]/20 text-[#0B0F19] text-[13px] font-medium px-5 py-2 
rounded-lg">
                          {program.duration}
                        </div>

                        {/* Floating Action Button */}
                        <div className="w-[46px] h-[46px] rounded-full bg-[#111827] flex items-center justify-center relative overflow-hidden shadow-md">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(48,94,255,0.8)_0%,transparent_60%)] opacity-90" />
                          <ArrowRight className="w-5 h-5 text-white relative z-10" />
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
