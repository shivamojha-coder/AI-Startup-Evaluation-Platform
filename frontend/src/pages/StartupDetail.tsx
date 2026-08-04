import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStartup } from "../api/startups";
import type { StartupResponse } from "../schemas/startup";

// Components
import { StartupHero } from "../components/startup/StartupHero";
import { QuickStatusCards } from "../components/startup/QuickStatusCards";
import { BasicInfoCard } from "../components/startup/BasicInfoCard";
import { CompanyDetailsCard } from "../components/startup/CompanyDetailsCard";
import { OnlinePresenceCard } from "../components/startup/OnlinePresenceCard";
import { FounderCard } from "../components/startup/FounderCard";
import { DocumentCard } from "../components/startup/DocumentCard";
import { InsightCard } from "../components/startup/InsightCard";
import { TimelineCard } from "../components/startup/TimelineCard";
import { ActionCard } from "../components/startup/ActionCard";

export const StartupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [startup, setStartup] = useState<StartupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "founder")) {
      navigate("/login");
      return;
    }

    if (id && user && user.role === "founder") {
      fetchData();
    }
  }, [id, user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const startupData = await getStartup(id!);
      setStartup(startupData);
    } catch (err: any) {
      setApiError(err.message || "Failed to load startup details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Placeholder for Edit Modal or Slide-over drawer
    alert("Edit Modal to be implemented");
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0B0B0B] min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF8A24] border-t-transparent"></div>
      </div>
    );
  }

  if (!startup && !apiError) return null;

  return (
    <div className="flex flex-1 flex-col bg-[#0B0B0B] min-h-screen font-sans selection:bg-[#FF8A24]/20 selection:text-[#FF8A24]">
      {apiError && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 p-4 text-center text-sm font-medium">
          {apiError}
        </div>
      )}

      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 md:py-12 space-y-10">
        
        <StartupHero startup={startup!} onEdit={handleEdit} />

        <QuickStatusCards />

        {/* Tabs */}
        <div className="border-b border-[#262626]">
          <div className="flex items-center gap-8">
            {["Overview", "Documents", "AI Insights", "Activity"].map((tab) => {
              const tabId = tab.toLowerCase().replace(" ", "-");
              const isActive = activeTab === tabId;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabId)}
                  className={`pb-4 text-sm font-medium transition-all relative ${isActive ? 'text-white' : 'text-[#A1A1AA] hover:text-white'}`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#FF8A24] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-20">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <BasicInfoCard startup={startup!} onEdit={handleEdit} />
                <CompanyDetailsCard startup={startup!} onEdit={handleEdit} />
                <FounderCard />
              </div>
              <div className="lg:col-span-1 space-y-8">
                <OnlinePresenceCard startup={startup!} onEdit={handleEdit} />
                <ActionCard />
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DocumentCard />
            </div>
          )}

          {activeTab === "ai-insights" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <InsightCard />
            </div>
          )}

          {activeTab === "activity" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
              <TimelineCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
