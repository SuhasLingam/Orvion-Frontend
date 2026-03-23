"use client";

import { motion } from "framer-motion";
import { UserCheck, Award } from "lucide-react";

export default function InternshipFeatures() {
  return (
    <section className="w-full px-3 py-10 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Card 1: Mentorship */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-[24px] p-8 md:p-10 shadow-sm border border-[#E2E8F0]"
            style={{ 
              backgroundImage: "url('/intern-card-bg.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 mb-6 shadow-sm border border-[#E2E8F0]">
              <UserCheck className="w-6 h-6 text-[#305EFF]" strokeWidth={2} />
            </div>
            <h3 className="text-[28px] md:text-[34px] font-extrabold text-[#0B0F19] tracking-tight mb-4">
              1-on-1 Mentorship
            </h3>
            <p className="text-[15px] md:text-[16px] text-[#374151] font-medium leading-[1.6]">
              Get personalized guidance from industry experts. Regular code reviews, career advice, and technical support throughout your internship.
            </p>
          </motion.div>

          {/* Card 2: Certificate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col rounded-[24px] p-8 md:p-10 shadow-sm border border-[#E2E8F0]"
            style={{ 
              backgroundImage: "url('/intern-card-bg.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 mb-6 shadow-sm border border-[#E2E8F0]">
              <Award className="w-6 h-6 text-[#305EFF]" strokeWidth={2} />
            </div>
            <h3 className="text-[28px] md:text-[34px] font-extrabold text-[#0B0F19] tracking-tight mb-4">
              Certificate
            </h3>
            <p className="text-[15px] md:text-[16px] text-[#374151] font-medium leading-[1.6]">
              Earn an industry-recognized certificate upon successful completion. Boost your resume and stand out to potential employers.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
