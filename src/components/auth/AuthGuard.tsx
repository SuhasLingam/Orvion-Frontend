"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isLoggedIn } from "~/utils/api";
import { useUserStore } from "~/stores/userStore";
import { useProgressStore } from "~/stores/progressStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = isLoggedIn();
    setIsAuthenticated(loggedIn);
    setChecked(true);

    if (loggedIn) {
      // Bootstrap both stores on auth confirmation
      void useUserStore.getState().fetchProfile();
      void useProgressStore.getState().fetchProgress();
    }
  }, []);

  useEffect(() => {
    if (checked && !isAuthenticated) {
      router.push(`/auth?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [checked, isAuthenticated, router, pathname]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#305EFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{isAuthenticated ? children : null}</>;
}
