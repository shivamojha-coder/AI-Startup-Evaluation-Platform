import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShinyText } from "./ui/ShinyText";
import { 
  LayoutDashboard, 
  Building2, 
  FileUp, 
  FileText, 
  LineChart, 
  Users,
  User, 
  LogOut,
  Crown
} from "lucide-react";

export const FounderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/founder/dashboard", icon: LayoutDashboard },
    { name: "My Startup", path: "/founder/startup-redirect", icon: Building2 },
    { name: "Upload Documents", path: "/founder/startup-redirect?action=documents", icon: FileUp },
    { name: "Reports", path: "/founder/startup-redirect?action=report", icon: FileText },
    { name: "Analytics", path: "#analytics", icon: LineChart },
    { name: "Investors", path: "#investors", icon: Users },
    { name: "Profile", path: "/founder/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-transparent text-[#ffffff] font-sans antialiased selection:bg-[rgba(249,115,22,0.2)] selection:text-[#f97316]">
      {/* Left Sidebar: fixed, 240px wide, full height */}
      <aside className="w-[240px] bg-[#0f0f0f] border-r border-[#1e1e1e] flex flex-col fixed inset-y-0 left-0 z-50">
        
        {/* Top Logo */}
        <div className="p-[24px] pb-[20px] flex items-center gap-2.5 border-b border-[#1e1e1e]">
          <Link to="/" className="flex items-center gap-2 group">
            {/* Orange V chevron icon */}
            <svg className="w-6 h-6 text-[#f97316]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-white">
              <ShinyText text="VentureAI" baseColor="rgba(255,255,255,0.85)" shineColor="#FFFFFF" speed={5} />
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-[16px] mb-2 text-[10px] font-medium tracking-wider text-[#6b7280]">
            FOUNDER WORKSPACE
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path.includes("?") && location.pathname + location.search === item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-[16px] py-[12px] text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[rgba(249,115,22,0.15)] text-[#f97316] border-l-[3px] border-[#f97316]"
                      : "text-white hover:bg-white/5 border-l-[3px] border-transparent"
                  }`}
                >
                  <Icon className={`w-[20px] h-[20px] shrink-0 ${isActive ? "text-[#f97316]" : "text-[#9ca3af]"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom (pinned) */}
        <div className="p-3 pt-2 border-t border-[#1e1e1e] space-y-2 shrink-0">
          {/* Upgrade card */}
          <div className="bg-[#111111] border border-[rgba(249,115,22,0.3)] rounded-[12px] p-3.5 text-left">
            <div className="flex items-center gap-2 text-[#f97316] mb-1">
              <Crown className="w-[20px] h-[20px]" />
              <span className="text-xs font-bold text-white">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
              Unlock unlimited AI deal flow reports & VC introductions.
            </p>
            <Link
              to="/pricing"
              className="block w-full text-center py-1.5 px-3 rounded-[8px] border border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10 text-xs font-bold transition-all duration-150"
            >
              Upgrade Now →
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-[16px] py-2 text-sm font-medium text-[#ef4444] hover:bg-white/5 rounded-lg transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-[20px] h-[20px] shrink-0" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area: fills remaining width, scrollable, padding 32px */}
      <main className="flex-1 ml-[240px] flex flex-col min-h-screen p-[32px] overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
