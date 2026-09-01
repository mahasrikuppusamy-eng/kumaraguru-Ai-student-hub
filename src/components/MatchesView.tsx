import React, { useState } from 'react';
import { Student } from '../types';
import { store } from '../services/store';
import { findTeammateMatches } from '../services/mlService';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Send, 
  Award, 
  Code2, 
  Check, 
  Zap,
  GraduationCap
} from 'lucide-react';

interface MatchesViewProps {
  currentUser: Student;
}

export const MatchesView: React.FC<MatchesViewProps> = ({ currentUser }) => {
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedStudentId, setInvitedStudentId] = useState<string | null>(null);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  const allStudents = store.getStudents();
  const matches = findTeammateMatches(currentUser, allStudents, {
    onlyEligible,
    searchDomain: selectedDomain,
  });

  const domains = ['ALL', 'Artificial Intelligence', 'Machine Learning', 'Web Development', 'Data Science', 'Cybersecurity', 'Cloud Computing', 'Python Programming'];

  const filteredMatches = matches.filter(m => {
    const q = searchQuery.toLowerCase();
    return m.student.name.toLowerCase().includes(q) ||
      m.student.student_id.toLowerCase().includes(q) ||
      m.student.interested_domain.toLowerCase().includes(q);
  });

  const handleSendInvite = (student: Student) => {
    setInvitedStudentId(student.student_id);
    setTimeout(() => {
      setInvitedStudentId(null);
      setInviteSuccessMsg(`Hackathon Team invitation sent to ${student.name}! They will receive a notification.`);
      setTimeout(() => setInviteSuccessMsg(null), 4000);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white p-6 sm:p-10 shadow-xl border border-indigo-800/40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Cosine Similarity AI Matching</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            AI Student Team Matchmaker
          </h1>

          <p className="mt-2 text-indigo-100 text-xs sm:text-sm leading-relaxed">
            Finding compatible project & hackathon teammates using vector cosine similarity across technical domains, skills, and academic departments.
          </p>

          {/* Current Student Profile Snapshot */}
          <div className="mt-5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 inline-flex items-center gap-3 text-xs">
            <GraduationCap className="w-5 h-5 text-sky-300" />
            <div>
              <span className="text-slate-300">Matching with your profile: </span>
              <span className="font-bold text-white">{currentUser.name}</span>
              <span className="mx-2">•</span>
              <span className="font-semibold text-blue-200">{currentUser.interested_domain}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {inviteSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{inviteSuccessMsg}</span>
          </div>
          <button onClick={() => setInviteSuccessMsg(null)}>✕</button>
        </div>
      )}

      {/* Controls: Search, Domain Filter, Eligibility Toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search students, skills, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          {/* Hackathon Eligibility Filter Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none bg-slate-50 dark:bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) => setOnlyEligible(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Show Hackathon Eligible Only (≥ 60% Attendance)</span>
            </span>
          </label>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold flex-shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Domain:
          </span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedDomain === dom
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMatches.slice(0, 18).map(({ student, matchPercentage, sharedInterests, isHackathonEligible }) => (
          <div
            key={student.student_id}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Name, Match % and Eligibility Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {student.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {student.student_id} • Year {student.year}
                    </span>
                  </div>
                </div>

                {/* Match Percentage Badge */}
                <div className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold border border-indigo-100 dark:border-indigo-800">
                  {matchPercentage}% Match
                </div>
              </div>

              {/* Department & Domain */}
              <div className="mt-3.5 space-y-1 text-xs">
                <div className="text-slate-600 dark:text-slate-300 font-medium truncate">
                  {student.department}
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{student.interested_domain}</span>
                </div>
              </div>

              {/* Skills / Shared Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {(student.skills || []).slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Attendance & Hackathon Status Strip (Section 23) */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Attd: <strong>{student.attendance_percentage}%</strong>
                </span>

                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isHackathonEligible
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                }`}>
                  {isHackathonEligible ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  <span>{isHackathonEligible ? '✓ Eligible' : '✕ Not Eligible'}</span>
                </span>
              </div>
            </div>

            {/* Invite Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={() => handleSendInvite(student)}
                disabled={invitedStudentId === student.student_id}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{invitedStudentId === student.student_id ? 'Sending...' : 'Invite to Hackathon Team'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
