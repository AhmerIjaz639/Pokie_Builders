import React from 'react';
import {
  CheckSquare,
  Calendar,
  Clock,
  Briefcase,
  User,
  ShieldCheck,
  Building,
} from 'lucide-react';
import type { TaskWithAssignee, User as UserType } from '../types/index.js';

interface AgentTasksViewProps {
  tasks: TaskWithAssignee[];
  currentUser: UserType;
  isLoading: boolean;
  onOpenProject?: (projectId: string) => void;
}

export const AgentTasksView: React.FC<AgentTasksViewProps> = ({
  tasks,
  currentUser,
  isLoading,
  onOpenProject,
}) => {
  const totalHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Assigned Tasks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Showing exclusively tasks assigned to {currentUser.name} ({currentUser.id}). Other
            developers' tasks are inaccessible.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Workload</span>
            <span className="text-xl font-bold text-indigo-400 font-mono">{totalHours} Hours</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Developer Role</span>
            <span className="text-xs font-medium text-cyan-300">{currentUser.specialization}</span>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading your assigned tasks...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && tasks.length === 0 && (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Tasks Assigned Yet</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
            You currently have no tasks assigned to your account ({currentUser.name}). Once projects
            are created from meeting transcripts, your allocated tasks will appear here.
          </p>
        </div>
      )}

      {/* Task Cards List */}
      {!isLoading && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                {/* Project & Client Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold text-white">{task.projectName || 'Project'}</span>
                  </div>
                  {task.clientName && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Client: {task.clientName}
                    </span>
                  )}
                </div>

                {/* Task Title */}
                <h3 className="text-base font-bold text-white mb-1.5">{task.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {task.description || 'No specific description provided.'}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2 text-xs">
                {task.managerName && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" /> Project Manager:
                    </span>
                    <span className="text-amber-300 font-medium">{task.managerName}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Deadline:
                  </span>
                  <span className="font-mono text-cyan-300 font-semibold">{task.deadline}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Estimated Hours:
                  </span>
                  <span className="font-mono text-indigo-300 font-bold">{task.estimatedHours} hrs</span>
                </div>

                {onOpenProject && (
                  <div className="pt-2 text-right">
                    <button
                      onClick={() => onOpenProject(task.projectId)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition"
                    >
                      View Parent Project →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
