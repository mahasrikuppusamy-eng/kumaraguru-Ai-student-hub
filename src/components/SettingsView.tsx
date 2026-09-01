import React, { useState } from 'react';
import { Student } from '../types';
import { store } from '../services/store';
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  Sliders, 
  Check, 
  Laptop
} from 'lucide-react';

interface SettingsViewProps {
  currentUser: Student;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, darkMode, setDarkMode }) => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [hackathonAlerts, setHackathonAlerts] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [tempAttendance, setTempAttendance] = useState(currentUser.attendance_percentage);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpdateAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateStudentAttendance(currentUser.student_id, tempAttendance);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo state back to default SQLite seed?')) {
      store.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Preferences & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize themes, notification channels, and test attendance thresholds for hackathon eligibility.
        </p>
      </div>

      {/* Theme Settings Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Interface Appearance</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setDarkMode(false)}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              !darkMode 
                ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-sm' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <div className="text-left">
              <div className="text-xs">Light Theme</div>
              <div className="text-[10px] text-slate-400 font-normal">Clean campus standard</div>
            </div>
          </button>

          <button
            onClick={() => setDarkMode(true)}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              darkMode 
                ? 'bg-slate-700 border-blue-400 text-white font-bold shadow-sm' 
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <div className="text-xs">Dark Theme</div>
              <div className="text-[10px] text-slate-400 font-normal">High contrast twilight</div>
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Attendance Simulator for Demo Testing */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Attendance Eligibility Simulator (Demo Mode)</span>
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
            Live Testing
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Slide to test how the platform and chatbot dynamically respond when attendance is above or below the strict 60% hackathon threshold.
        </p>

        <form onSubmit={handleUpdateAttendance} className="space-y-4 pt-2">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Attendance Percentage: {tempAttendance}%
              </label>
              <span className={`text-xs font-bold ${tempAttendance >= 60 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tempAttendance >= 60 ? '✓ Eligible (≥ 60%)' : '✕ Restricted (< 60%)'}
              </span>
            </div>

            <input
              type="range"
              min="30"
              max="100"
              value={tempAttendance}
              onChange={(e) => setTempAttendance(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply Attendance Change</span>
            </button>

            {saveSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                ✓ Attendance updated in SQLite store!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-600" />
          <span>Notification Channels</span>
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Email Digest</span>
              <span className="text-slate-400 text-[11px]">Send summaries to {currentUser.email}</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Hackathon Registration Deadlines</span>
              <span className="text-slate-400 text-[11px]">Instant alerts 48h before closing</span>
            </div>
            <input
              type="checkbox"
              checked={hackathonAlerts}
              onChange={(e) => setHackathonAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Attendance Threshold Warnings</span>
              <span className="text-slate-400 text-[11px]">Alert when attendance approaches or drops below 60%</span>
            </div>
            <input
              type="checkbox"
              checked={attendanceAlerts}
              onChange={(e) => setAttendanceAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Database Reset Action */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-slate-400" />
            <span>SQLite Database Seed State</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Reset synthetic 100 students and default campus registrations</p>
        </div>

        <button
          onClick={handleResetData}
          className="px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Database</span>
        </button>
      </div>

    </div>
  );
};
