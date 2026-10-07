import React, { useState } from 'react';
import { Users, Search, ShieldCheck, Mail, Tag, Briefcase } from 'lucide-react';
import type { User as UserType } from '../types/index.js';

interface TeamDirectoryViewProps {
  team: UserType[];
  isLoading: boolean;
}

export const TeamDirectoryView: React.FC<TeamDirectoryViewProps> = ({ team, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'ADMIN' | 'MANAGER' | 'AGENT'>('ALL');

  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRoleFilter === 'ALL' || member.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/80">
            Administrator
          </span>
        );
      case 'MANAGER':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80">
            Project Manager
          </span>
        );
      case 'AGENT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
            Developer Agent
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              NovaWorks Team Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
              {team.length} Members
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Read-only company directory. The AI references these verified accounts when assigning
            projects and tasks from meeting transcripts.
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0 text-xs font-medium">
          <button
            onClick={() => setSelectedRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedRoleFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({team.length})
          </button>
          <button
            onClick={() => setSelectedRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedRoleFilter === 'ADMIN'
                ? 'bg-rose-950 text-rose-300 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin (1)
          </button>
          <button
            onClick={() => setSelectedRoleFilter('MANAGER')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedRoleFilter === 'MANAGER'
                ? 'bg-amber-950 text-amber-300 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Managers (3)
          </button>
          <button
            onClick={() => setSelectedRoleFilter('AGENT')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedRoleFilter === 'AGENT'
                ? 'bg-cyan-950 text-cyan-300 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Agents (6)
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by name, email, specialization, or skill (e.g., React, Flutter, LLMs, Node.js)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition shadow-inner"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading directory...</p>
        </div>
      )}

      {/* Team Cards Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-cyan-400">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{member.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          [{member.id}]
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        {member.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  {getRoleBadge(member.role)}
                  <p className="text-xs font-medium text-slate-300 mt-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    {member.specialization}
                  </p>
                </div>
              </div>

              {/* Skills tags */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1.5">
                  Core Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
