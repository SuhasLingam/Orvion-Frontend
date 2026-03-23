"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

const contactCards = [
  {
    icon: Mail,
    title: "Email Us",
    value: "hello@orvion.in",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+91 98765 43210",
    sub: "Mon–Sat, 10 AM – 7 PM",
  },
  {
    icon: MapPin,
    title: "Find Us",
    value: "Bengaluru, Karnataka",
    sub: "India",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "31370469-766b-4319-9447-8e24aff2bd67");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json() as { success: boolean };
      if (data.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-full min-h-screen bg-white">

      {/* Hero */}
      <div className="w-full px-3 pt-3 pb-0">
        <section
          className="w-full rounded-[28px] px-8 pt-20 pb-20 md:px-20 text-center"
          style={{ background: "linear-gradient(107.9deg, #EBF0F5 53.99%, #B1C3FF 109.34%)" }}
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block text-[13px] font-semibold text-[#305EFF] tracking-widest uppercase mb-6 bg-white/80 px-4 py-1.5 rounded-full border border-[#C5D3FF]"
          >
            Contact
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[48px] md:text-[68px] font-extrabold leading-[1.05] tracking-tight mb-5 text-[#0B0F19]"
          >
            We&apos;d love to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(180deg, #1A3175 0%, #305EFF 100%)" }}
            >
              hear from you
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[17px] md:text-[19px] text-[#4B5563] font-medium leading-[1.6] max-w-lg mx-auto"
          >
            Whether you have questions about a program, need career guidance, or just want to learn more — reach out!
          </motion.p>
        </section>
      </div>

      {/* Contact Cards */}
      <div className="w-full px-3 py-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {contactCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-8 hover:shadow-[0_8px_24px_rgba(48,94,255,0.07)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-[#EEF2FF] flex items-center justify-center mb-5">
                <card.icon className="w-6 h-6 text-[#305EFF]" strokeWidth={2} />
              </div>
              <h3 className="text-[16px] font-bold text-[#0B0F19] mb-1">{card.title}</h3>
              <p className="text-[17px] font-semibold text-[#305EFF] mb-1">{card.value}</p>
              <p className="text-[13px] text-[#6B7280]">{card.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="w-full px-3 pb-20">
        <div className="max-w-[640px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[28px] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
          >
            <h2 className="text-[28px] font-extrabold text-[#0B0F19] mb-2">Send us a message</h2>
            <p className="text-[15px] text-[#6B7280] mb-8">We typically respond within one business day.</p>

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Send className="w-7 h-7 text-[#305EFF]" />
                </div>
                <h3 className="text-[22px] font-bold text-[#0B0F19] mb-2">Message Sent!</h3>
                <p className="text-[15px] text-[#6B7280] mb-6">Thanks for reaching out. We&apos;ll be in touch soon.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-[14px] font-semibold text-[#305EFF] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#374151]">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-white border border-[#DDE2EE] rounded-xl px-4 py-3.5 text-[15px] text-[#0B0F19] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#305EFF] focus:shadow-[0_0_0_3px_rgba(48,94,255,0.1)] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#374151]">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full bg-white border border-[#DDE2EE] rounded-xl px-4 py-3.5 text-[15px] text-[#0B0F19] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#305EFF] focus:shadow-[0_0_0_3px_rgba(48,94,255,0.1)] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#374151]">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-white border border-[#DDE2EE] rounded-xl px-4 py-3.5 text-[15px] text-[#0B0F19] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#305EFF] focus:shadow-[0_0_0_3px_rgba(48,94,255,0.1)] resize-none transition-all"
                  />
                </div>

                {status === "error" && (
                  <p className="text-[13px] text-red-500 font-medium">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-2 w-full bg-[#305EFF] text-white py-4 rounded-xl font-semibold text-[16px] flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-[0_8px_20px_rgba(48,94,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  <Send className="w-4 h-4" />
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

    </div>
  );
}
