"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Lightbulb, Users, Award, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We exist to bridge the gap between academic learning and real-world tech careers.",
  },
  {
    icon: Lightbulb,
    title: "Industry-First",
    description: "Every curriculum is crafted alongside industry practitioners, not textbooks.",
  },
  {
    icon: Users,
    title: "Community Led",
    description: "Students, mentors, and alumni form a living network that grows together.",
  },
  {
    icon: Award,
    title: "Outcome Obsessed",
    description: "We measure success by your placement, salary, and career growth — not certificates.",
  },
];



export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-white">

      {/* Hero */}
      <div className="w-full px-3 pt-3 pb-0">
        <section
          className="w-full rounded-[28px] px-8 pt-20 pb-20 md:px-20"
          style={{ background: "linear-gradient(107.9deg, #EBF0F5 53.99%, #B1C3FF 109.34%)" }}
        >
          <div className="max-w-[800px]">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block text-[13px] font-semibold text-[#305EFF] tracking-widest uppercase mb-6 bg-white/80 px-4 py-1.5 rounded-full border border-[#C5D3FF]"
            >
              About Orvion
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[52px] md:text-[72px] font-extrabold leading-[1.05] tracking-tight mb-7 text-[#0B0F19]"
            >
              We Train the{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(180deg, #1A3175 0%, #305EFF 100%)" }}
              >
                Next Generation
              </span>
              <br />of Tech Leaders
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[18px] md:text-[20px] text-[#4B5563] font-medium leading-[1.6] max-w-xl mb-10"
            >
              Orvion is an industry-focused ed-tech company dedicated to preparing students for
              real-world technology careers through live projects, expert mentorship, and
              outcome-based programs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#305EFF] text-white px-8 py-3.5 rounded-xl font-semibold text-[16px] hover:shadow-[0_8px_20px_rgba(48,94,255,0.3)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>



      {/* Our Story */}
      <div className="w-full bg-[#F8FAFC] py-20 px-3">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[13px] font-semibold text-[#305EFF] tracking-widest uppercase mb-4 block">
              Our Story
            </span>
            <h2 className="text-[38px] md:text-[48px] font-extrabold text-[#0B0F19] tracking-tight leading-tight mb-6">
              Built by practitioners,<br />for practitioners
            </h2>
            <p className="text-[16px] text-[#4B5563] leading-[1.75] mb-5">
              Orvion was founded by a team of engineers, designers, and product managers who were
              tired of seeing talented graduates struggle to transition into tech roles despite holding
              degrees and certifications.
            </p>
            <p className="text-[16px] text-[#4B5563] leading-[1.75]">
              We built Orvion to be what we wished existed when we were starting out — a program
              that gives you the real skills, real mentorship, and real confidence to land and
              succeed in a tech career.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[24px] overflow-hidden aspect-[4/3] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #D4E0FF 0%, #C3D4FA 100%)" }}
          >
            <Image src="/logo.svg" alt="Orvion" width={96} height={96} className="opacity-40" />
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="w-full py-20 px-3">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[36px] md:text-[44px] font-black text-[#0B0F19] tracking-tight"
            >
              What We Stand For
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-7 flex flex-col gap-5 hover:shadow-[0_8px_24px_rgba(48,94,255,0.06)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                  <val.icon className="w-6 h-6 text-[#305EFF]" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#0B0F19] mb-2">{val.title}</h3>
                  <p className="text-[14px] text-[#4B5563] leading-relaxed">{val.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full px-3 pb-16">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[28px] p-12 md:p-16 text-center"
            style={{ background: "linear-gradient(107.9deg, #EBF0F5 53.99%, #B1C3FF 109.34%)" }}
          >
            <h2 className="text-[34px] md:text-[44px] font-black text-[#0B0F19] tracking-tight mb-5">
              Ready to start your journey?
            </h2>
            <p className="text-[17px] text-[#4B5563] mb-8 max-w-md mx-auto">
              Explore our programs and find the track that aligns with your goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#programs"
                className="bg-[#305EFF] text-white px-10 py-3.5 rounded-xl font-semibold text-[16px] hover:shadow-[0_8px_20px_rgba(48,94,255,0.3)] hover:-translate-y-0.5 transition-all duration-300"
              >
                View Programs
              </Link>
              <Link
                href="/contact"
                className="bg-white text-[#305EFF] border-2 border-white px-10 py-3.5 rounded-xl font-semibold text-[16px] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
