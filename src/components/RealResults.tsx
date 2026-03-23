"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RealResults() {
  return (
    <div className="w-full px-3 py-8 md:py-10">
      <section className="w-full bg-[#F7F2EA] rounded-[32px] px-8 py-12 md:py-10 flex flex-col items-center drop-shadow-sm">

        <div className="w-full max-w-[1300px] flex flex-col">
          {/* Top Header */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-[42px] md:text-[52px] font-extrabold text-[#462A00] tracking-tight mb-12 md:mb-16"
          >
            Outcomes That Matter
          </motion.h2>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-12 w-full">

            {/* Left: Cascading Typography */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col relative w-full lg:w-[55%] select-none lg:pr-6"
            >
              {/* Outline Text 1 */}
              <div
                className="text-[52px] md:text-[84px] font-extrabold leading-[1.05] tracking-tight text-transparent mb-1"
                style={{ WebkitTextStroke: "1.5px rgba(205, 169, 61, 0.4)" }}
              >
                Real Results for<br />Real Students
              </div>

              {/* Filled Text */}
              <div className="text-[52px] md:text-[84px] font-extrabold leading-[1.05] tracking-tight">
                <div className="text-[#462A00]">Real Results for</div>
                <div
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #462A00 0%, #CDA93D 61.06%)" }}
                >
                  Real Students
                </div>
              </div>
            </motion.div>

            {/* Right: Graphic */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full lg:w-[45%] flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[640px] aspect-[1/0.95] lg:mr-2">
                <Image
                  src="/logo.svg"
                  alt="Orvion Academy Outcomes Logo"
                  fill
                  className="object-contain drop-shadow-[0_16px_32px_rgba(70,42,0,0.08)]"
                />
              </div>
            </motion.div>

          </div>

          {/* Centered CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 md:mt-16 w-full"
          >
            <Link
              href="#enroll"
              className="text-white px-12 py-3.5 rounded-xl font-bold text-[16px] text-center hover:shadow-[0_8px_20px_rgba(206,170,59,0.25)] hover:-translate-y-0.5 transition-all duration-300 min-w-[180px]"
              style={{ background: "linear-gradient(90deg, #CEAA3B 0%, #967C53 100%)" }}
            >
              Enroll Now
            </Link>
            <Link
              href="#call"
              className="bg-white text-[#CDA93D] border-[1.5px] border-[#CDA93D]/40 px-12 py-3.5 rounded-xl font-bold text-[16px] text-center hover:bg-[#FDFBF7] hover:shadow-[0_8px_20px_rgba(205,169,61,0.12)] hover:-translate-y-0.5 transition-all duration-300 min-w-[180px]"
            >
              Book a call
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
