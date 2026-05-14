"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { programs } from "~/data/programs";
import { CreditCard, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  
  const [selectedProgram, setSelectedProgram] = useState(programs[0]?.id ?? "");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Read the query string manually to avoid Next.js useSearchParams Turbopack panics
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const programParam = params.get("program");
      if (programParam) {
        setSelectedProgram(programParam);
      }
    }
  }, []);

  const selectedProgramData = programs.find((p) => p.id === selectedProgram) ?? programs[0];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramData) return;
    setIsProcessing(true);
    
    // Mock processing delay
    setTimeout(() => {
      // Store pending payment in localStorage
      localStorage.setItem("pending_enrollment", selectedProgramData.id);
      localStorage.setItem("pending_enrollment_title", selectedProgramData.title);
      
      // Redirect to auth
      router.push(`/auth?returnUrl=/dashboard&enroll=true`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['SF_Pro_Display'] pt-24 pb-12 flex flex-col items-center">
      {/* Header */}
      <div className="mb-12 text-center flex flex-col items-center">
        <Link href="/">
          <Image src="/logo.svg" alt="Orvion Logo" width={56} height={56} className="mb-6 object-contain" />
        </Link>
        <h1 className="text-3xl md:text-[42px] font-black text-[#1A202C] mb-3 tracking-tight">Secure Checkout</h1>
        <p className="text-[#64748B] text-[16px] font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#10B981]" /> Your payment is 256-bit encrypted.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Col: Program Selection & Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-[#1A202C] uppercase tracking-widest text-[14px]">Order Summary</h2>
          
          <div className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
            <label className="block text-[12px] font-black text-[#305EFF] mb-4 uppercase tracking-widest">
              Select Program
            </label>
            <div className="relative mb-8">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-[16px] font-bold text-[#1A202C] focus:outline-none focus:border-[#305EFF] focus:ring-2 focus:ring-[#305EFF]/10 appearance-none cursor-pointer transition-all"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="space-y-4 border-t border-[#F1F5F9] pt-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#305EFF]" />
                <span className="text-[15px] text-[#4A5568] font-bold">Full lifetime access</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#305EFF]" />
                <span className="text-[15px] text-[#4A5568] font-bold">1-on-1 AI Mentorship</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#305EFF]" />
                <span className="text-[15px] text-[#4A5568] font-bold">Placement Assistance</span>
              </div>
            </div>

            <div className="mt-10 border-t border-[#F1F5F9] pt-8 flex justify-between items-end">
              <span className="text-[14px] font-black text-[#94A3B8] uppercase tracking-widest">Total Amount</span>
              <span className="text-[36px] font-black text-[#1A202C] leading-none tracking-tight">₹{selectedProgramData?.id === 'fsd' ? '4,999' : '5,999'}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Mock Payment Form */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-[#1A202C] uppercase tracking-widest text-[14px]">Payment Details</h2>

          <form onSubmit={handlePayment} className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
            <div className="mb-8 flex gap-2 p-1.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              {['card', 'upi', 'netbanking'].map((method) => (
                <div 
                  key={method} 
                  className={`flex-1 text-center py-3 rounded-xl text-[13px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                    method === 'card' 
                      ? 'bg-[#305EFF] text-white shadow-lg shadow-[#305EFF]/20' 
                      : 'text-[#94A3B8] hover:text-[#305EFF]'
                  }`}
                >
                  {method === 'card' ? 'Card' : method === 'upi' ? 'UPI' : 'Bank'}
                </div>
              ))}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-black text-[#64748B] mb-2 uppercase tracking-widest ml-1">Card Number (Mock)</label>
                <div className="relative">
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                  <input type="text" placeholder="4242 4242 4242 4242" required className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-14 pr-5 py-4 text-[15px] font-bold text-[#1A202C] focus:outline-none focus:border-[#305EFF] focus:ring-2 focus:ring-[#305EFF]/10 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-black text-[#64748B] mb-2 uppercase tracking-widest ml-1">Expiry</label>
                  <input type="text" placeholder="MM/YY" required className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-[15px] font-bold text-[#1A202C] focus:outline-none focus:border-[#305EFF] focus:ring-2 focus:ring-[#305EFF]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-[12px] font-black text-[#64748B] mb-2 uppercase tracking-widest ml-1">CVC</label>
                  <input type="password" placeholder="123" required maxLength={4} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-[15px] font-bold text-[#1A202C] focus:outline-none focus:border-[#305EFF] focus:ring-2 focus:ring-[#305EFF]/10 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-black text-[#64748B] mb-2 uppercase tracking-widest ml-1">Cardholder Name</label>
                <input type="text" placeholder="John Doe" required className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-[15px] font-bold text-[#1A202C] focus:outline-none focus:border-[#305EFF] focus:ring-2 focus:ring-[#305EFF]/10 transition-all" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full mt-10 bg-[#305EFF] text-white py-5 rounded-[20px] font-black text-[16px] uppercase tracking-widest hover:bg-[#254EDB] hover:shadow-xl hover:shadow-[#305EFF]/20 transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" /> Pay Securely
                </>
              )}
            </button>
            <p className="text-center mt-6 text-[12px] font-bold text-[#94A3B8] uppercase tracking-tighter">
              Guaranteed Safe & Secure Transaction
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
