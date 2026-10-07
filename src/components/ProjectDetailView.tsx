import React from 'react';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  AlertCircle,
} from 'lucide-react';
import type { ProjectWithDetails, User as UserType } from '../types/index.js';

interface ProjectDetailViewProps {
  project: ProjectWithDetails;
  currentUser: UserType;
  onBack: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  currentUser,
  onBack,
}) => {
  const tasks = project.tasks || [];
  const totalTasksHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition" />
          Back to Projects
        </button>
      </div>

      {/* Project Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                Client: {project.clientName}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800/80">
                Manager: {project.manager?.name || project.managerId}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Delivery: {project.deadline}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">{project.name}</h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">{project.description}</p>
          </div>

          {/* Quick Metrics */}
          <div className="shrink-0 flex md:flex-col items-center md:items-end gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Visible Tasks
              </span>
              <span className="text-2xl font-bold text-white font-mono">{tasks.length}</span>
            </div>
            <div className="text-right border-l md:border-l-0 md:border-t border-slate-800 pl-3 md:pl-0 md:pt-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Visible Hours
              </span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">{totalTasksHours} hrs</span>
            </div>
          </div>
        </div>

        {/* RBAC Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>
              {currentUser.role === 'ADMIN'
                ? 'Administrator View: Full access to all tasks across all team members.'
                : currentUser.role === 'MANAGER'
                ? 'Manager View: Full access to all tasks under this managed project.'
                : 'Agent View: Showing only tasks assigned to you. Other developers\' tasks are restricted by backend access control.'}
            </span>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            Project Tasks ({tasks.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            All deadlines must be on or before {project.deadline}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm">No tasks visible for this project under current role permissions.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {tasks.map((task, idx) => (
              <div
                key={task.id || idx}
                className="py-4 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 px-3 rounded-xl transition"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-semibold">#{idx + 1}</span>
                    <h3 className="text-base font-semibold text-white">{task.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {task.description || 'No additional scope description.'}
                  </p>
                </div>

                {/* Right Meta details */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 shrink-0 text-xs">
                  {/* Assigned Agent */}
                  <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      {task.assignee?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block leading-tight">Assignee</span>
                      <span className="font-medium text-slate-200">
                        {task.assignee?.name || task.assigneeId}
                      </span>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block leading-tight flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" /> Due Date
                    </span>
                    <span className="font-mono text-cyan-300 font-semibold">{task.deadline}</span>
                  </div>

                  {/* Estimated Hours */}
                  <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 min-w-[70px] text-right">
                    <span className="text-[10px] text-slate-500 block leading-tight flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" /> Effort
                    </span>
                    <span className="font-mono text-indigo-300 font-bold">
                      {task.estimatedHours} hrs
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
