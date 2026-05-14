"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, PlayCircle, Trophy, Video } from "lucide-react";
import Image from "next/image";
import { useProgressStore } from "~/stores/progressStore";
import { programs } from "~/data/programs";

export default function NodeLessonPage() {
  const params = useParams();
  const router = useRouter();
  const { learningPath, completeNode, fetchProgress, subProgress, updateSubProgress } = useProgressStore();
  
  const nodeId = params.nodeId as string;
  const nodeData = learningPath.find(n => n.id === nodeId);
  
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);
  const [isCompletingNode, setIsCompletingNode] = useState(false);

  // Parse nodeId to get curriculum data
  const parts = nodeId.split('_');
  const programId = parts[1];
  const mIdx = parseInt(parts[2]?.replace('m', '') ?? "0");
  const wIdx = parseInt(parts[3]?.replace('w', '') ?? "0");
  
  const program = programs.find(p => p.id === programId);
  const month = program?.curriculum?.[mIdx];
  const week = month?.weeks[wIdx];
  
  const topics = useMemo(() => week?.topics ?? ["Introduction Video", "Core Concepts", "Practical Application"], [week?.topics]);
  const completedTopics = subProgress[nodeId] ?? [];
  const isAllCompleted = completedTopics.length === topics.length;

  useEffect(() => {
    if (learningPath.length === 0) {
      void fetchProgress();
    }
  }, [fetchProgress, learningPath.length]);

  useEffect(() => {
    if (nodeData?.status === 'completed' && completedTopics.length < topics.length) {
      updateSubProgress(nodeId, topics.map((_, i) => i));
    }
  }, [nodeId, nodeData, topics.length, completedTopics.length, updateSubProgress, topics]);

  const markTopicCompleted = (idx: number) => {
    if (!completedTopics.includes(idx)) {
      const newCompleted = [...completedTopics, idx];
      updateSubProgress(nodeId, newCompleted);
      
      if (idx < topics.length - 1) {
        setActiveTopicIdx(idx + 1);
      }
    }
  };

  const handleCompleteNode = async () => {
    if (!nodeData || isCompletingNode) return;
    setIsCompletingNode(true);
    await new Promise(r => setTimeout(r, 800));
    if (nodeData.status !== 'completed') {
      await completeNode(nodeId, nodeData.xpReward);
    }
    setIsCompletingNode(false);
    router.push('/dashboard');
  };

  if (!nodeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#305EFF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#4A5568] font-medium">Loading lesson details...</p>
      </div>
    );
  }

  const progressPct = Math.round((completedTopics.length / topics.length) * 100);

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20 pt-4">
      
      {/* Back Button & Header */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-[#4A5568] hover:text-[#1A202C] font-bold text-[14px] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#F1F5F9] text-[#64748B] text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#E2E8F0]">
            {nodeData.type}
          </span>
          <span className="text-[#305EFF] font-bold text-[14px] flex items-center gap-1">
            <Trophy className="w-4 h-4" /> +{nodeData.xpReward} XP
          </span>
        </div>
        <h1 className="text-3xl md:text-[42px] font-extrabold text-[#1A202C] leading-tight">
          {nodeData.title}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Video Player */}
        <div className="flex-1">
          <div className="bg-[#0F172A] rounded-[24px] aspect-video relative overflow-hidden shadow-2xl flex items-center justify-center group border border-[#1E293B]">
            {/* Mock Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A]/80 to-transparent z-10 pointer-events-none" />
            <Image 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
              alt="Video Thumbnail"
              fill
              className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-500 group-hover:opacity-30"
            />
            
            <div className="relative z-20 flex flex-col items-center text-center p-6">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-[#305EFF] text-white rounded-full flex items-center justify-center mb-6 shadow-[0_8px_30px_rgba(48,94,255,0.4)] transition-transform"
              >
                <PlayCircle className="w-10 h-10 ml-1" />
              </motion.button>
              <h3 className="text-white text-2xl font-bold mb-2">{topics[activeTopicIdx]}</h3>
              <p className="text-white/60 font-medium">Click to play simulated video</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <h4 className="text-[18px] font-bold text-[#1A202C] mb-1">{topics[activeTopicIdx]}</h4>
              <p className="text-[#4A5568] text-[14px] font-medium">Part {activeTopicIdx + 1} of {topics.length}</p>
            </div>
            
            <button
              onClick={() => markTopicCompleted(activeTopicIdx)}
              disabled={completedTopics.includes(activeTopicIdx)}
              className={`px-6 py-3 rounded-full font-bold text-[14px] transition-all flex items-center gap-2 ${
                completedTopics.includes(activeTopicIdx) 
                  ? 'bg-[#F0FDF4] text-[#10B981] cursor-not-allowed'
                  : 'bg-[#305EFF] text-white hover:bg-[#254EDB] shadow-md hover:shadow-lg'
              }`}
            >
              {completedTopics.includes(activeTopicIdx) ? (
                <><CheckCircle2 className="w-5 h-5" /> Completed</>
              ) : (
                'Mark as Completed'
              )}
            </button>
          </div>
        </div>

        {/* Right: Playlist Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full max-h-[600px]">
            
            {/* Playlist Header */}
            <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-extrabold text-[#1A202C] text-[18px] mb-4">Course Contents</h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-bold text-[#4A5568]">Overall Progress</span>
                <span className="text-[13px] font-extrabold text-[#305EFF]">{progressPct}%</span>
              </div>
              <div className="h-2.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  className="h-full bg-gradient-to-r from-[#305EFF] to-[#1E3A8A] rounded-full"
                />
              </div>
            </div>

            {/* Topics List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {topics.map((topic, idx) => {
                const isActive = idx === activeTopicIdx;
                const isCompleted = completedTopics.includes(idx);
                
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTopicIdx(idx)}
                    className={`w-full text-left p-4 rounded-[16px] transition-all flex items-start gap-4 ${
                      isActive 
                        ? 'bg-[#EFF6FF] border-2 border-[#305EFF] shadow-sm' 
                        : isCompleted
                          ? 'bg-transparent border-2 border-transparent hover:bg-[#F1F5F9]'
                          : 'bg-transparent border-2 border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                      ) : isActive ? (
                        <div className="w-5 h-5 rounded-full border-4 border-[#305EFF] bg-white shadow-sm" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#CBD5E1] bg-transparent" />
                      )}
                    </div>
                    <div>
                      <h5 className={`font-bold text-[14px] leading-tight mb-1 ${isActive ? 'text-[#305EFF]' : 'text-[#1A202C]'}`}>
                        {idx + 1}. {topic}
                      </h5>
                      <div className="flex items-center gap-1.5 text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">
                        <Video className="w-3 h-3" />
                        Video • 5:00
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Complete Node Action */}
            <div className="p-6 border-t border-[#E2E8F0] bg-white">
              <button
                onClick={handleCompleteNode}
                disabled={!isAllCompleted || isCompletingNode || nodeData.status === 'completed'}
                className={`w-full py-4 rounded-[16px] font-extrabold text-[15px] transition-all flex justify-center items-center gap-2 ${
                  nodeData.status === 'completed'
                    ? 'bg-[#F0FDF4] text-[#10B981] cursor-not-allowed'
                    : isAllCompleted
                      ? 'bg-[#1A202C] text-white hover:bg-black shadow-lg hover:-translate-y-0.5'
                      : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                {nodeData.status === 'completed' ? (
                  <><CheckCircle2 className="w-5 h-5" /> Module Completed</>
                ) : isCompletingNode ? (
                  'Tracking...'
                ) : isAllCompleted ? (
                  'Complete & Claim XP'
                ) : (
                  'Complete all to finish'
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
