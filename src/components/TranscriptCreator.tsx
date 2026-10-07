import React, { useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileText,
  RotateCcw,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  SUPPLIED_OFFICIAL_TRANSCRIPT,
  MODIFIED_QUICKSERVE_TRANSCRIPT,
  INVALID_SAMPLE_TRANSCRIPT,
} from '../lib/transcriptSamples.js';
import type { TranscriptCreationResult } from '../types/index.js';

interface TranscriptCreatorProps {
  onProcessTranscript: (transcript: string) => Promise<TranscriptCreationResult>;
  isProcessing: boolean;
  onSuccessNavigate?: () => void;
  onClearProjects: () => Promise<void>;
  existingProjectCount: number;
}

export const TranscriptCreator: React.FC<TranscriptCreatorProps> = ({
  onProcessTranscript,
  isProcessing,
  onSuccessNavigate,
  onClearProjects,
  existingProjectCount,
}) => {
  const [transcript, setTranscript] = useState(SUPPLIED_OFFICIAL_TRANSCRIPT);
  const [result, setResult] = useState<TranscriptCreationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return; // Duplicate click protection (FR-011)

    setErrorMsg(null);
    setValidationErrors([]);
    setResult(null);

    try {
      const res = await onProcessTranscript(transcript);
      setResult(res);
    } catch (err: any) {
      console.error('Transcript creation error:', err);
      const data = err.data;
      if (data?.validationErrors && Array.isArray(data.validationErrors)) {
        setValidationErrors(data.validationErrors);
      }
      setErrorMsg(err.message || 'Failed to process transcript with AI.');
    }
  };

  const loadSample = (sampleText: string) => {
    setTranscript(sampleText);
    setErrorMsg(null);
    setValidationErrors([]);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Transcript-to-Project Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Projects & Tasks from Transcript
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Paste the NovaWorks client delivery planning meeting dialogue. Gemini AI analyzes agreed
              decisions, ignores rejected features, assigns tasks to existing team members, and saves persistent
              records.
            </p>
          </div>

          {existingProjectCount > 0 && (
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={onClearProjects}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-rose-950/50 hover:border-rose-800/60 border border-slate-700 transition"
                title="Clear current projects to run another transcript test"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                Clear Current Projects ({existingProjectCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preset selector bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 px-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-cyan-400" />
          Quick Test Presets:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadSample(SUPPLIED_OFFICIAL_TRANSCRIPT)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 transition"
          >
            1. Official Supplied Transcript (3 Projects, 12 Tasks)
          </button>
          <button
            type="button"
            onClick={() => loadSample(MODIFIED_QUICKSERVE_TRANSCRIPT)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 transition"
          >
            2. Modified Transcript (AC-012 Test: 12 hrs, 23 Oct)
          </button>
          <button
            type="button"
            onClick={() => loadSample(INVALID_SAMPLE_TRANSCRIPT)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition"
          >
            3. Invalid Input Test (Rejection & Validation)
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-200">
              Meeting Transcript / Discussion Notes
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {transcript.length} characters | ~{transcript.split('\n').length} lines
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={showFullTranscript ? 22 : 12}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste meeting dialogue here..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 text-slate-200 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-inner"
            />
          </div>

          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => setShowFullTranscript(!showFullTranscript)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              {showFullTranscript ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Collapse editor view
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> Expand full transcript view
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Feedback (FR-012) */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 space-y-2">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-300">Transcript Processing Rejected</h4>
                <p className="text-xs text-rose-200/90 mt-0.5">{errorMsg}</p>
              </div>
            </div>

            {validationErrors.length > 0 && (
              <div className="mt-3 pl-8">
                <p className="text-xs font-semibold text-rose-300 mb-1">
                  Validation Check Failures (All-or-Nothing Rule: No partial records were saved):
                </p>
                <ul className="list-disc list-inside text-xs space-y-1 text-rose-200">
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Success Feedback */}
        {result && result.success && (
          <div className="p-5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-300">AI Conversion Successful!</h4>
                  <p className="text-xs text-emerald-200 mt-0.5">{result.message}</p>
                </div>
              </div>
              {onSuccessNavigate && (
                <button
                  type="button"
                  onClick={onSuccessNavigate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800/60 hover:bg-emerald-700/80 text-emerald-100 transition shadow"
                >
                  View Saved Projects
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Created Summary Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-emerald-900/60 text-xs">
              <div className="bg-emerald-900/30 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Created Projects</span>
                <span className="text-base font-bold text-white">{result.projectsCount} Projects</span>
              </div>
              <div className="bg-emerald-900/30 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Created Tasks</span>
                <span className="text-base font-bold text-white">{result.tasksCount} Tasks</span>
              </div>
              <div className="bg-emerald-900/30 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Database Status</span>
                <span className="text-base font-bold text-emerald-300">Persisted to Disk</span>
              </div>
            </div>

            {/* List preview of created projects */}
            <div className="space-y-1.5 mt-2">
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                Extracted Projects:
              </span>
              {result.projects.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-emerald-900/40 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-white">{p.name}</span>
                    <span className="text-slate-400 ml-2">Client: {p.clientName}</span>
                    <span className="text-amber-400 ml-2">Manager ID: {p.managerId}</span>
                  </div>
                  <span className="text-cyan-400 font-mono text-[11px]">Due: {p.deadline}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button with Duplicate Click Protection (FR-011) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Strict validation: verifies manager roles, agent assignments, deadlines, positive hours.
          </div>

          <button
            type="submit"
            disabled={isProcessing || !transcript.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Processing Transcript with Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Create from Transcript</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
