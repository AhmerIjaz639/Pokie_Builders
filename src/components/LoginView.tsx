import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';
import { SUPPLIED_TEN_ACCOUNTS, DEMO_PASSWORD } from '../../server/seedData.js';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState('admin@novaworks.example');
  const [password, setPassword] = useState(DEMO_PASSWORD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await onLogin(email, password);
  };

  const handleSelectAccount = (accountEmail: string) => {
    setEmail(accountEmail);
    setPassword(DEMO_PASSWORD);
  };

  const handleQuickLogin = (accountEmail: string) => {
    setEmail(accountEmail);
    setPassword(DEMO_PASSWORD);
    onLogin(accountEmail, DEMO_PASSWORD);
  };

  const adminAccounts = SUPPLIED_TEN_ACCOUNTS.filter((a) => a.role === 'ADMIN');
  const managerAccounts = SUPPLIED_TEN_ACCOUNTS.filter((a) => a.role === 'MANAGER');
  const agentAccounts = SUPPLIED_TEN_ACCOUNTS.filter((a) => a.role === 'AGENT');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-xl shadow-cyan-500/20 text-white font-black text-2xl mb-4">
          NW
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">NovaWorks Technologies</h2>
        <p className="mt-2 text-sm text-slate-400">
          Meeting-to-Execution Project Management System (Lahore, Pakistan)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900/90 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10 backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 flex items-start gap-3 text-rose-200">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold">Authentication Error: </span>
                {error}
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@novaworks.example"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <span className="text-xs text-slate-400">All demo accounts: Demo123!</span>
              </div>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Authenticating session...
                  </span>
                ) : (
                  <>
                    Sign In to NovaWorks CRM
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick-select Demo Accounts Panel */}
          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                Pre-configured Demo Accounts
              </span>
              <span className="text-[11px] text-cyan-400/90 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                1-Click Sign In
              </span>
            </div>

            {/* Administrator */}
            <div className="mb-3">
              <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Administrator</span>
              <div className="grid grid-cols-1 gap-1.5 mt-1">
                {adminAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email)}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-600/50 text-left transition group"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white flex items-center gap-1.5">
                        <span>{acc.name}</span>
                        <span className="text-[10px] text-rose-400 font-mono">[{acc.id}]</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{acc.specialization}</div>
                    </div>
                    <span className="text-[11px] text-slate-400 group-hover:text-cyan-300 flex items-center gap-1">
                      Login <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Managers */}
            <div className="mb-3">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Project Managers (3)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-1">
                {managerAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email)}
                    className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition group"
                  >
                    <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                      {acc.name}
                    </div>
                    <div className="text-[10px] text-amber-400 font-mono">{acc.id}</div>
                    <div className="text-[10px] text-slate-400 truncate">{acc.specialization.replace('Manager / ', '')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Developer Agents */}
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Developer Agents (6)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-1">
                {agentAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email)}
                    className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 text-left transition group"
                  >
                    <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                      {acc.name}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono">{acc.id}</div>
                    <div className="text-[10px] text-slate-400 truncate">{acc.specialization.replace('Agent / ', '')}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hackathon Specs callout */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            No signup or password reset required. All 10 demo accounts are seeded with secure credentials.
          </p>
        </div>
      </div>
    </div>
  );
};
