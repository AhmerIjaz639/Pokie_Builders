import React from 'react';
import {
  X,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchUser: (email: string) => void;
  onSelectTab: (tab: 'projects' | 'directory' | 'my-tasks' | 'transcript') => void;
  onResetData: () => Promise<void>;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onSwitchUser,
  onSelectTab,
  onResetData,
}) => {
  if (!isOpen) return null;

  const testSteps = [
    {
      step: 1,
      title: 'Demo Accounts & No Signup Requirement',
      desc: 'Verify 10 pre-seeded accounts exist. No signup or password reset flows exist.',
      actionLabel: 'View Team Directory',
      action: () => {
        onSelectTab('directory');
        onClose();
      },
    },
    {
      step: 2,
      title: 'Admin Transcript AI Creation',
      desc: 'Admin pastes transcript. AI extracts 3 projects, 12 tasks, and respects revisions.',
      actionLabel: 'Switch to Admin & Open AI Tab',
      action: () => {
        onSwitchUser('admin@novaworks.example');
        onSelectTab('transcript');
        onClose();
      },
    },
    {
      step: 3,
      title: 'Manager Role Access (AC-007)',
      desc: 'Log in as Ayesha Khan (PM01) to verify she sees ONLY UrbanCart Website (not QuickServe or HelpDeskPro).',
      actionLabel: 'Switch to Ayesha (PM01)',
      action: () => {
        onSwitchUser('ayesha@novaworks.example');
        onSelectTab('projects');
        onClose();
      },
    },
    {
      step: 4,
      title: 'Agent Role Access (AC-008)',
      desc: 'Log in as Ali Raza (DEV01) to verify he sees ONLY his 3 UrbanCart tasks and cannot view other agents\' tasks.',
      actionLabel: 'Switch to Ali (DEV01)',
      action: () => {
        onSwitchUser('ali@novaworks.example');
        onSelectTab('my-tasks');
        onClose();
      },
    },
    {
      step: 5,
      title: 'Cross-Project Agent Access (AC-008)',
      desc: 'Log in as Hamza Shah (DEV02) to verify his 2 tasks across UrbanCart (APIs) and QuickServe (APIs).',
      actionLabel: 'Switch to Hamza (DEV02)',
      action: () => {
        onSwitchUser('hamza@novaworks.example');
        onSelectTab('my-tasks');
        onClose();
      },
    },
    {
      step: 6,
      title: 'Persistence Test (AC-010)',
      desc: 'Reload the web browser at any time. Saved projects, tasks, and sessions persist in the database.',
      actionLabel: 'Hard Refresh Page',
      action: () => {
        window.location.reload();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Organizer & Judge Demonstration Checklist</h2>
            <p className="text-xs text-slate-400">
              Corresponds directly to PRD Section 21 & Section 22 Demonstration Plan
            </p>
          </div>
        </div>

        {/* Acceptance Criteria Summary */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-6 space-y-2 text-xs">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] block">
            Verification Rules Checklist (THE INFINITY HACK '26)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3 Projects & 12 Tasks exact extraction</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>UrbanCart deadline: 20 Oct (not 18 Oct)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>UrbanCart integration: 19 Oct (not 17 Oct)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>QuickServe integration: 10 hrs (not 8 hrs)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>HelpDeskPro testing: Maryam (not Zain)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kamran ignored (not on team / no task)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rejected features excluded (payments/maps/email)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Role-Based Access Control on API level</span>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {testSteps.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-800">
                    {s.step}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                </div>
                <p className="text-xs text-slate-400 pl-7">{s.desc}</p>
              </div>

              <button
                onClick={s.action}
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition shadow-sm"
              >
                <span>{s.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer Reset option */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">Need to start over?</span>
          <button
            onClick={async () => {
              if (window.confirm('Reset all generated projects and tasks to clean state?')) {
                await onResetData();
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Projects & Reset Database
          </button>
        </div>
      </div>
    </div>
  );
};
