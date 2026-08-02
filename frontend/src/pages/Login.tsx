import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShinyText } from "../components/ui/ShinyText";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "founder") {
        navigate("/founder/dashboard", { replace: true });
      } else if (user.role === "investor") {
        navigate("/investor/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  // Form fields state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [flipDirection, setFlipDirection] = useState<string | null>(null);

  // Capture redirection states (e.g. from Register success)
  useEffect(() => {
    const state = location.state as { successMessage?: string } | null;
    if (state?.successMessage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuccess(state.successMessage);
    }
  }, [location]);

  const handleNavigateToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setFlipDirection("out-left");
    setTimeout(() => {
      navigate("/register", { state: { flipIn: "right" } });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        if (data.user.role === "founder") {
          navigate("/founder/dashboard");
        } else if (data.user.role === "investor") {
          navigate("/investor/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(data.detail || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;
    setLoading(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        navigate("/verify-otp", { state: { email } });
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to resend OTP.");
      }
    } catch (err) {
      setError("Network error while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${API_BASE_URL}/auth/oauth/google?role=founder&redirect_url=${window.location.origin}`;
  };

  const flipClass =
    flipDirection === "out-left"
      ? "animate-flip-out-left"
      : (location.state as { flipIn?: string })?.flipIn === "left"
      ? "animate-flip-in-left"
      : "";

  return (
    <div className="bg-transparent h-screen w-screen overflow-hidden font-sans text-white flex items-center justify-center p-3 sm:p-4 lg:p-6 [perspective:1400px]">
      {/* Centered Large Card fitted to screen with 3D Flip Animation */}
      <div className={`max-w-[1100px] w-full h-full max-h-[680px] bg-[#111111] border border-[#1e1e1e] rounded-[16px] shadow-2xl overflow-hidden flex flex-col transition-all ${flipClass}`}>
        
        {/* Top Bar spanning full card width */}
        <div className="w-full border-b border-[#1e1e1e] px-6 py-3.5 flex items-center justify-between shrink-0 bg-[#111111] z-20">
          <Link to="/" className="flex items-center group">
            <span className="font-bold text-lg text-white tracking-tight">
              <ShinyText text="VentureAI" baseColor="rgba(255,255,255,0.85)" shineColor="#FFFFFF" speed={5} />
            </span>
            <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block ml-1" />
          </Link>
          <div className="text-sm text-[#6b7280]">
            New here?{" "}
            <a
              href="/register"
              onClick={handleNavigateToRegister}
              className="text-[#f97316] hover:underline font-medium ml-1 cursor-pointer"
            >
              Create account
            </a>
          </div>
        </div>

        {/* 50/50 Side-by-Side Panels */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT PANEL: Branding & Social Proof (Hidden on mobile) */}
          <div className="hidden lg:flex w-full lg:w-1/2 bg-[#0f0f0f] border-r border-[#1e1e1e] p-6 lg:p-10 flex-col justify-between relative overflow-hidden h-full">
            
            {/* Main Branding & Features */}
            <div className="relative z-10 space-y-5 max-w-md">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white">
                <div>AI-Powered</div>
                <div className="text-[#f97316]">Investor Discovery.</div>
                <div>Faster Fundraising.</div>
              </h2>

              <p className="text-[#9ca3af] text-xs sm:text-sm leading-relaxed">
                VentureAI helps founders find ideal investors, personalize outreach and close funding faster with the power of AI.
              </p>

              {/* Feature Rows */}
              <div className="space-y-3.5 pt-1">
                {/* Feature 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-[42px] h-[42px] rounded-[10px] bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-[#f97316]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs sm:text-sm">Find the right VCs & angels</h3>
                    <p className="text-[#6b7280] text-[11px] sm:text-xs mt-0.5">Access 500K+ verified investors worldwide.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-[42px] h-[42px] rounded-[10px] bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-[#f97316]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs sm:text-sm">AI-Powered Matching</h3>
                    <p className="text-[#6b7280] text-[11px] sm:text-xs mt-0.5">Get smarter matches based on your startup.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-[42px] h-[42px] rounded-[10px] bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-[#f97316]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs sm:text-sm">Perfect Your Pitch</h3>
                    <p className="text-[#6b7280] text-[11px] sm:text-xs mt-0.5">AI agents help you craft investor-ready decks.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing orange globe/network arc illustration */}
            <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[480px] h-[300px] pointer-events-none z-0 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_bottom,rgba(249,115,22,0.35)_0%,transparent_70%)] rounded-t-full blur-2xl" />
              <svg className="w-full h-full opacity-40 text-[#f97316]" viewBox="0 0 400 200" fill="none">
                <path d="M 20 200 A 180 180 0 0 1 380 200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
                <path d="M 60 200 A 140 140 0 0 1 340 200" stroke="currentColor" strokeWidth="1.5" />
                <path d="M 100 200 A 100 100 0 0 1 300 200" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
                <circle cx="200" cy="20" r="3.5" fill="currentColor" />
                <circle cx="110" cy="80" r="2.5" fill="currentColor" />
                <circle cx="290" cy="80" r="2.5" fill="currentColor" />
                <circle cx="65" cy="140" r="2" fill="currentColor" />
                <circle cx="335" cy="140" r="2" fill="currentColor" />
                <line x1="200" y1="20" x2="110" y2="80" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
                <line x1="200" y1="20" x2="290" y2="80" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
                <line x1="110" y1="80" x2="65" y2="140" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
                <line x1="290" y1="80" x2="335" y2="140" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* RIGHT PANEL: Form Only */}
          <div className="w-full lg:w-1/2 bg-[#111111] p-6 sm:p-8 lg:p-10 flex flex-col justify-center h-full overflow-hidden">
            <div className="max-w-md w-full mx-auto">
              
              <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">
                Welcome back
              </h1>
              <p className="text-[#6b7280] text-xs sm:text-sm mt-1 mb-5">
                Sign in to your deal flow workspace
              </p>

              {success && (
                <div className="mb-4 rounded-lg bg-[rgba(16,185,129,0.12)] p-3 text-xs text-[#10B981] font-semibold border border-[#10B981]/30">
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-lg bg-[rgba(239,68,68,0.12)] p-3 text-xs text-[#EF4444] font-semibold border border-[#EF4444]/30 flex flex-col gap-2">
                  <span>{error}</span>
                  {error.toLowerCase().includes("confirmed") && (
                    <button 
                      type="button"
                      onClick={handleResendOTP}
                      className="text-[#f97316] underline hover:text-orange-400 self-start text-xs font-bold cursor-pointer"
                    >
                      Resend Verification OTP
                    </button>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Work Email */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#6b7280] mb-1">
                    WORK EMAIL
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-[#6b7280] pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-[8px] bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
                      placeholder="name@fund.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                      PASSWORD
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-[#f97316] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-[#6b7280] pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-10 pl-10 pr-14 rounded-[8px] bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#6b7280] hover:text-white transition-colors focus:outline-none text-xs font-medium cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1a1a1a] border-[#2a2a2a] accent-[#f97316] cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-[#6b7280] select-none cursor-pointer">
                    Remember me
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 rounded-[8px] bg-[#f97316] hover:bg-orange-600 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-orange-500/20 disabled:opacity-50 mt-1.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{loading ? "Signing in..." : "Sign In"}</span>
                  <span className="font-bold">→</span>
                </button>
              </form>

              {/* OR Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 border-t border-[#1e1e1e]" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
                  OR
                </span>
                <div className="flex-1 border-t border-[#1e1e1e]" />
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-10 rounded-[8px] bg-transparent border border-[#2a2a2a] hover:bg-[#1a1a1a] text-white font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Footer Trust Row */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#6b7280] text-center">
                <svg className="w-3.5 h-3.5 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Your data is secure and encrypted.</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
