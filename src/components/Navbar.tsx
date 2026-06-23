"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    void import("~/utils/api").then(({ isLoggedIn }) => {
      setIsAuthenticated(isLoggedIn());
    });
  }, []);

  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="sticky top-0 right-0 left-0 z-50 flex w-full justify-center px-3 pt-3">
        <nav className="w-full rounded-2xl border border-[#E5E9F0] bg-white py-3 pr-3 pl-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 pl-2 outline-none focus:outline-none"
            >
              <Image
                src="/logo.svg"
                alt="Orvion logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <Image
                src="/logo-text.svg"
                alt="Orvion"
                width={80}
                height={20}
                className="object-contain"
              />
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="pointer-events-none sticky top-0 right-0 left-0 z-50 flex w-full justify-center px-3 pt-3">
      <nav className="pointer-events-auto w-full rounded-2xl border border-[#E5E9F0] bg-[linear-gradient(90deg,#FFFFFF_0%,#F3F6FA_100%)] py-3 pr-3 pl-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 pl-2 outline-none focus:outline-none"
            >
              <Image
                src="/logo.svg"
                alt="Orvion logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <Image
                src="/logo-text.svg"
                alt="Orvion"
                width={80}
                height={20}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden flex-1 justify-center space-x-12 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="text-[15px] font-medium text-[#4A5568] transition-all duration-300 hover:scale-105 hover:text-[#305EFF]"
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden shrink-0 items-center gap-6 md:flex">
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-[15px] font-medium text-[#4A5568] transition-colors hover:text-[#305EFF]"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/#programs"
              className="flex items-center justify-center rounded-[100px] bg-[#305EFF] px-8 py-3 text-[15px] font-medium whitespace-nowrap text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_15px_rgba(48,94,255,0.2)]"
            >
              Explore Programs
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex shrink-0 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-2xl p-2 text-[#4A5568] transition-colors hover:bg-black/5 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto absolute top-[90px] right-4 left-4 overflow-hidden rounded-[32px] border border-black/5 bg-white/95 shadow-2xl backdrop-blur-xl sm:right-6 sm:left-6 md:hidden"
          >
            <div className="space-y-2 px-5 pt-6 pb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-6 py-4 text-center text-[17px] font-medium text-[#4A5568] transition-colors hover:bg-black/5 hover:text-[#305EFF]"
                >
                  {link.text}
                </Link>
              ))}
              <div className="space-y-3 px-4 pt-6">
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full justify-center rounded-[100px] border border-[#E5E9F0] px-6 py-4 text-[17px] font-medium text-[#4A5568] transition-all hover:bg-black/5 hover:text-[#305EFF]"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/#programs"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full justify-center rounded-[100px] bg-[#305EFF] px-6 py-4 text-[17px] font-medium text-white transition-all hover:shadow-md active:scale-95"
                >
                  Explore Programs
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
