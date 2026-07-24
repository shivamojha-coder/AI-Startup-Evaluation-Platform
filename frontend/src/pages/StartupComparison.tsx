import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { compareStartups, type ComparedStartup } from "../api/startups";

export const StartupComparison: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [startups, setStartups] = useState<ComparedStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "investor")) {
      navigate("/login");
      return;
    }

    const idsParam = searchParams.get("ids");
    if (idsParam && user && user.role === "investor") {
      fetchComparison(idsParam.split(","));
    } else {
      setLoading(false);
    }
  }, [searchParams, user, authLoading, navigate]);

  const fetchComparison = async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const data = await compareStartups(ids);
      setStartups(data);
    } catch (err: any) {
      setError(err.message || "Failed to load comparison data.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0A0A0A] text-[#FAFAFA] min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE9638] border-t-transparent"></div>
      </div>
    );
  }

  if (error || startups.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#0A0A0A] p-8 text-[#FAFAFA] min-h-screen">
        <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-8 text-center max-w-md shadow-2xl">
          <p className="text-[#F87171] font-semibold mb-6">{error || "No startups selected for comparison."}</p>
          <button
            onClick={() => navigate("/investor/dashboard")}
            className="inline-block rounded-xl bg-[#FE9638] px-6 py-2.5 text-sm font-bold text-[#0A0A0A] hover:bg-[#E28528] transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Define comparison rows
  const rows = [
    { label: "Industry", key: "industry" as keyof ComparedStartup },
    { label: "Stage", key: "stage" as keyof ComparedStartup },
    { label: "Funding Ask", key: "funding_ask" as keyof ComparedStartup },
    { label: "AI Score", key: "score" as keyof ComparedStartup },
    { label: "Target Market", key: "market" as keyof ComparedStartup },
  ];

  return (
    <div className="flex flex-1 flex-col bg-[#0A0A0A] p-6 sm:p-10 text-[#FAFAFA] min-h-screen selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] border border-[rgba(255,255,255,0.08)] text-[#9A9A9A] hover:text-[#FE9638] hover:border-[#FE9638]/40 transition-all shadow-lg"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAFAFA]">
              Startup Comparison
            </h1>
            <p className="mt-1 text-sm text-[#9A9A9A]">
              Side-by-side analysis of your selected startups.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] shadow-2xl overflow-hidden">
              <table className="min-w-full divide-y divide-[rgba(255,255,255,0.08)]">
                <thead>
                  <tr className="bg-[#1C1C1C]">
                    <th scope="col" className="py-6 px-6 text-left text-sm font-bold text-[#9A9A9A] uppercase tracking-wider w-48 border-r border-[rgba(255,255,255,0.08)]">
                      Feature
                    </th>
                    {startups.map(startup => (
                      <th key={startup.id} scope="col" className="py-6 px-6 text-center border-r border-[rgba(255,255,255,0.08)] last:border-0 min-w-[250px]">
                        <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">{startup.name}</h3>
                        <Link
                          to={`/investor/report/${startup.id}`}
                          className="inline-block rounded-lg bg-[rgba(254,150,56,0.15)] border border-[#FE9638]/30 px-4 py-1.5 text-xs font-bold text-[#FE9638] hover:bg-[#FE9638] hover:text-[#0A0A0A] transition-colors"
                        >
                          View Report
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.08)] bg-[#141414]">
                  {rows.map((row, idx) => (
                    <tr key={row.key} className={idx % 2 === 0 ? "bg-[#141414]" : "bg-[#181818]"}>
                      <td className="py-5 px-6 whitespace-nowrap text-sm font-bold text-[#FAFAFA] border-r border-[rgba(255,255,255,0.08)]">
                        {row.label}
                      </td>
                      {startups.map(startup => {
                        let value = startup[row.key];
                        let content: React.ReactNode = String(value || "N/A");

                        // Special rendering
                        if (row.key === "score") {
                          const score = value as number;
                          let color = "text-[#FE9638]";
                          if (score >= 90) color = "text-[#34D399]";
                          else if (score >= 80) color = "text-[#38BDF8]";
                          else if (score >= 70) color = "text-[#FBBF24]";
                          else color = "text-[#F87171]";
                          content = <span className={`text-2xl font-black ${color}`}>{score}</span>;
                        } else if (row.key === "market") {
                          content = <p className="text-sm text-[#9A9A9A] line-clamp-3 whitespace-pre-wrap">{value}</p>;
                        } else {
                          content = <span className="text-sm font-semibold text-[#FAFAFA]">{value || "N/A"}</span>;
                        }

                        return (
                          <td key={`${startup.id}-${row.key}`} className="py-5 px-6 text-center align-top border-r border-[rgba(255,255,255,0.08)] last:border-0">
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
