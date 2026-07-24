import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getStartup,
  getDocuments,
  deleteDocument,
  uploadPitchDeck,
  getEvaluationStatus,
  type DocumentResponse,
} from "../api/startups";
import type { StartupResponse } from "../schemas/startup";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStageLabel(stage: string | null | undefined): string {
  switch (stage) {
    case "extracting":
      return "Extracting text…";
    case "chunking":
      return "Processing content…";
    case "analyzing":
      return "AI is analyzing your document…";
    case "generating_report":
      return "Generating report…";
    default:
      return "AI is analyzing your document…";
  }
}

function getFailureReason(extractionStatus: string | null | undefined): string {
  switch (extractionStatus) {
    case "corrupted_pdf":
      return "The uploaded file could not be parsed. Please re-upload a valid PDF.";
    case "empty_pdf":
      return "No readable text was found in this document.";
    case "extraction_failed":
      return "Text extraction failed after retry.";
    case "api_quota_exceeded":
      return "AI service quota exceeded. Please try again later or check your API plan.";
    case "api_key_invalid":
      return "AI service authentication failed. Please check the API key configuration.";
    case "ai_analysis_failed":
      return "AI analysis could not complete. Please try uploading again.";
    case "analysis_error":
      return "An error occurred during AI analysis. Please try again.";
    case "processing":
    case "extracting":
    case "pending":
    case null:
    case undefined:
      return "An unexpected error occurred during analysis. Please try uploading again.";
    default:
      return "An unexpected error occurred during analysis.";
  }
}

const TERMINAL_STATUSES = new Set(["completed", "failed"]);
const POLL_INTERVAL_MS = 3500;

// ─── EvaluationRow ────────────────────────────────────────────────────────────

interface EvaluationRowProps {
  doc: DocumentResponse;
  onDelete: (doc: DocumentResponse) => void;
  onRetry: () => void;
  onViewReport: (evaluationId: string) => void;
  /** live status/stage refreshed by the parent poller */
  liveStatus: string;
  liveStage: string | null;
  liveExtractionStatus: string | null;
}

const EvaluationRow: React.FC<EvaluationRowProps> = ({
  doc,
  onDelete,
  onRetry,
  onViewReport,
  liveStatus,
  liveStage,
  liveExtractionStatus,
}) => {
  const isInFlight =
    liveStatus === "pending" || liveStatus === "processing";
  const isFailed = liveStatus === "failed";
  const isCompleted = liveStatus === "completed";

  // Status pill styling
  const pillClass = isCompleted
    ? "bg-[rgba(52,211,153,0.15)] text-[#34D399] border border-[#34D399]/30"
    : isFailed
    ? "bg-[rgba(248,113,113,0.15)] text-[#F87171] border border-[#F87171]/30"
    : "bg-[rgba(254,150,56,0.15)] text-[#FE9638] border border-[#FE9638]/30";

  const pillLabel = isCompleted
    ? "Completed"
    : isFailed
    ? "Failed"
    : liveStatus === "processing"
    ? "Processing"
    : "Pending";

  return (
    <tr className="border-t border-[rgba(255,255,255,0.08)] hover:bg-[#1C1C1C] transition-colors duration-200">
      {/* Version */}
      <td className="px-6 py-4 font-bold text-[#FAFAFA] whitespace-nowrap">
        v{doc.version}
      </td>

      {/* File info + inline progress */}
      <td className="px-6 py-4 min-w-[260px]">
        <div className="flex items-center gap-2 mb-1">
          <svg
            className="h-4 w-4 text-[#FE9638] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span
            className="truncate text-sm font-semibold text-[#FAFAFA] max-w-[220px]"
            title={doc.file_name}
          >
            {doc.file_name}
          </span>
        </div>

        {/* Animated progress bar while in-flight */}
        {isInFlight && (
          <div className="mt-2">
            <p className="mb-1.5 text-xs font-semibold text-[#FE9638]">
              {getStageLabel(liveStage)}
            </p>
            {/* Indeterminate shimmer bar */}
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FE9638] via-[#FBBF24] to-[#FE9638] animate-[shimmer_1.8s_ease-in-out_infinite] bg-[length:200%_100%]" />
            </div>
          </div>
        )}

        {/* Failure reason + retry */}
        {isFailed && (
          <div className="mt-2 rounded-xl bg-[rgba(248,113,113,0.12)] border border-[#F87171]/30 px-3 py-2">
            <p className="text-xs text-[#F87171] leading-snug mb-1.5 font-semibold">
              {getFailureReason(liveExtractionStatus ?? doc.extraction_status)}
            </p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#FE9638] hover:underline transition-colors cursor-pointer"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try uploading again
            </button>
          </div>
        )}
      </td>

      {/* Size */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9A9A9A]">
        {doc.file_size_kb < 1024
          ? `${doc.file_size_kb} KB`
          : `${(doc.file_size_kb / 1024).toFixed(1)} MB`}
      </td>

      {/* Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9A9A9A]">
        {new Date(doc.uploaded_at).toLocaleDateString()}
      </td>

      {/* Status pill */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${pillClass}`}
        >
          {isInFlight && (
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          )}
          {pillLabel}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
        <button
          onClick={() => onViewReport(doc.evaluation_id)}
          className="text-sm font-bold text-[#FE9638] hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline transition-all cursor-pointer"
          disabled={!isCompleted}
        >
          View Report
        </button>
        <button
          onClick={() => onDelete(doc)}
          className="text-sm font-semibold text-[#9A9A9A] hover:text-[#EF4444] transition-colors cursor-pointer"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

export const StartupDocuments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [startup, setStartup] = useState<StartupResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete States
  const [documentToDelete, setDocumentToDelete] =
    useState<DocumentResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live status map: evaluation_id → { status, progress_stage }
  const [liveStatuses, setLiveStatuses] = useState<
    Record<string, { status: string; stage: string | null; extractionStatus?: string | null }>
  >({});

  // Refs to keep latest liveStatuses + documents accessible inside interval
  const liveStatusesRef = useRef(liveStatuses);
  const documentsRef = useRef(documents);
  useEffect(() => {
    liveStatusesRef.current = liveStatuses;
  }, [liveStatuses]);
  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  // ── Initial load ────────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      setLoading(true);
      const [startupData, docsData] = await Promise.all([
        getStartup(id!),
        getDocuments(id!),
      ]);
      setStartup(startupData);
      setDocuments(docsData);

      // Seed liveStatuses from initial fetch
      const initial: Record<string, { status: string; stage: string | null; extractionStatus?: string | null }> =
        {};
      for (const doc of docsData) {
        initial[doc.evaluation_id] = {
          status: doc.status,
          // DocumentResponse doesn't carry progress_stage yet; default null
          stage: null,
        };
      }
      setLiveStatuses(initial);
    } catch (err: any) {
      setApiError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "founder")) {
      navigate("/login");
      return;
    }
    if (id && user && user.role === "founder") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, authLoading, navigate]);



  // ── Polling ─────────────────────────────────────────────────────────────────
  const pollStatuses = useCallback(async () => {
    const current = documentsRef.current;
    // Collect evaluation IDs that are still in-flight
    const inFlight = current.filter((doc) => {
      const live = liveStatusesRef.current[doc.evaluation_id];
      const effectiveStatus = live?.status ?? doc.status;
      return !TERMINAL_STATUSES.has(effectiveStatus);
    });

    if (inFlight.length === 0) return;

    const updates: Record<string, { status: string; stage: string | null; extractionStatus?: string | null }> =
      {};
    await Promise.allSettled(
      inFlight.map(async (doc) => {
        try {
          const res = await getEvaluationStatus(doc.evaluation_id);
          updates[doc.evaluation_id] = {
            status: res.status,
            stage: res.progress_stage,
            extractionStatus: res.extraction_status,
          };
        } catch {
          // silently skip failed polls; keep previous value
        }
      })
    );

    if (Object.keys(updates).length > 0) {
      setLiveStatuses((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const anyInFlight = documentsRef.current.some((doc) => {
        const live = liveStatusesRef.current[doc.evaluation_id];
        const effectiveStatus = live?.status ?? doc.status;
        return !TERMINAL_STATUSES.has(effectiveStatus);
      });
      if (anyInFlight) {
        pollStatuses();
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [pollStatuses]);

  // ── Upload ──────────────────────────────────────────────────────────────────
  // Derived: is any evaluation still running (for disabling the drop zone)?
  const isProcessing = documents.some((doc) => {
    const live = liveStatuses[doc.evaluation_id];
    const effectiveStatus = live?.status ?? doc.status;
    return effectiveStatus === "pending" || effectiveStatus === "processing";
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const allowedTypes = [
      "application/pdf", 
      "application/vnd.ms-powerpoint", 
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only PDF and PPT/PPTX files are allowed.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("File size exceeds 20MB limit.");
      return;
    }

    setUploadError(null);
    setUploadSuccessMessage(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await uploadPitchDeck(id!, file, (progress) => {
        setUploadProgress(progress);
      });
      // Refresh document list after upload
      const docsData = await getDocuments(id!);
      setDocuments(docsData);

      // Seed new evaluation as pending in live map
      const updated: Record<
        string,
        { status: string; stage: string | null }
      > = {};
      for (const doc of docsData) {
        if (!liveStatuses[doc.evaluation_id]) {
          updated[doc.evaluation_id] = { status: doc.status, stage: null };
        }
      }
      if (Object.keys(updated).length > 0) {
        setLiveStatuses((prev) => ({ ...prev, ...updated }));
      }
      setUploadSuccessMessage("Document uploaded successfully! Background processing has started.");
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload pitch deck.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Scroll upload zone into view when "Try uploading again" is clicked
  const uploadZoneRef = useRef<HTMLDivElement>(null);
  const scrollToUpload = () => {
    uploadZoneRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;
    try {
      setIsDeleting(true);
      await deleteDocument(id!, documentToDelete.id);
      setDocuments((prev) => prev.filter((d) => d.id !== documentToDelete.id));
      setDocumentToDelete(null);
    } catch (err: any) {
      setApiError(err.message || "Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0A0A0A] text-[#FAFAFA] min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE9638] border-t-transparent" />
      </div>
    );
  }

  if (!startup && !apiError) return null;

  return (
    <>
      {/* Shimmer keyframe — injected once into <head> via a style tag */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>

      <div className="flex flex-1 flex-col bg-[#0A0A0A] p-8 text-[#FAFAFA] relative min-h-screen selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
        <div className="mx-auto w-full max-w-5xl space-y-8">

          {/* ── Header ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={`/founder/startups/${id}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] border border-[rgba(255,255,255,0.08)] text-[#9A9A9A] hover:text-[#FE9638] hover:border-[#FE9638]/40 transition-all duration-300 shadow-lg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">
                  Documents & Evaluations
                </h1>
                <p className="text-sm text-[#9A9A9A]">
                  Manage pitch decks for {startup?.startup_name}
                </p>
              </div>
            </div>
          </div>

          {apiError && (
            <div className="rounded-xl bg-[rgba(248,113,113,0.12)] border border-[#F87171]/30 p-4 text-sm font-semibold text-[#F87171]">
              {apiError}
            </div>
          )}

          {/* ── Upload Zone ── */}
          <div ref={uploadZoneRef} className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-8 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">Replace Pitch Deck</h3>
              <p className="text-sm text-[#9A9A9A]">
                Uploading a new pitch deck creates a{" "}
                <span className="text-[#FE9638] font-bold">new Evaluation Version</span>.{" "}
                Your historical reports will not be overwritten.
              </p>
            </div>

            {uploadError && (
              <div className="mb-4 rounded-xl bg-[rgba(248,113,113,0.12)] border border-[#F87171]/30 p-3 text-sm font-semibold text-[#F87171]">
                {uploadError}
              </div>
            )}

            <div
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-300 ${
                isProcessing
                  ? "border-[rgba(255,255,255,0.12)] bg-[#1C1C1C] opacity-60 cursor-not-allowed"
                  : isDragActive
                  ? "border-[#FE9638] bg-[rgba(254,150,56,0.1)]"
                  : "border-[rgba(255,255,255,0.15)] bg-[#1C1C1C] hover:border-[#FE9638] hover:bg-[#202020] cursor-pointer"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() =>
                !isUploading && fileInputRef.current?.click()
              }
            >
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={isUploading}
                />

                {isUploading ? (
                  <div className="w-full max-w-xs text-center">
                    <p className="mb-3 text-sm font-bold text-[#FE9638]">
                      Uploading {uploadProgress}%
                    </p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#141414] border border-[rgba(255,255,255,0.12)]">
                      <div
                        className="h-full bg-[#FE9638] transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-2xl bg-[rgba(254,150,56,0.15)] border border-[#FE9638]/30 p-4 text-[#FE9638]">
                      <svg
                        className="h-8 w-8 text-[#FE9638]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </div>
                    <p className="text-base font-bold text-[#FAFAFA] mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#9A9A9A] mb-2">PDF or PPTX (max. 20MB)</p>
                    {uploadSuccessMessage && (
                      <p className="text-sm font-bold text-[#34D399] bg-[rgba(52,211,153,0.15)] border border-[#34D399]/30 px-4 py-2 rounded-xl mt-2">
                        ✓ {uploadSuccessMessage}
                      </p>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* ── Upload History Table ── */}
          <div className="rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.08)] p-8 shadow-2xl">
            <h3 className="mb-6 text-xl font-bold text-[#FAFAFA]">Upload History</h3>

            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(255,255,255,0.15)] bg-[#1C1C1C] py-16 text-center">
                <p className="text-[#FAFAFA] text-lg mb-2 font-semibold">No documents yet.</p>
                <p className="text-sm text-[#9A9A9A]">
                  Upload your pitch deck above to get your first AI evaluation.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)]">
                <table className="w-full text-left text-sm text-[#FAFAFA]">
                  <thead className="bg-[#1C1C1C] text-xs font-bold uppercase tracking-wider text-[#9A9A9A]">
                    <tr>
                      <th className="px-6 py-4">Version</th>
                      <th className="px-6 py-4">File</th>
                      <th className="px-6 py-4">Size</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => {
                      const live = liveStatuses[doc.evaluation_id];
                      return (
                        <EvaluationRow
                          key={doc.id}
                          doc={doc}
                          onDelete={setDocumentToDelete}
                          onRetry={scrollToUpload}
                          onViewReport={(evalId) => navigate(`/founder/startups/${id}/report/${evalId}`)}
                          liveStatus={live?.status ?? doc.status}
                          liveStage={live?.stage ?? null}
                          liveExtractionStatus={live?.extractionStatus ?? null}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Delete Confirmation Modal ── */}
        {documentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-[#141414] border border-[rgba(255,255,255,0.12)] p-8 shadow-2xl">
              <h3 className="mb-2 text-xl font-bold text-[#FAFAFA]">Delete Document</h3>
              <div className="mb-6 space-y-4">
                <p className="text-sm text-[#9A9A9A]">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-[#FAFAFA]">
                    {documentToDelete.file_name}
                  </span>
                  ?
                </p>
                <div className="rounded-xl bg-[rgba(251,191,36,0.15)] border border-[#FBBF24]/30 p-4 text-sm font-semibold text-[#FBBF24]">
                  <p>
                    <strong>Note:</strong> The PDF file will be permanently removed, but the
                    historical AI Report (v{documentToDelete.version}) will be preserved in your
                    evaluations history for future reference.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDocumentToDelete(null)}
                  disabled={isDeleting}
                  className="rounded-xl px-5 py-2 text-sm font-bold text-[#9A9A9A] hover:bg-[#1C1C1C] hover:text-[#FAFAFA] transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="rounded-xl bg-[#EF4444] hover:bg-[#DC2626] px-6 py-2 text-sm font-bold text-white shadow-lg shadow-[#EF4444]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isDeleting ? "Deleting…" : "Delete Document"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
