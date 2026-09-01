import React from 'react';
import { store } from '../services/store';
import { Student } from '../types';
import { CheckCircle, AlertTriangle, ShieldCheck, UserCheck, Code2 } from 'lucide-react';

interface DemoBannerProps {
  currentUser: Student | null;
  onOpenPythonModal: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ currentUser, onOpenPythonModal }) => {
  const handleSwitch = (id: string) => {
    store.switchUser(id);
  };

  const isCurrent = (id: string) => currentUser?.student_id === id;

  return (
    <aside aria-label="Demo Presentation Bar" className="bg-slate-900 text-white text-xs border-b border-slate-800 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold tracking-wider text-blue-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Demo Switcher:
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Student A (Eligible) */}
            <button
              id="demo-btn-student-a"
              onClick={() => handleSwitch('student001')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                isCurrent('student001')
                  ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Student A - Attendance 92% (Eligible for Hackathons)"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Student A (92% - Eligible)</span>
            </button>

            {/* Low Attendance Student (Ineligible) */}
            <button
              id="demo-btn-student-low"
              onClick={() => handleSwitch('student_low')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                isCurrent('student_low')
                  ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Low Attendance Demo - Attendance 54% (Blocked from Hackathons <60%)"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
              <span>Low Attendance Demo (54% - Ineligible)</span>
            </button>

            {/* Staff Admin */}
            <button
              id="demo-btn-admin"
              onClick={() => handleSwitch('admin001')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                isCurrent('admin001')
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Staff Admin - Access Management & Analytics"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>Staff Admin (Admin Portal)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <span>Current Role:</span>
            <span className="font-semibold text-slate-200 capitalize">
              {currentUser?.role || 'Guest'}
            </span>
            {currentUser?.role === 'student' && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  currentUser.attendance_percentage >= 60
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {currentUser.attendance_percentage}% Attd. ({currentUser.attendance_percentage >= 60 ? '✓ Eligible' : '✕ Restricted'})
              </span>
            )}
          </div>

          <button
            id="view-python-code-btn"
            onClick={onOpenPythonModal}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            title="Browse full Flask, SQLite, Scikit-learn & Python files"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Python/Flask Code</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
