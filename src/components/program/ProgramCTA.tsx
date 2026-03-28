"use client";

import { motion } from "framer-motion";

export default function ProgramCTA() {
  return (
    <section className="w-full px-3 py-24 bg-white">
      <div className="max-w-[850px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">

        {/* Left: CSS Whiteboard Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center md:justify-end md:pr-12"
        >
          <div className="flex flex-col items-center w-[340px]">
            {/* Top Bar */}
            <div className="w-full h-[18px] bg-[#204C70] rounded-t-[2px]"></div>

            {/* Board */}
            <div className="w-[316px] h-[150px] bg-[#F6F8FA] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-center relative">
              <h3 className="text-[32px] font-extrabold text-[#0B0F19] text-center leading-[1.15] tracking-tight">
                Ready to Get<br />Started?
              </h3>
            </div>

            {/* Bottom Bar */}
            <div className="w-full h-[18px] bg-[#204C70] relative z-10 rounded-b-[2px]"></div>

            {/* Tripod Stand */}
            <div className="relative w-[140px] h-[100px] flex justify-center">
              {/* Neck (Top connected part) */}
              <div className="w-[8px] h-[15px] bg-[#204C70] absolute top-0 left-1/2 -translate-x-1/2"></div>

              {/* Center leg */}
              <div className="w-[8px] h-[55px] bg-[#204C70] absolute top-[15px] left-1/2 -translate-x-1/2 rounded-b-[4px]"></div>

              {/* Left leg */}
              <div
                className="w-[8px] h-[65px] bg-[#204C70] absolute top-[14px] left-1/2 -translate-x-1/2 origin-top rounded-b-[4px]"
                style={{ transform: "rotate(38deg)" }}
              ></div>

              {/* Right leg */}
              <div
                className="w-[8px] h-[65px] bg-[#204C70] absolute top-[14px] left-1/2 -translate-x-1/2 origin-top rounded-b-[4px]"
                style={{ transform: "rotate(-38deg)" }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Right: Text and CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center md:items-start text-center md:text-left"
        >
          <p className="text-[17px] font-medium text-[#1A2638] leading-[1.65] mb-6 max-w-[280px]">
            Join thousands of students who transformed their careers with Orvion Academy
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event("openEnrollModal"))}
            className="inline-flex bg-[#305EFF] text-white px-9 py-3 rounded-[10px] font-semibold text-[15px] hover:bg-blue-600 hover:shadow-[0_8px_20px_rgba(48,94,255,0.25)] transition-all duration-300"
          >
            Enroll Now
          </button>
        </motion.div>

      </div>
    </section>
  );
}
