import React from 'react';
import { Student } from '../types';
import { store } from '../services/store';
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertOctagon, 
  Calendar, 
  Trophy, 
  ArrowRight,
  ShieldAlert,
  Download
} from 'lucide-react';

interface RegistrationsViewProps {
  currentUser: Student;
  setActiveTab: (tab: string) => void;
}

export const RegistrationsView: React.FC<RegistrationsViewProps> = ({ currentUser, setActiveTab }) => {
  const registrations = store.getStudentRegistrations(currentUser.student_id);
  const attendance = currentUser.attendance_percentage;
  const isEligible = attendance >= 60;

  // Add default demo registered records if empty for Student A
  const displayRegistrations = [...registrations];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Academic Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Event & Hackathon Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Confirmed registrations, participation records, and hackathon verification statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Attendance Standing</span>
            <span className={`text-xs font-bold ${isEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
              {attendance}% ({isEligible ? '✓ Eligible for Hackathons' : '✕ Restricted <60%'})
            </span>
          </div>
        </div>
      </div>

      {/* Attendance & Hackathon Policy Banner */}
      {!isEligible && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200 shadow-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <div>
            <span className="font-bold">Hackathon Registration Notice: </span>
            Your current attendance is <strong>{attendance}%</strong>. Because minimum attendance for hackathons is <strong>60%</strong>, hackathon registrations will remain in <em>Registration Restricted</em> status until your class attendance reaches 60%.
          </div>
        </div>
      )}

      {/* Registrations Table Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {displayRegistrations.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">No registrations found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You have not registered for any events or hackathons yet. Check out the calendar to participate!
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('events')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
              >
                Browse Events
              </button>
              <button
                onClick={() => setActiveTab('hackathons')}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Explore Hackathons
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Event / Hackathon</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6">Eligibility / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {displayRegistrations.map((reg) => {
                  const isRestricted = reg.status === 'Restricted';
                  return (
                    <tr key={reg.registration_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            reg.item_type === 'hackathon' 
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                          }`}>
                            {reg.item_type === 'hackathon' ? <Trophy className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-xs">
                              {reg.item_title}
                            </span>
                            <span className="text-[11px] text-slate-400">ID: {reg.registration_id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {reg.date}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          reg.item_type === 'hackathon'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {reg.item_type}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          reg.status === 'Registered'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                        }`}>
                          {reg.status === 'Registered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
                          <span>{reg.status}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {isRestricted ? (
                          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                            {reg.rejection_reason || 'Registration Restricted: Attendance below 60%'}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Eligible (Verified {attendance}%)</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
