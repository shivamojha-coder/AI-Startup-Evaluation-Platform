import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GlobalFloatingChat } from "./components/chat/GlobalFloatingChat";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { VerifyOTP } from "./pages/VerifyOTP";
import { DashboardFounder } from "./pages/DashboardFounder";
import { StartupCreate } from "./pages/StartupCreate";
import { StartupDetail } from "./pages/StartupDetail";
import { DashboardInvestor } from "./pages/DashboardInvestor";
import { PublicPageLayout } from "./components/PublicPageLayout";
import { FounderLayout } from "./components/FounderLayout";
import { PlatformHomepage } from "./pages/PlatformHomepage";
import { StartupRedirect } from "./pages/StartupRedirect";
import { StartupDocuments } from "./pages/StartupDocuments";
import { InvestorLayout } from "./components/InvestorLayout";
import { StartupComparison } from "./pages/StartupComparison";
import { InvestorReport } from "./pages/InvestorReport";
import { Profile } from "./pages/Profile";
import { ForgotPassword } from "./pages/ForgotPassword";
import { AuthCallback } from "./pages/AuthCallback";

import { Pricing } from "./pages/Pricing";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";



// Auth Layout without header and footer
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-transparent font-sans text-[#FAFAFA] antialiased selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={<PlatformHomepage />}
      />
      <Route
        path="/pricing"
        element={
          <PublicPageLayout>
            <Pricing />
          </PublicPageLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicPageLayout>
            <About />
          </PublicPageLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicPageLayout>
            <Contact />
          </PublicPageLayout>
        }
      />

      {/* Auth Pages */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <AuthLayout>
            <VerifyOTP />
          </AuthLayout>
        }
      />
      <Route
        path="/auth/callback"
        element={<AuthCallback />}
      />
      <Route
        path="/forgot-password"
        element={
          <AuthLayout>
            <ForgotPassword />
          </AuthLayout>
        }
      />

      {/* Dashboards */}
      <Route
        path="/founder/dashboard"
        element={
          <FounderLayout>
            <DashboardFounder />
          </FounderLayout>
        }
      />
      <Route
        path="/founder/startups/new"
        element={
          <FounderLayout>
            <StartupCreate />
          </FounderLayout>
        }
      />
      <Route
        path="/founder/startups/:id"
        element={
          <FounderLayout>
            <StartupDetail />
          </FounderLayout>
        }
      />
      <Route
        path="/founder/startups/:id/documents"
        element={
          <FounderLayout>
            <StartupDocuments />
          </FounderLayout>
        }
      />
      <Route
        path="/founder/startups/:id/report"
        element={
          <FounderLayout>
            <InvestorReport />
          </FounderLayout>
        }
      />
      <Route
        path="/founder/startups/:id/report/:evaluationId"
        element={
          <FounderLayout>
            <InvestorReport />
          </FounderLayout>
        }
      />
      <Route
        path="/founder/startup-redirect"
        element={
          <FounderLayout>
            <StartupRedirect />
          </FounderLayout>
        }
      />
      <Route
        path="/founder/profile"
        element={
          <FounderLayout>
            <Profile />
          </FounderLayout>
        }
      />
      
      {/* Investor App Routes */}
      <Route
        path="/investor/dashboard"
        element={
          <InvestorLayout>
            <DashboardInvestor />
          </InvestorLayout>
        }
      />
      <Route
        path="/investor/compare"
        element={
          <InvestorLayout>
            <StartupComparison />
          </InvestorLayout>
        }
      />
      <Route
        path="/investor/report/:id"
        element={
          <InvestorLayout>
            <InvestorReport />
          </InvestorLayout>
        }
      />
      <Route
        path="/investor/startups/:id/report"
        element={
          <InvestorLayout>
            <InvestorReport />
          </InvestorLayout>
        }
      />
      <Route
        path="/investor/startups/:id/report/:evaluationId"
        element={
          <InvestorLayout>
            <InvestorReport />
          </InvestorLayout>
        }
      />
      <Route
        path="/investor/profile"
        element={
          <InvestorLayout>
            <Profile />
          </InvestorLayout>
        }
      />

      {/* Fallback to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <GlobalFloatingChat />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
