"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Mail, User, Sparkles } from "lucide-react";
import { apiLogin, apiRegister, saveToken } from "~/utils/api";

function AuthContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") ?? "/dashboard";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        // ── FastAPI JWT login ──────────────────────────────────────────
        const res = await apiLogin({ email, password });
        saveToken(res.access_token);
      } else {
        // ── Registration via apiRegister → auto-login for token ────────
        const regResult = await apiRegister({ name, email, password });
        if (regResult.access_token) {
          // Backend returned token directly — save it
          saveToken(regResult.access_token);
        } else {
          // Backend didn't return token — auto-login to get one
          const tokenRes = await apiLogin({ email, password });
          saveToken(tokenRes.access_token);
        }
      }

      router.replace(returnUrl);
    } catch (error) {
      const authError = error as { message?: string };
      setErrorMsg(authError.message ?? "An error occurred during authentication.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-5 font-['SF_Pro_Display'] relative overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#305EFF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#1E3A8A]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-white border border-[#E2E8F0] rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Sparkles className="w-6 h-6 text-[#305EFF]" />
          </div>
          <h1 className="text-[28px] font-extrabold text-[#1A202C] tracking-tight">
            {isLogin ? "Welcome back" : "Join Orvion"}
          </h1>
          <p className="text-[14px] text-[#64748B] font-medium mt-2 leading-relaxed">
            {isLogin
              ? "Sign in to continue your learning journey"
              : "Create an account to start mastering your skills"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-[#94A3B8]" />
                </div>
                <input
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-[#1A202C] placeholder-[#94A3B8] focus:outline-none focus:border-[#305EFF] focus:ring-1 focus:ring-[#305EFF] transition-all"
                  placeholder="Full Name"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-[#94A3B8]" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-[#1A202C] placeholder-[#94A3B8] focus:outline-none focus:border-[#305EFF] focus:ring-1 focus:ring-[#305EFF] transition-all"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-[#94A3B8]" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-[#1A202C] placeholder-[#94A3B8] focus:outline-none focus:border-[#305EFF] focus:ring-1 focus:ring-[#305EFF] transition-all"
              placeholder="Password"
            />
          </div>

          {errorMsg && (
            <p className="text-[13px] font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#305EFF] hover:bg-[#254EDB] disabled:opacity-70 text-white font-extrabold text-[15px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#E2E8F0] pt-6">
          <p className="text-[14px] text-[#64748B] font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}
              className="text-[#305EFF] font-bold hover:underline underline-offset-4"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="w-8 h-8 border-4 border-[#305EFF] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
