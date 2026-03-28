"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Link as LinkIcon, Info, Phone, Mail, User, BookOpen, GraduationCap, Calendar, Briefcase, MessageSquare } from "lucide-react";
import { programs } from "~/data/programs";

export default function EnrollModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openEnrollModal", handleOpen);
    return () => window.removeEventListener("openEnrollModal", handleOpen);
  }, []);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "31370469-766b-4319-9447-8e24aff2bd67");
    formData.append("subject", "New Enrollment Application");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json() as { success: boolean };
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStatus("idle");
      formRef.current?.reset();
    }, 300);
  };

  const inputClasses = "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-[#0B0F19] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#305EFF] focus:ring-4 focus:ring-[#305EFF]/10 transition-all duration-200";
  const selectClasses = "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-11 pr-10 py-3.5 text-[15px] text-[#0B0F19] focus:bg-white focus:outline-none focus:border-[#305EFF] focus:ring-4 focus:ring-[#305EFF]/10 transition-all duration-200 appearance-none";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[100] bg-[#0B0F19]/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl max-h-[95vh] bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl flex flex-col pointer-events-auto overflow-hidden relative"
            >
              {/* Header */}
              <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-[20px] sm:text-[24px] font-extrabold text-[#0B0F19] tracking-tight leading-tight">
                    Program Application
                  </h2>
                  <p className="text-[13px] sm:text-[14px] text-[#64748B] font-medium mt-1">
                    Please fill out the form below to apply
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0B0F19] hover:bg-[#F1F5F9] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar bg-white">
                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 bg-[#EEF2FF] rounded-full flex items-center justify-center mb-6">
                      <Send className="w-8 h-8 text-[#305EFF]" />
                    </div>
                    <h3 className="text-[28px] font-extrabold text-[#0B0F19] mb-3">
                      Application Received!
                    </h3>
                    <p className="text-[16px] text-[#4B5563] mb-8 max-w-md mx-auto">
                      Thank you for applying. Our admission team will review your application and contact you shortly.
                    </p>
                    <button
                      onClick={closeModal}
                      className="bg-[#305EFF] text-white px-8 py-3.5 rounded-xl font-semibold text-[16px] hover:shadow-[0_8px_20px_rgba(48,94,255,0.3)] hover:-translate-y-0.5 transition-all"
                    >
                      Return to Website
                    </button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8 sm:gap-10">
                    
                    {/* Section 1: Personal Details */}
                    <div className="flex flex-col gap-5">
                      <h3 className="text-[14px] font-bold text-[#305EFF] uppercase tracking-wider mb-1 flex items-center gap-2">
                        <span className="w-6 h-px bg-[#305EFF]/20"></span>
                        Personal Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">Full Name *</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                            <input
                              type="text"
                              name="name"
                              required
                              placeholder="Enter your full name"
                              className={inputClasses}
                            />
                          </div>
                        </div>

                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">Email Address *</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                            <input
                              type="email"
                              name="email"
                              required
                              placeholder="Enter your email"
                              className={inputClasses}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">Phone Number *</label>
                          <div className="flex gap-2">
                            <select
                              name="country_code"
                              className="w-[105px] shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-3.5 text-[15px] font-medium text-[#0B0F19] focus:bg-white focus:outline-none focus:border-[#305EFF] transition-all"
                              defaultValue="+91"
                            >
                              <option value="+91">🇮🇳 +91</option>
                              <option value="+1">🇺🇸 +1</option>
                              <option value="+44">🇬🇧 +44</option>
                              <option value="+61">🇦🇺 +61</option>
                              <option value="+971">🇦🇪 +971</option>
                            </select>
                            <div className="relative flex-1">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                              <input
                                type="tel"
                                name="phone"
                                required
                                pattern="[0-9]{7,15}"
                                title="Please enter a valid numeric phone number"
                                placeholder="Phone number"
                                className={`${inputClasses} pl-11`}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">College / Organization</label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                            <input
                              type="text"
                              name="organization"
                              placeholder="Your college or company"
                              className={inputClasses}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Program Details */}
                    <div className="flex flex-col gap-5 pt-2">
                      <h3 className="text-[14px] font-bold text-[#305EFF] uppercase tracking-wider mb-1 flex items-center gap-2">
                        <span className="w-6 h-px bg-[#305EFF]/20"></span>
                        Program Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">Course Selection *</label>
                          <div className="relative">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] z-10" />
                            <select
                              name="course"
                              required
                              className={selectClasses}
                              defaultValue=""
                            >
                              <option value="" disabled>Select a program</option>
                              {programs.map((p) => (
                                <option key={p.id} value={p.title}>{p.title}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1.5L6 6.5L11 1.5" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">Experience Level *</label>
                          <div className="relative">
                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] z-10" />
                            <select
                              name="experience_level"
                              required
                              className={selectClasses}
                              defaultValue=""
                            >
                              <option value="" disabled>Select your status</option>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="Final Year">Final Year</option>
                              <option value="Graduate">Graduate</option>
                              <option value="Working Professional">Working Professional</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1.5L6 6.5L11 1.5" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">Mode of Learning</label>
                          <div className="relative">
                            <select
                              name="learning_mode"
                              className={`${selectClasses} pl-4`}
                              defaultValue="Online"
                            >
                              <option value="Online">Online</option>
                              <option value="Offline">Offline</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1.5L6 6.5L11 1.5" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">Preferred Start Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] z-10" />
                            <input
                              type="date"
                              name="start_date"
                              min={getMinDate()}
                              className={inputClasses}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Links & Message */}
                    <div className="flex flex-col gap-5 pt-2">
                      <h3 className="text-[14px] font-bold text-[#305EFF] uppercase tracking-wider mb-1 flex items-center gap-2">
                        <span className="w-6 h-px bg-[#305EFF]/20"></span>
                        Links & Additional Info
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">Resume / CV Link</label>
                          <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                            <input
                              type="url"
                              name="resume_link"
                              placeholder="Google Drive, Dropbox, etc."
                              className={inputClasses}
                            />
                          </div>
                        </div>

                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-[13px] font-bold text-[#1E293B] ml-1">LinkedIn / Portfolio URL</label>
                          <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                            <input
                              type="url"
                              name="portfolio"
                              placeholder="https://linkedin.com/in/..."
                              className={inputClasses}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-[#1E293B] ml-1">Additional Message</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-[18px] w-5 h-5 text-[#94A3B8]" />
                          <textarea
                            name="message"
                            rows={3}
                            placeholder="Why are you interested in this course?"
                            className={`${inputClasses} resize-none min-h-[100px]`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col gap-5 pt-4 border-t border-[#E2E8F0]">
                      <div className="flex items-start gap-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                        <input
                          type="checkbox"
                          name="terms"
                          id="terms"
                          required
                          className="mt-1 w-5 h-5 text-[#305EFF] bg-white border-gray-300 rounded focus:ring-[#305EFF]"
                        />
                        <label htmlFor="terms" className="text-[13px] text-[#4B5563] leading-relaxed cursor-pointer select-none">
                          I agree to the Terms and Conditions and Privacy Policy. I consent to being contacted by the admission team regarding this application.
                        </label>
                      </div>

                      {status === "error" && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[14px] font-medium border border-red-100 flex items-center gap-3">
                          <Info className="w-5 h-5 shrink-0" />
                          There was an error submitting your application. Please try again.
                        </div>
                      )}

                      <div className="flex justify-end gap-3 mt-2">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-6 py-4 rounded-xl font-bold text-[15px] text-[#475569] hover:bg-[#F1F5F9] transition-all hidden sm:block"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="w-full sm:w-auto min-w-[200px] bg-[#305EFF] text-white py-4 px-8 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-[0_8px_20px_rgba(48,94,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                        >
                          {status === "sending" ? (
                            "Submitting..."
                          ) : (
                            <>Submit Application <Send className="w-4 h-4 ml-1" /></>
                          )}
                        </button>
                      </div>
                    </div>

                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
