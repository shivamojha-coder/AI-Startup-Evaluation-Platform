import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShinyText } from "./ui/ShinyText";
import { 
  LayoutDashboard, 
  Search, 
  FolderHeart, 
  Calendar,
  User, 
  LogOut,
  Sparkles
} from "lucide-react";

export const InvestorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { name: "Dealflow", path: "/investor/dashboard", icon: LayoutDashboard },
    { name: "Discover", path: "/investor/dashboard#discover", icon: Search },
    { name: "My Shortlist", path: "/investor/dashboard#shortlist", icon: FolderHeart },
    { name: "Meetings", path: "/investor/dashboard#meetings", icon: Calendar },
    { name: "Profile", path: "/investor/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-transparent text-[#ffffff] font-sans antialiased selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      {/* Left Sidebar: fixed, 240px wide, full height */}
      <aside className="w-[240px] bg-[#0f0f0f] border-r border-[#1e1e1e] flex flex-col fixed inset-y-0 left-0 z-50">
        
        {/* Top Logo */}
        <div className="p-[24px] pb-[20px] flex items-center gap-2.5 border-b border-[#1e1e1e]">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgba(254,150,56,0.15)] text-[#FE9638] transition-transform group-hover:scale-105">
              <span className="text-sm font-black">V</span>
            </div>
            <span className="text-lg font-black tracking-tight text-[#FAFAFA]">
              <ShinyText text="Venture" baseColor="rgba(250,250,250,0.85)" shineColor="#FFFFFF" speed={5} /><ShinyText text="AI" baseColor="#FE9638" shineColor="#FFFFFF" speed={5} />
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-[#1e1e1e] flex items-center gap-3">
          {user?.profile_photo_url ? (
            <img src={user.profile_photo_url} alt={user?.name || "Investor"} className="h-10 w-10 shrink-0 object-cover rounded-full border border-[rgba(255,255,255,0.1)]" />
          ) : (
            <div className="h-10 w-10 shrink-0 rounded-full bg-[#1C1C1C] border border-[rgba(255,255,255,0.1)] flex items-center justify-center font-bold text-[#FE9638]">
              {user?.name?.charAt(0) || "I"}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[#FAFAFA] truncate">{user?.name || "Investor"}</p>
            <p className="text-[10px] uppercase font-bold text-[#FE9638] tracking-wider truncate">VC Partner</p>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-[16px] mb-2 text-[10px] font-medium tracking-wider text-[#6b7280]">
            INVESTOR WORKSPACE
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const itemPathBase = item.path.split('#')[0].split('?')[0];
              const itemHash = item.path.includes('#') ? '#' + item.path.split('#')[1] : '';
              
              const isActive = itemHash 
                ? location.pathname === itemPathBase && location.hash === itemHash
                : location.pathname === item.path && !location.hash;

              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-[16px] py-[12px] text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[rgba(254,150,56,0.15)] text-[#FE9638] border-l-[3px] border-[#FE9638]"
                      : "text-white hover:bg-white/5 border-l-[3px] border-transparent"
                  }`}
                >
                  <Icon className={`w-[20px] h-[20px] shrink-0 ${isActive ? "text-[#FE9638]" : "text-[#9ca3af]"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom (pinned) */}
        <div className="p-3 pt-2 border-t border-[#1e1e1e] space-y-2 shrink-0">
          <div className="bg-[#111111] border border-[rgba(254,150,56,0.3)] rounded-[12px] p-3.5 text-left mb-2">
            <div className="flex items-center gap-2 text-[#FE9638] mb-1">
              <Sparkles className="w-[18px] h-[18px]" />
              <span className="text-xs font-bold text-white">AI Deal Sourcing</span>
            </div>
            <p className="text-[10px] text-[#9ca3af] leading-relaxed">
              VentureAI is automatically sourcing and vetting new startups for you.
            </p>
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

      {/* Main Content Area: fills remaining width, scrollable */}
      <main className="flex-1 ml-[240px] flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
};
