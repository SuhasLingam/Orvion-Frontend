"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { text: "About us", href: "/about" },
  { text: "Programs", href: "/#programs" },
  { text: "Internships", href: "/#internships" },
  { text: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 left-0 right-0 z-50 px-3 pt-3 w-full flex justify-center pointer-events-none">
      <nav className="pointer-events-auto w-full bg-[linear-gradient(90deg,#FFFFFF_0%,#F3F6FA_100%)] rounded-2xl border border-[#E5E9F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] pl-7 pr-3 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-3 pl-2">
              <Image src="/logo.svg" alt="Orvion Logo" width={32} height={32} className="object-contain" />
              <Image src="/logo-text.svg" alt="Orvion" width={80} height={14} className="object-contain" />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="text-orvion-nav-text font-medium text-[15px] hover:text-orvion-primary hover:scale-105 transition-all duration-300"
                style={{ fontFamily: "'SF Pro Display', 'SF Pro', -apple-system, sans-serif" }}
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex shrink-0">
            <Link
              href="/contact"
              className="bg-orvion-primary text-white px-8 py-3 rounded-[100px] font-medium text-[15px] hover:shadow-[0_8px_15px_rgba(48,94,255,0.2)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ fontFamily: "'SF Pro Display', 'SF Pro', -apple-system, sans-serif" }}
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-orvion-nav-text p-2 rounded-2xl focus:outline-none hover:bg-black/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto absolute top-[90px] left-4 right-4 sm:left-6 sm:right-6 md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border border-black/5 shadow-2xl rounded-[32px]"
          >
            <div className="px-5 pt-6 pb-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-6 py-4 rounded-xl text-[17px] font-medium text-orvion-nav-text hover:bg-black/5 hover:text-orvion-primary transition-colors text-center"
                  style={{ fontFamily: "'SF Pro Display', 'SF Pro', -apple-system, sans-serif" }}
                >
                  {link.text}
                </Link>
              ))}
              <div className="pt-6 px-4">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center w-full bg-orvion-primary text-white px-6 py-4 rounded-[100px] font-medium text-[17px] hover:shadow-md transition-all active:scale-95"
                  style={{ fontFamily: "'SF Pro Display', 'SF Pro', -apple-system, sans-serif" }}
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
