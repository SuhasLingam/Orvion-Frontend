"use client";

import { BookOpen, Calendar, MessageSquare, Download, FileText, BrainCircuit, Play, CheckCircle2, Eye, Clock } from "lucide-react";
import { useUserStore } from "~/stores/userStore";
import { useInsightStore } from "~/stores/insightStore";
import { useProgressStore } from "~/stores/progressStore";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export default function DashboardPage() {
  const { xpHistory } = useUserStore();
  const { insight } = useInsightStore();
  const { learningPath, projects, interviews } = useProgressStore();

  const totalLessons = learningPath.length;
  const completedLessons = learningPath.filter((l) => l.status === "completed").length;
  const watchedLessons = learningPath.filter((l) => l.type === "video" && l.status === "completed").length;
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const learningPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const projectsPct = projects.length > 0 ? Math.round((projects.filter(p => p.status === "completed").length / projects.length) * 100) : 0;
  const interviewsPct = Math.min(100, Math.round(((interviews.length) / 5) * 100)) || 0;

  // Dynamic Readiness Calculation (40% Learning, 40% Projects, 20% Interviews)
  const dynamicReadiness = Math.round((learningPct * 0.4) + (projectsPct * 0.4) + (interviewsPct * 0.2));
  
  let readinessStatus = "Starting Out";
  if (dynamicReadiness >= 20) readinessStatus = "Making Progress";
  if (dynamicReadiness >= 50) readinessStatus = "Rising Star";
  if (dynamicReadiness >= 75) readinessStatus = "Placement Ready";
  if (dynamicReadiness >= 90) readinessStatus = "Elite Talent";

  return (
    <div className="space-y-8 pb-20">
      
      {/* ── Quick Actions Row ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Continue Learning", sub: "Resume where you left off", icon: Play },
          { label: "Schedule Session", sub: "Book 1-on-1 mentoring", icon: Calendar },
          { label: "Mock Interview", sub: "Practice with AI mentor", icon: MessageSquare },
          { label: "Get Certificate", sub: "Download progress report", icon: Download },
        ].map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[24px] p-5 md:p-6 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-start hover:shadow-md transition-shadow text-left group"
          >
            <div className="w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center mb-4 text-[#305EFF] group-hover:bg-[#305EFF] group-hover:text-white transition-colors">
              <action.icon className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
            </div>
            <h4 className="text-[15px] font-extrabold text-[#1A202C] mb-1">{action.label}</h4>
            <p className="text-[12px] font-medium text-[#4A5568] leading-snug">{action.sub}</p>
          </motion.button>
        ))}
      </div>

      {/* ── View Sample Test Result ─────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <button className="bg-[#305EFF] text-white px-6 py-3.5 rounded-full font-bold shadow-md hover:bg-[#254EDB] transition-colors flex items-center gap-2">
          <FileText className="w-4 h-4" /> View Sample Test Result
        </button>
      </motion.div>

      {/* ── Main Dashboard Columns ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Learning Progress Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white rounded-[28px] p-7 md:p-8 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-extrabold text-[#1A202C]">Learning Progress</h3>
              <span className="flex items-center gap-2 text-[#4A5568] font-bold text-[14px]">
                <BookOpen className="w-4 h-4" /> {completedLessons}/{totalLessons}
              </span>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[13px] font-semibold text-[#4A5568]">Overall Completion</span>
                <span className="text-[18px] font-extrabold text-[#1A202C]">{pct}%</span>
              </div>
              <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#305EFF] rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { val: completedLessons, label: "Completed", icon: CheckCircle2 },
                { val: watchedLessons, label: "Watched", icon: Eye },
                { val: totalLessons - completedLessons, label: "Pending", icon: Clock },
              ].map((stat, i) => (
                <div key={i} className="bg-[#F8FAFC] rounded-[20px] p-4 flex flex-col items-start border border-[#E2E8F0]">
                  <stat.icon className="w-5 h-5 text-[#305EFF] mb-3" />
                  <span className="text-[24px] font-extrabold text-[#2C2A29] leading-none mb-1">{stat.val}</span>
                  <span className="text-[12px] font-semibold text-[#7A7571]">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Trend */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-[28px] p-7 md:p-8 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <h3 className="text-[20px] font-extrabold text-[#1A202C] mb-6">Performance Trend</h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={xpHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 'bold', color: '#1A202C' }}
                    itemStyle={{ color: '#305EFF' }}
                  />
                  <Line type="monotone" dataKey="xp" stroke="#305EFF" strokeWidth={3} dot={{ r: 6, fill: "#305EFF", strokeWidth: 2, stroke: "#FFFFFF" }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          
          {/* Placement Readiness */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-white rounded-[28px] p-7 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center relative overflow-hidden"
          >
            <div className="flex justify-between items-center w-full mb-8">
              <h3 className="text-[18px] font-extrabold text-[#1A202C]">Placement Readiness</h3>
            </div>
 
            <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
                <motion.circle 
                  cx="50" cy="50" r="40" fill="transparent" stroke="#305EFF" strokeWidth="8" 
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * dynamicReadiness) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[42px] font-extrabold text-[#1A202C] leading-none">{dynamicReadiness}</span>
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mt-1">out of 100</span>
              </div>
            </div>

            <div className="bg-[#305EFF] text-white px-5 py-1.5 rounded-full text-[13px] font-bold mb-8 shadow-sm">
              {readinessStatus}
            </div>

            <div className="w-full grid grid-cols-3 gap-2">
              {[
                { val: `${learningPct}%`, label: "Learning", icon: "</>" },
                { val: `${projectsPct}%`, label: "Projects", icon: "☐" },
                { val: `${interviewsPct}%`, label: "Interviews", icon: "💬" }
              ].map((s, i) => (
                <div key={i} className="bg-[#F8FAFC] rounded-xl p-3 flex flex-col items-center text-center border border-[#E2E8F0]">
                  <span className="text-[14px] font-black text-[#1A202C] mb-1">{s.val}</span>
                  <span className="text-[10px] font-semibold text-[#4A5568] leading-tight">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Mentor */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#305EFF] to-[#1E3A8A] rounded-[28px] p-7 text-white shadow-lg relative overflow-hidden"
          >
            {/* Background design element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
            
            <div className="relative z-10 flex flex-col">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-5 backdrop-blur-md border border-white/10">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[20px] font-extrabold mb-2">AI Mentor</h3>
              <p className="text-[13px] font-medium text-white/90 leading-relaxed mb-4">
                {insight?.tipOfDay ?? "I analyze your learning patterns to provide personalized recommendations for your career."}
              </p>
              <button className="bg-white text-[#1E3A8A] text-[13px] font-bold py-2 px-4 rounded-full self-start hover:bg-opacity-90 transition-opacity">
                Ask a Question
              </button>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
