"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "~/utils/supabase/client";
import { useUserStore } from "~/stores/userStore";
import { useProgressStore } from "~/stores/progressStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Check initial session
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        // Fire off data fetches when logged in
        void useUserStore.getState().fetchProfile();
        void useProgressStore.getState().fetchProgress();
      } else {
        setIsAuthenticated(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push(`/auth?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#305EFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{isAuthenticated ? children : null}</>;
}
