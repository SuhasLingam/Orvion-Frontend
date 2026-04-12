import type { ReactNode } from "react";

/**
 * This layout intentionally renders ONLY the children — no Navbar, Footer,
 * or ScrollProgress — so the learn page can manage its own full-screen layout.
 */
export default function LearnLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
