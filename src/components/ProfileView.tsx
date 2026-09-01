import React from 'react';
import { Student } from '../types';
import { store } from '../services/store';
import { 
  User, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Trophy,
  ShieldCheck,
  Building,
  Sparkles,
  Edit3
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: Student;
  setActiveTab: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, setActiveTab }) => {
  const registrations = store.getStudentRegistrations(currentUser.student_id);
  const attendance = currentUser.attendance_percentage;
  const isEligible = attendance >= 60;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Profile Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 relative">
          <div className="absolute right-4 top-4 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-white text-xs font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Student Record</span>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center ring-4 ring-white dark:ring-slate-800 shadow-lg overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser.name.charAt(0)}</span>
                )}
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {currentUser.student_id} • {currentUser.email}
                </p>
              </div>
            </div>

            {/* Hackathon Eligibility Status Chip */}
            <div className="flex items-center gap-2">
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                isEligible
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
              }`}>
                {isEligible ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{isEligible ? '✓ Hackathon Eligible (≥ 60%)' : '✕ Hackathon Restricted (< 60%)'}</span>
              </span>
            </div>
          </div>

          {/* Academic Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Department</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{currentUser.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Academic Year</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">Year {currentUser.year || 3} Undergraduate</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Primary Domain</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">{currentUser.interested_domain}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Role</span>
              <span className="font-bold text-purple-600 dark:text-purple-400 mt-0.5 block capitalize">{currentUser.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row: Attendance, Engagement, Events, Registrations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Attendance Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span>Verified Attendance</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {attendance}%
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${attendance >= 60 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${attendance}%` }}
            ></div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {isEligible ? 'Meets 60% requirement' : 'Below 60% requirement'}
          </p>
        </div>

        {/* Engagement Score */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span>Engagement Index</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {currentUser.engagement_score}%
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
              style={{ width: `${currentUser.engagement_score}%` }}
            ></div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Class & Event participation</p>
        </div>

        {/* Events Attended */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span>Events Attended</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            6
          </div>
          <p className="mt-3 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            Verified Certificates Issued
          </p>
        </div>

        {/* Registrations */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span>Total Registrations</span>
            <Calendar className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {registrations.length + 6}
          </div>
          <p className="mt-3 text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
            {registrations.length} upcoming active
          </p>
        </div>
      </div>

      {/* Skills & Technical Interests */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Technical Domain & Skill Profile</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {(currentUser.skills || ['Python', 'Machine Learning', 'Data Science', 'Deep Learning']).map((sk, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold"
            >
              {sk}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
