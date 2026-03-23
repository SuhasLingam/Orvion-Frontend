"use client";

import { motion } from "framer-motion";
import { UserPlus, BookOpen, Rocket, Users, Briefcase } from "lucide-react";

const steps = [
  {
    title: "Join",
    description: "Enroll in your chosen program",
    icon: UserPlus,
  },
  {
    title: "Learn",
    description: "Master skills with expert instructors",
    icon: BookOpen,
  },
  {
    title: "Build",
    description: "Create real-world projects",
    icon: Rocket,
  },
  {
    title: "Mentor",
    description: "Get 1-on-1 career guidance",
    icon: Users,
  },
  {
    title: "Get Placed",
    description: "Land your dream job",
    icon: Briefcase,
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full px-3 py-24 bg-white flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-[1000px] flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[36px] md:text-[44px] font-black text-[#0B0F19] tracking-tight mb-4"
          >
            How It works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[17px] text-[#4B5563] font-medium"
          >
            Your journey from learning to earning
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full">
          {/* Central Dashed Line (Desktop only) */}
          <div className="absolute left-[24px] md:left-1/2 top-4 bottom-4 md:-translate-x-1/2 border-l-[2px] border-dashed border-[#6B7280] opacity-30 pointer-events-none" />

          {/* Steps */}
          <div className="flex flex-col space-y-12 md:space-y-0 w-full relative">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <div key={index} className="relative flex flex-col md:flex-row items-start md:items-center w-full min-h-[140px]">
                  
                  {/* Number Circle attached to the line */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                    className="absolute left-[24px] md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-[#1A3175] text-white flex items-center justify-center font-bold text-[18px] z-10 ring-[6px] ring-white shadow-sm"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Content Container (Left or Right) */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className={`w-full md:w-1/2 pl-[70px] md:pl-0 flex ${isEven ? "md:pr-[15%]" : "md:pl-[10%] md:ml-auto"} flex-row items-center gap-6 mt-1 md:mt-0`}
                  >
                    {/* Gradient Squircle Icon Placeholder */}
                    <div className="w-[72px] h-[72px] shrink-0 rounded-2xl shadow-sm border border-white/20 flex items-center justify-center" 
                         style={{ background: "linear-gradient(135deg, #D4E0FF 0%, #C3D4FA 100%)" }} 
                    >
                      <step.icon className="w-8 h-8 text-[#1A3175]" strokeWidth={2} />
                    </div>

                    {/* Text block */}
                    <div className="flex flex-col text-left">
                      <h3 className="text-[26px] font-extrabold text-[#0B0F19] tracking-tight leading-tight mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[14px] font-medium text-[#4B5563] leading-relaxed max-w-[200px]">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
