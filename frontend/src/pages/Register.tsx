import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Form fields state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"founder" | "investor">("founder");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors & UI state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [flipDirection, setFlipDirection] = useState<string | null>(null);

  const handleNavigateToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setFlipDirection("out-right");
    setTimeout(() => {
      navigate("/login", { state: { flipIn: "left" } });
    }, 250);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) {
      return { text: "Too weak", bars: 4, activeBars: 0, color: "bg-[#2a2a2a]" };
    }
    if (password.length < 6) {
      return { text: "Weak", bars: 4, activeBars: 1, color: "bg-[#EF4444]" };
    }

    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { text: "Fair", bars: 4, activeBars: 2, color: "bg-[#f97316]" };
    }
    if (score === 3) {
      return { text: "Good", bars: 4, activeBars: 3, color: "bg-[#3b82f6]" };
    }
    return { text: "Strong", bars: 4, activeBars: 4, color: "bg-[#10B981]" };
  };

  const strength = getPasswordStrength();

  // Client side validation
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = "You must accept the Terms of Service and Privacy Policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires_verification) {
          navigate("/verify-otp", {
            state: {
              email: email,
              successMessage:
                data.message || "Account registered successfully! Please enter the 6-digit verification code sent to your email.",
            },
          });
        } else {
          navigate("/login", {
            state: {
              successMessage:
                "Account registered successfully! You can log in now.",
            },
          });
        }
      } else {
        if (data.detail) {
          if (typeof data.detail === "string") {
            setErrors({ general: data.detail });
          } else if (Array.isArray(data.detail)) {
            const fieldErrors: typeof errors = {};
            data.detail.forEach((err: { loc: string[]; msg: string }) => {
              const field = err.loc[err.loc.length - 1];
              if (field === "name") fieldErrors.name = err.msg;
              if (field === "email") fieldErrors.email = err.msg;
              if (field === "password") fieldErrors.password = err.msg;
            });
            setErrors(fieldErrors);
          }
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ general: "Unable to reach the server. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${API_BASE_URL}/auth/oauth/google?role=${role}&redirect_url=${window.location.origin}`;
  };

  const flipClass =
    flipDirection === "out-right"
      ? "animate-flip-out-right"
      : (location.state as { flipIn?: string })?.flipIn === "right"
      ? "animate-flip-in-right"
      : "";

  return (
    <div className="bg-[#0a0a0a] h-screen w-screen overflow-hidden font-sans text-white flex items-center justify-center p-2 sm:p-4 lg:p-6 [perspective:1400px]">
      {/* Centered Large Card fitted to screen without scroll and with 3D Flip Animation */}
      <div className={`max-w-[1100px] w-full h-full max-h-[720px] bg-[#111111] border border-[#1e1e1e] rounded-[16px] shadow-2xl overflow-hidden flex flex-col transition-all ${flipClass}`}>
        
        {/* Top Bar spanning full card width */}
        <div className="w-full border-b border-[#1e1e1e] px-6 py-3 flex items-center justify-between shrink-0 bg-[#111111] z-20">
          <Link to="/" className="flex items-center group">
            <span className="font-bold text-lg text-white tracking-tight">VentureAI</span>
            <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block ml-1" />
          </Link>
          <div className="text-sm text-[#6b7280]">
            Already have an account?{" "}
            <a
              href="/login"
              onClick={handleNavigateToLogin}
              className="text-[#f97316] hover:underline font-medium ml-1 cursor-pointer"
            >
              Log in
            </a>
          </div>
        </div>

        {/* 50/50 Side-by-Side Panels */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT PANEL: Branding, Social Proof & Testimonial (Hidden on mobile) */}
          <div className="hidden lg:flex w-full lg:w-1/2 bg-[#0f0f0f] border-r border-[#1e1e1e] p-6 lg:p-8 flex-col justify-between relative overflow-hidden h-full">
            
            {/* Top Sparkle Badge & Heading */}
            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] text-[11px] font-medium text-[#9ca3af] mb-3.5">
                <span className="text-[#f97316]">✦</span>
                <span>Trusted by 10,500+ founders worldwide</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-white mb-2.5">
                <div>Create your account.</div>
                <div>Raise with <span className="text-[#f97316]">confidence.</span></div>
              </h2>

              <p className="text-[#9ca3af] text-xs leading-relaxed mb-4">
                Join thousands of founders using AI to discover investors, personalize outreach and close funding faster than ever.
              </p>

              {/* Feature Rows */}
              <div className="space-y-3">
                {/* Feature 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-[40px] h-[40px] rounded-[10px] bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-[#f97316]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs sm:text-sm">Smarter Investor Matching</h3>
                    <p className="text-[#6b7280] text-[11px] sm:text-xs mt-0.5">AI finds the right VCs & angels for your startup.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-[40px] h-[40px] rounded-[10px] bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-[#f97316]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs sm:text-sm">Personalized Outreach</h3>
                    <p className="text-[#6b7280] text-[11px] sm:text-xs mt-0.5">Generate high-converting emails in seconds.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-[40px] h-[40px] rounded-[10px] bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-[#f97316]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs sm:text-sm">Pitch Deck Perfection</h3>
                    <p className="text-[#6b7280] text-[11px] sm:text-xs mt-0.5">AI-powered feedback to win more meetings.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing orange globe/network arc illustration */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[460px] h-[280px] pointer-events-none z-0 overflow-hidden">
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

            {/* Testimonial Card */}
            <div className="relative z-10 mt-3 bg-[#141414] border border-[#2a2a2a] rounded-xl p-3 shadow-xl">
              <p className="text-[11px] text-[#d1d5db] italic mb-2 leading-relaxed">
                &ldquo;VentureAI helped us connect with the right investors and raise our seed round in just 3 months.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f97316] to-amber-500 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                  AM
                </div>
                <div>
                  <div className="font-semibold text-white text-[11px]">Arjun Malhotra</div>
                  <div className="text-[#6b7280] text-[10px]">Founder, Nexora</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Form Only */}
          <div className="w-full lg:w-1/2 bg-[#111111] p-5 sm:p-6 lg:p-8 flex flex-col justify-center h-full overflow-hidden">
            <div className="max-w-md w-full mx-auto">
              
              <h1 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
                Create your workspace
              </h1>
              <p className="text-[#6b7280] text-xs sm:text-sm mt-0.5 mb-3.5">
                Access multi-agent due diligence intelligence
              </p>

              {/* Role Toggle with Sliding Animation */}
              <div className="mb-3.5 relative grid grid-cols-2 p-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[10px]">
                {/* Animated Sliding Background Pill */}
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-[#f97316] to-[#ff8c38] rounded-[8px] shadow-lg shadow-orange-500/25 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
                    role === "founder" ? "left-1 translate-x-0" : "left-[calc(50%+2px)] translate-x-0"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setRole("founder")}
                  className={`relative z-10 py-2 px-2.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                    role === "founder" ? "text-white scale-[1.02]" : "text-[#9ca3af] hover:text-white"
                  }`}
                >
                  <span className="text-sm">🚀</span>
                  <span>FOUNDER / STARTUP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("investor")}
                  className={`relative z-10 py-2 px-2.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                    role === "investor" ? "text-white scale-[1.02]" : "text-[#9ca3af] hover:text-white"
                  }`}
                >
                  <span className="text-sm">🏛</span>
                  <span>VC / INVESTOR</span>
                </button>
              </div>

              {errors.general && (
                <div className="mb-3 rounded-lg bg-[rgba(239,68,68,0.12)] p-2.5 text-xs text-[#EF4444] font-semibold border border-[#EF4444]/30">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-2.5">
                {/* 2-Column Row for Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wider text-[#6b7280] mb-1">
                      FULL NAME
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#6b7280] pointer-events-none">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 rounded-[8px] bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    {errors.name && <p className="mt-0.5 text-[10px] text-[#EF4444]">{errors.name}</p>}
                  </div>

                  {/* Work Email */}
                  <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wider text-[#6b7280] mb-1">
                      WORK EMAIL
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#6b7280] pointer-events-none">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 rounded-[8px] bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                    {errors.email && <p className="mt-0.5 text-[10px] text-[#EF4444]">{errors.email}</p>}
                  </div>
                </div>

                {/* 2-Column Row for Password and Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Password */}
                  <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wider text-[#6b7280] mb-1">
                      PASSWORD
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#6b7280] pointer-events-none">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-9 pl-9 pr-12 rounded-[8px] bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
                        placeholder="Strong password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 text-[#6b7280] hover:text-white transition-colors focus:outline-none text-[10px] font-medium cursor-pointer"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <p className="mt-0.5 text-[10px] text-[#EF4444]">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wider text-[#6b7280] mb-1">
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[#6b7280] pointer-events-none">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-9 pl-9 pr-12 rounded-[8px] bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
                        placeholder="Confirm password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 text-[#6b7280] hover:text-white transition-colors focus:outline-none text-[10px] font-medium cursor-pointer"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-0.5 text-[10px] text-[#EF4444]">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Segmented Strength Bar */}
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 w-2/3">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          bar <= strength.activeBars ? strength.color : "bg-[#2a2a2a]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-[#9ca3af]">
                    {strength.text}
                  </span>
                </div>

                {/* Checkbox Terms */}
                <div className="flex items-start gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 rounded bg-[#1a1a1a] border-[#2a2a2a] accent-[#f97316] cursor-pointer shrink-0"
                  />
                  <label htmlFor="agreeTerms" className="text-[11px] text-[#6b7280] leading-tight select-none cursor-pointer">
                    I agree to the{" "}
                    <a href="#terms" className="text-[#f97316] hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#privacy" className="text-[#f97316] hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-[10px] text-[#EF4444]">{errors.agreeTerms}</p>}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-9.5 rounded-[8px] bg-[#f97316] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-orange-500/20 disabled:opacity-50 mt-1.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{loading ? "Creating Account..." : "Create Account"}</span>
                  <span className="font-bold">→</span>
                </button>
              </form>

              {/* OR Divider */}
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 border-t border-[#1e1e1e]" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                  OR
                </span>
                <div className="flex-1 border-t border-[#1e1e1e]" />
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full h-9.5 rounded-[8px] bg-transparent border border-[#2a2a2a] hover:bg-[#1a1a1a] text-white font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Bottom Trust Row */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-[#6b7280] mt-4">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>SOC 2 Certified</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>GDPR Compliant</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>256-bit Encryption</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
