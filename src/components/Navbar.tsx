import React from 'react';
import {
  Sparkles,
  LogOut,
  Users,
  Briefcase,
  CheckSquare,
  ShieldAlert,
  Terminal,
  RefreshCw,
} from 'lucide-react';
import type { User } from '../types/index.js';

interface NavbarProps {
  currentUser: User | null;
  currentTab: 'projects' | 'directory' | 'my-tasks' | 'transcript';
  onSelectTab: (tab: 'projects' | 'directory' | 'my-tasks' | 'transcript') => void;
  onLogout: () => void;
  onQuickSwitchUser: (email: string) => void;
  onOpenDemoGuide: () => void;
  onResetDb: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onLogout,
  onQuickSwitchUser,
  onOpenDemoGuide,
  onResetDb,
}) => {
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/60">
            Admin
          </span>
        );
      case 'MANAGER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
            Manager
          </span>
        );
      case 'AGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
            Agent
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
              NW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 tracking-tight text-lg">NovaWorks CRM</span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Infinity Hack '26
                </span>
              </div>
              <p className="text-xs text-slate-400">Meeting-to-Execution System</p>
            </div>
          </div>

          {/* Navigation Links */}
          {currentUser && (
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => onSelectTab('projects')}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentTab === 'projects'
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                {currentUser.role === 'ADMIN'
                  ? 'All Projects'
                  : currentUser.role === 'MANAGER'
                  ? 'Assigned Projects'
                  : 'Active Projects'}
              </button>

              {currentUser.role === 'AGENT' && (
                <button
                  onClick={() => onSelectTab('my-tasks')}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    currentTab === 'my-tasks'
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  My Tasks
                </button>
              )}

              {currentUser.role === 'ADMIN' && (
                <button
                  onClick={() => onSelectTab('transcript')}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    currentTab === 'transcript'
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Create from Transcript
                </button>
              )}

              <button
                onClick={() => onSelectTab('directory')}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentTab === 'directory'
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Users className="w-4 h-4" />
                Team Directory
              </button>
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Verification Guide Trigger */}
            <button
              onClick={onOpenDemoGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 transition shadow-sm"
              title="Open Organizer / Judge Verification Guide"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demo Checklist</span>
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                {/* Fast Switcher for Demo accounts */}
                <div className="relative group">
                  <div className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-medium text-slate-200 leading-none">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{currentUser.email}</p>
                    </div>
                    {getRoleBadge(currentUser.role)}
                  </div>

                  {/* Dropdown for quick account switching */}
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 hidden group-hover:block transition z-50">
                    <div className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                      Quick Demo Switcher
                    </div>
                    <div className="space-y-1 mt-1 max-h-72 overflow-y-auto">
                      <button
                        onClick={() => onQuickSwitchUser('admin@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Admin (Overview / Transcript)</span>
                        <span className="text-[10px] text-rose-400 font-mono">ADMIN</span>
                      </button>
                      <div className="border-t border-slate-800 my-1"></div>
                      <div className="px-2 text-[10px] text-slate-500 font-semibold">MANAGERS</div>
                      <button
                        onClick={() => onQuickSwitchUser('ayesha@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Ayesha Khan (Web PM)</span>
                        <span className="text-[10px] text-amber-400 font-mono">PM01</span>
                      </button>
                      <button
                        onClick={() => onQuickSwitchUser('bilal@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Bilal Ahmed (Mobile PM)</span>
                        <span className="text-[10px] text-amber-400 font-mono">PM02</span>
                      </button>
                      <button
                        onClick={() => onQuickSwitchUser('hina@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Hina Malik (AI PM)</span>
                        <span className="text-[10px] text-amber-400 font-mono">PM03</span>
                      </button>
                      <div className="border-t border-slate-800 my-1"></div>
                      <div className="px-2 text-[10px] text-slate-500 font-semibold">AGENTS</div>
                      <button
                        onClick={() => onQuickSwitchUser('ali@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Ali Raza (Full-Stack)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">DEV01</span>
                      </button>
                      <button
                        onClick={() => onQuickSwitchUser('hamza@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Hamza Shah (Backend/API)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">DEV02</span>
                      </button>
                      <button
                        onClick={() => onQuickSwitchUser('sara@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Sara Noor (Flutter)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">DEV03</span>
                      </button>
                      <button
                        onClick={() => onQuickSwitchUser('usman@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Usman Tariq (Flutter QA)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">DEV04</span>
                      </button>
                      <button
                        onClick={() => onQuickSwitchUser('zain@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Zain Abbas (AI Dev)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">DEV05</span>
                      </button>
                      <button
                        onClick={() => onQuickSwitchUser('maryam@novaworks.example')}
                        className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span>Maryam Asif (AI Docs)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">DEV06</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        {currentUser && (
          <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
            <button
              onClick={() => onSelectTab('projects')}
              className={`px-3 py-1 rounded ${
                currentTab === 'projects' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
              }`}
            >
              Projects
            </button>
            {currentUser.role === 'AGENT' && (
              <button
                onClick={() => onSelectTab('my-tasks')}
                className={`px-3 py-1 rounded ${
                  currentTab === 'my-tasks' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
                }`}
              >
                My Tasks
              </button>
            )}
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => onSelectTab('transcript')}
                className={`px-3 py-1 rounded ${
                  currentTab === 'transcript' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
                }`}
              >
                AI Transcript
              </button>
            )}
            <button
              onClick={() => onSelectTab('directory')}
              className={`px-3 py-1 rounded ${
                currentTab === 'directory' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
              }`}
            >
              Team
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
