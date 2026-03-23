import "~/styles/globals.css";

import { type Metadata } from "next";
import { Montserrat, Nunito } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Orvion | Industry Ready Tech Programs",
    template: "%s | Orvion",
  },
  description:
    "Orvion offers live, industry-designed programs in UI/UX Design, DevOps, AI & Data Science, Cybersecurity, and Quantum Computing. Get real mentorship, real projects, and land your tech career.",
  keywords: [
    "tech internship",
    "UI UX design course",
    "DevOps training",
    "AI data science program",
    "cybersecurity course",
    "quantum computing",
    "ed-tech India",
    "tech career",
    "Orvion",
  ],
  authors: [{ name: "Orvion" }],
  creator: "Orvion",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Orvion",
    title: "Orvion — Industry-Ready Tech Programs",
    description:
      "Live, outcome-based tech programs with expert mentorship. Launch your career in UI/UX, DevOps, AI, Cybersecurity, or Quantum Computing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orvion — Industry-Ready Tech Programs",
    description:
      "Live, outcome-based tech programs with expert mentorship. Launch your career in UI/UX, DevOps, AI, Cybersecurity, or Quantum Computing.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
    shortcut: "/favicon.ico",
  },
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${nunito.variable} scroll-smooth`}>
      <body className="antialiased selection:bg-orvion-primary selection:text-white" style={{ fontFamily: "var(--font-body)" }}>
        <TRPCReactProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
