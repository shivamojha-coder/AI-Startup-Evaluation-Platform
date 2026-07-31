import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get email from router state if redirected from Register
  const stateEmail = (location.state as { email?: string } | null)?.email || "";
  const stateSuccessMessage =
    (location.state as { successMessage?: string } | null)?.successMessage || null;

  // Form state
  const [email, setEmail] = useState(stateEmail);
  const [digits, setDigits] = useState<string[]>(Array(8).fill(""));
  const [isEmailReadOnly, setIsEmailReadOnly] = useState(!!stateEmail);

  // Refs for each digit input
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer for resending OTP
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // UI state
  const [success, setSuccess] = useState<string | null>(stateSuccessMessage);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [shake, setShake] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0 && !canResend) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown, canResend]);

  const otp = digits.join("");

  const triggerVerify = async (code: string) => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (code.length < 8) {
      setError("Please enter all 8 digits.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setVerified(true);
        setSuccess("Email verified successfully! Logging you in...");
        setTimeout(() => {
          login(data.user);
          if (data.user.role === "founder") {
            navigate("/founder/dashboard", { replace: true });
          } else if (data.user.role === "investor") {
            navigate("/investor/dashboard", { replace: true });
          }
        }, 1500);
      } else {
        setError(data.detail || "Verification failed. Please check the code and try again.");
        // Shake and clear on error
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setDigits(Array(8).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Unable to reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError(null);

    // Move to next input
    if (digit && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when last digit entered
    if (digit && index === 7) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 8) {
        triggerVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (!pasted) return;
    const newDigits = Array(8).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    const lastFilled = Math.min(pasted.length - 1, 7);
    inputRefs.current[lastFilled]?.focus();
    if (pasted.length === 8) {
      triggerVerify(pasted);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Please enter your email address first.");
      return;
    }
    if (!canResend) return;

    setResending(true);
    setError(null);
    setSuccess(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("A new verification code has been sent to your email.");
        setCanResend(false);
        setResendCooldown(60);
        setDigits(Array(8).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      } else {
        setError(data.detail || "Failed to resend verification code.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError("Unable to reach the server. Please check your connection.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 bg-transparent min-h-screen">
      <div className="w-full max-w-[460px] rounded-3xl bg-[#141414] p-8 sm:p-10 border border-[rgba(255,255,255,0.08)] shadow-2xl">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 mb-6 group">
            <span className="font-bold text-2xl text-[#FAFAFA] tracking-tight">VentureAI</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FE9638] inline-block" />
          </Link>

          <div className="mx-auto mt-4 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(254,150,56,0.12)] text-[#FE9638] border border-[#FE9638]/20">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-[#FAFAFA]">Check your email</h2>
          <p className="mt-1.5 text-sm text-[#9A9A9A]">
            We sent an 8-digit verification code
            {email && (
              <>
                {" "}to <span className="font-semibold text-[#FAFAFA]">{email}</span>
              </>
            )}
          </p>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-[rgba(52,211,153,0.12)] p-3.5 text-xs text-[#34D399] font-semibold border border-[#34D399]/30">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-[rgba(248,113,113,0.12)] p-3.5 text-xs text-[#F87171] font-semibold border border-[#F87171]/30">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-6">
          {!isEmailReadOnly && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A9A9A] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                placeholder="name@fund.com"
                required
              />
            </div>
          )}

          {isEmailReadOnly && (
            <div className="text-center -mt-2">
              <button
                type="button"
                onClick={() => setIsEmailReadOnly(false)}
                className="text-xs font-semibold text-[#FE9638] hover:underline cursor-pointer"
              >
                Wrong email? Change it
              </button>
            </div>
          )}

          <div>
            <label className="block text-center text-xs font-semibold uppercase tracking-wider text-[#9A9A9A] mb-3">
              Verification Code
            </label>
            <div
              className={`flex justify-center gap-1.5 sm:gap-2 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
              onPaste={handlePaste}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  id={`otp-digit-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  disabled={loading || verified}
                  style={{
                    width: "40px",
                    height: "48px",
                    borderRadius: "10px",
                    border: verified
                      ? "2px solid #34D399"
                      : digit
                      ? "2px solid #FE9638"
                      : "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: verified
                      ? "rgba(52,211,153,0.1)"
                      : digit
                      ? "rgba(254,150,56,0.1)"
                      : "#1C1C1C",
                    color: verified ? "#34D399" : "#FAFAFA",
                    textAlign: "center",
                    fontFamily: "monospace",
                    fontSize: "20px",
                    fontWeight: "bold",
                    outline: "none",
                    cursor: loading || verified ? "not-allowed" : "text",
                    opacity: loading || verified ? 0.6 : 1,
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-[#9A9A9A]">
              Auto-submits when complete · 8-digit code · expires in 10 minutes
            </p>
          </div>

          <button
            type="button"
            onClick={() => triggerVerify(otp)}
            disabled={loading || otp.length < 8 || verified}
            className="w-full h-12 rounded-xl bg-[#FE9638] hover:bg-[#E28528] text-[#0A0A0A] font-bold text-base shadow-lg shadow-[#FE9638]/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Verifying...
              </span>
            ) : verified ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verified!
              </span>
            ) : (
              "Verify & Log In →"
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-[#9A9A9A]">
          Didn&apos;t receive the code?{" "}
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resending}
              className="font-semibold text-[#FE9638] hover:underline cursor-pointer"
            >
              {resending ? "Resending..." : "Resend Code"}
            </button>
          ) : (
            <span className="text-[#666666]">
              Resend in <span className="font-mono font-semibold text-[#9A9A9A]">{resendCooldown}s</span>
            </span>
          )}
        </div>

        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[rgba(255,255,255,0.08)]"></div>
          </div>
          <span className="relative bg-[#141414] px-3 text-xs text-[#9A9A9A] font-medium">
            OR
          </span>
        </div>

        <div className="text-center text-sm text-[#9A9A9A] space-y-2">
          <div>
            Already verified?{" "}
            <Link to="/login" className="font-semibold text-[#FE9638] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
