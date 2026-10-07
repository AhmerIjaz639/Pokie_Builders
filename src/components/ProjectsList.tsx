import React from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles,
} from 'lucide-react';
import type { ProjectWithDetails, User as UserType } from '../types/index.js';

interface ProjectsListProps {
  projects: ProjectWithDetails[];
  currentUser: UserType;
  onSelectProject: (projectId: string) => void;
  onOpenTranscriptTab?: () => void;
  isLoading: boolean;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  currentUser,
  onSelectProject,
  onOpenTranscriptTab,
  isLoading,
}) => {
  const getRoleBadgeDesc = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return 'Company Overview: Showing all active client projects in NovaWorks.';
      case 'MANAGER':
        return `Manager View: Showing only projects managed by ${currentUser.name} (${currentUser.id}).`;
      case 'AGENT':
        return `Agent View: Showing only projects with tasks assigned to ${currentUser.name} (${currentUser.id}).`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {currentUser.role === 'ADMIN'
                ? 'All Client Projects'
                : currentUser.role === 'MANAGER'
                ? 'My Managed Projects'
                : 'Projects with My Assigned Work'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
              {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            {getRoleBadgeDesc()}
          </p>
        </div>

        {currentUser.role === 'ADMIN' && onOpenTranscriptTab && (
          <button
            onClick={onOpenTranscriptTab}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-600/20 transition shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Create from Transcript
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading project records...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Projects Available</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
            {currentUser.role === 'ADMIN'
              ? 'No projects have been generated yet. Paste a meeting transcript to extract and persist projects and tasks.'
              : currentUser.role === 'MANAGER'
              ? `You do not have any projects assigned to you yet (${currentUser.name}). Once the administrator runs the meeting transcript, your projects will appear here.`
              : `You do not have any tasks assigned in current projects yet (${currentUser.name}).`}
          </p>
          {currentUser.role === 'ADMIN' && onOpenTranscriptTab && (
            <div className="mt-6">
              <button
                onClick={onOpenTranscriptTab}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition shadow"
              >
                <Sparkles className="w-4 h-4" />
                Go to Transcript Creator
              </button>
            </div>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl hover:shadow-cyan-500/10 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:from-cyan-950 group-hover:to-indigo-950 group-hover:text-cyan-300 transition">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                    {project.clientName}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-cyan-300 transition">
                  {project.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>

                {/* Metadata */}
                <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-800/80 text-xs">
                  {/* Manager */}
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Project Manager:
                    </span>
                    <span className="font-medium text-amber-300 flex items-center gap-1">
                      {project.manager?.name || project.managerId}
                    </span>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Deadline:
                    </span>
                    <span className="font-mono text-cyan-400 font-semibold">{project.deadline}</span>
                  </div>

                  {/* Tasks count & hours */}
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Tasks / Hours:
                    </span>
                    <span className="font-medium text-slate-200">
                      {project.taskCount ?? project.tasks?.length ?? 0} tasks
                      {typeof project.totalHours === 'number' && (
                        <span className="text-indigo-400 font-mono ml-1">
                          ({project.totalHours} hrs)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>View Details & Tasks</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
