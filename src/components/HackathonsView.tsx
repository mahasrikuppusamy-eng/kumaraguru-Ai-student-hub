import React, { useState } from 'react';
import { Student, Hackathon } from '../types';
import { store } from '../services/store';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Award, 
  Sparkles,
  Info,
  Check,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HackathonsViewProps {
  currentUser: Student;
  onOpenChatbot: () => void;
  setActiveTab: (tab: string) => void;
}

export const HackathonsView: React.FC<HackathonsViewProps> = ({
  currentUser,
  onOpenChatbot,
  setActiveTab,
}) => {
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const hackathons = store.getHackathons();
  const registrations = store.getStudentRegistrations(currentUser.student_id);
  const attendance = currentUser.attendance_percentage;
  const isEligible = attendance >= 60;

  const isRegistered = (hackathonId: string) => {
    return registrations.some(r => r.item_id === hackathonId && r.status === 'Registered');
  };

  const handleRegister = (hackathon: Hackathon) => {
    setRegisteringId(hackathon.hackathon_id);
    setFeedback(null);

    const result = store.registerForHackathon(hackathon.hackathon_id, currentUser.student_id);

    setTimeout(() => {
      setRegisteringId(null);
      if (result.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setFeedback({ message: result.message, type: 'success' });
      } else {
        setFeedback({ message: result.message, type: 'error' });
      }
    }, 400);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* Section 16 Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-blue-900/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Kumaraguru Competitive Arena</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            HACKATHONS
          </h1>
          <p className="text-lg sm:text-xl font-medium text-blue-200 mt-2">
            Build. Innovate. Compete.
          </p>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Collaborate with multidisciplinary peers, solve real-world problems with AI, Cloud, and Web technologies, and pitch to industry judges.
          </p>

          {/* Student Status Summary Strip */}
          <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                isEligible ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {isEligible ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-xs text-slate-300">Your Current Attendance</div>
                <div className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>{attendance}%</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isEligible 
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30' 
                      : 'bg-rose-500/30 text-rose-300 border border-rose-400/30'
                  }`}>
                    {isEligible ? '✓ Eligible (≥ 60%)' : '✕ Ineligible (< 60%)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-300">
              <span className="block font-semibold text-white">Minimum Policy: 60% Attendance</span>
              <span>Enforced strictly in backend verification</span>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-sm font-medium flex items-center justify-between gap-3 shadow-md ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)}
            className="text-xs font-bold opacity-70 hover:opacity-100 px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mandatory Hackathon Rule Alert Box */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-300">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="leading-relaxed">
          <strong className="font-bold">Official Campus Hackathon Eligibility Mandate: </strong>
          In accordance with Academic Regulation Section 3, all students must maintain at least <strong>60% attendance</strong> to be eligible to register for any college hackathon. Registrations are verified against the central SQLite records during submission.
        </div>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {hackathons.map((hackathon) => {
          const registered = isRegistered(hackathon.hackathon_id);
          const minReq = hackathon.minimum_attendance || 60;
          const meetsRequirement = attendance >= minReq;

          return (
            <div
              key={hackathon.hackathon_id}
              className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                meetsRequirement
                  ? 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-700'
                  : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/10'
              }`}
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    hackathon.status === 'Open'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {hackathon.status}
                  </span>

                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Deadline: {hackathon.registration_deadline}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {hackathon.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                  {hackathon.description}
                </p>

                {/* Key Metadata Badges */}
                <div className="mt-5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span><strong>Date:</strong> {hackathon.hackathon_date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span className="truncate"><strong>Venue:</strong> {hackathon.venue}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                    <span><strong>Team Size:</strong> {hackathon.team_size}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="truncate"><strong>Tech:</strong> {hackathon.technology}</span>
                  </div>
                </div>

                {/* Section 4 Dynamic Eligibility Badge & Explanation */}
                <div className={`mt-5 p-3.5 rounded-xl border text-xs ${
                  meetsRequirement
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300'
                    : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-300'
                }`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{meetsRequirement ? '✓ ELIGIBLE FOR HACKATHON' : '✕ NOT ELIGIBLE FOR HACKATHON'}</span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-white/60 dark:bg-black/40">
                      Req: ≥ {minReq}%
                    </span>
                  </div>

                  <div className="text-[11px] mt-1 opacity-90 leading-relaxed">
                    {meetsRequirement ? (
                      <p>Your attendance: <strong>{attendance}%</strong>. You meet the minimum {minReq}% attendance requirement.</p>
                    ) : (
                      <p>
                        Your attendance: <strong>{attendance}%</strong>. Minimum attendance required: <strong>{minReq}%</strong>. You cannot register because your attendance is below the required minimum.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  id={`hackathon-details-btn-${hackathon.hackathon_id}`}
                  onClick={() => setSelectedHackathon(hackathon)}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                  View Details
                </button>

                {registered ? (
                  <button
                    disabled
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-default"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Registered</span>
                  </button>
                ) : meetsRequirement ? (
                  <button
                    id={`hackathon-register-btn-${hackathon.hackathon_id}`}
                    onClick={() => handleRegister(hackathon)}
                    disabled={registeringId === hackathon.hackathon_id}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{registeringId === hackathon.hackathon_id ? 'Checking...' : 'Register Now'}</span>
                  </button>
                ) : (
                  <button
                    id={`hackathon-disabled-btn-${hackathon.hackathon_id}`}
                    disabled
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1"
                    title="Registration Disabled: Attendance is below 60%"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Disabled (&lt;60%)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedHackathon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Kumaraguru Hackathon Series 2026
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedHackathon.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedHackathon(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedHackathon.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Event Date</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedHackathon.hackathon_date}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Venue</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{selectedHackathon.venue}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Team Size</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedHackathon.team_size}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Tech Stack</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedHackathon.technology}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Prize Pool</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedHackathon.prize_pool || '₹50,000'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Attendance Rule</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">Min. {selectedHackathon.minimum_attendance}%</span>
              </div>
            </div>

            {/* Eligibility Banner in Modal */}
            <div className={`p-4 rounded-xl border text-xs ${
              attendance >= (selectedHackathon.minimum_attendance || 60)
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="font-bold text-sm">
                {attendance >= (selectedHackathon.minimum_attendance || 60)
                  ? '✓ ELIGIBLE FOR HACKATHON'
                  : '✕ NOT ELIGIBLE FOR HACKATHON'}
              </div>
              <p className="mt-1">
                Your attendance is <strong>{attendance}%</strong>. The required minimum is <strong>{selectedHackathon.minimum_attendance || 60}%</strong>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedHackathon(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>

              {attendance >= (selectedHackathon.minimum_attendance || 60) ? (
                <button
                  onClick={() => {
                    handleRegister(selectedHackathon);
                    setSelectedHackathon(null);
                  }}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Submit Team Registration</span>
                </button>
              ) : (
                <button
                  disabled
                  className="px-5 py-2 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 text-xs font-bold cursor-not-allowed flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Registration Restricted</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
