import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  // Step 1: email, Step 2: OTP + new password
  const [step, setStep] = useState<1 | 2>(1);

  // Form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Send reset email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Reset code sent! Check your email inbox.");
        setStep(2);
      } else {
        setError(data.detail || "Failed to send reset code.");
      }
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: otp,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login", {
          state: {
            successMessage:
              "Password reset successful! Log in with your new password.",
          },
        });
      } else {
        setError(data.detail || "Failed to reset password.");
      }
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 bg-transparent min-h-screen">
      <div className="w-full max-w-[440px] rounded-3xl bg-[#141414] p-8 sm:p-10 border border-[rgba(255,255,255,0.08)] shadow-2xl">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 mb-6 group">
            <span className="font-bold text-2xl text-[#FAFAFA] tracking-tight">VentureAI</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FE9638] inline-block" />
          </Link>
          <h2 className="text-2xl font-bold text-[#FAFAFA]">
            {step === 1 ? "Reset Password" : "Set New Password"}
          </h2>
          <p className="mt-1 text-sm text-[#9A9A9A]">
            {step === 1
              ? "Enter your work email to receive a recovery code"
              : "Enter the 8-digit verification code sent to your email"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? "w-12 bg-[#FE9638]" : "w-6 bg-[rgba(255,255,255,0.12)]"}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? "w-12 bg-[#FE9638]" : "w-6 bg-[rgba(255,255,255,0.12)]"}`} />
        </div>

        {success && (
          <div className="mb-6 rounded-xl bg-[rgba(52,211,153,0.12)] p-3.5 text-xs text-[#34D399] font-semibold border border-[#34D399]/30">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-[rgba(248,113,113,0.12)] p-3.5 text-xs text-[#F87171] font-semibold border border-[#F87171]/30">
            {error}
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A9A9A] mb-2">
                Work Email
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#FE9638] hover:bg-[#E28528] text-[#0A0A0A] font-bold text-base shadow-lg shadow-[#FE9638]/20 transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? "Sending Code..." : "Send Reset Code →"}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP + New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A9A9A] mb-2">
                Reset Code (OTP)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-base text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 tracking-[0.3em] text-center font-mono font-bold transition-all"
                placeholder="00000000"
                maxLength={8}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A9A9A] mb-2">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#9A9A9A] hover:text-[#FAFAFA] transition-colors focus:outline-none text-xs font-semibold cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A9A9A] mb-2">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#1C1C1C] border border-[rgba(255,255,255,0.12)] text-sm text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FE9638] focus:ring-1 focus:ring-[#FE9638]/30 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#FE9638] hover:bg-[#E28528] text-[#0A0A0A] font-bold text-base shadow-lg shadow-[#FE9638]/20 transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? "Resetting..." : "Set New Password →"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError(null);
                setSuccess(null);
              }}
              className="w-full text-xs text-[#9A9A9A] hover:text-[#FE9638] font-semibold transition-colors mt-2 cursor-pointer"
            >
              ← Resend code to a different email
            </button>
          </form>
        )}

        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[rgba(255,255,255,0.08)]"></div>
          </div>
          <span className="relative bg-[#141414] px-3 text-xs text-[#9A9A9A] font-medium">
            OR
          </span>
        </div>

        <div className="text-center text-sm text-[#9A9A9A]">
          Remember your password?{" "}
          <Link to="/login" className="font-semibold text-[#FE9638] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
