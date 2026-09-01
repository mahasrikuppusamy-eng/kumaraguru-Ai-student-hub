import React, { useState } from 'react';
import { Student, EventItem, Hackathon } from '../types';
import { store } from '../services/store';
import { predictEventAttendance } from '../services/mlService';
import { 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Bot, 
  Users, 
  Clock, 
  MapPin, 
  Award,
  AlertOctagon,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentDashboardProps {
  currentUser: Student;
  setActiveTab: (tab: string) => void;
  onOpenChatbot: () => void;
  onSelectHackathon?: (hackathonId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  setActiveTab,
  onOpenChatbot,
}) => {
  const [registering, setRegistering] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const events = store.getEvents();
  const hackathons = store.getHackathons();
  const registrations = store.getStudentRegistrations(currentUser.student_id);
  const notifications = store.getNotificationsForUser(currentUser.student_id);

  const attendance = currentUser.attendance_percentage;
  const isEligibleForHackathons = attendance >= 60;

  // Primary event for ML attendance prediction
  const primaryEvent = events[0];
  const mlPrediction = primaryEvent ? predictEventAttendance(currentUser, primaryEvent) : null;

  // Featured hackathon
  const activeHackathon = hackathons.find((h) => h.status === 'Open') || hackathons[0];
  const isHackathonRegistered = registrations.some(
    (r) => r.item_id === activeHackathon?.hackathon_id && r.status === 'Registered'
  );

  const handleRegisterHackathon = (hackathon: Hackathon) => {
    setRegistering(hackathon.hackathon_id);
    setFeedback(null);

    // Call store which enforces 60% rule in logic
    const result = store.registerForHackathon(hackathon.hackathon_id, currentUser.student_id);
    
    setTimeout(() => {
      setRegistering(null);
      if (result.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
        setFeedback({ message: result.message, type: 'success' });
      } else {
        setFeedback({ message: result.message, type: 'error' });
      }
    }, 400);
  };

  const handleRegisterEvent = (event: EventItem) => {
    setRegistering(event.event_id);
    setFeedback(null);
    const result = store.registerForEvent(event.event_id, currentUser.student_id);
    setTimeout(() => {
      setRegistering(null);
      if (result.success) {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
        setFeedback({ message: result.message, type: 'success' });
      } else {
        setFeedback({ message: result.message, type: 'error' });
      }
    }, 300);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between gap-3 shadow-xs ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertOctagon className="w-4 h-4 flex-shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold px-1.5 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4-Column High Density Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Engagement Score */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Engagement Score
          </p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {currentUser.engagement_score}%
            </span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4%
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-blue-600 transition-all duration-500" 
              style={{ width: `${currentUser.engagement_score}%` }}
            />
          </div>
        </div>

        {/* Events Attended */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Events Attended
          </p>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {registrations.length + 4}
            </span>
            <span className="text-sm text-slate-400">
              {' '}/ 15 Registered
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {registrations.length} active in current term
          </p>
        </div>

        {/* Current Attendance & Eligibility (Col-span-2) */}
        <div className={`col-span-1 sm:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex items-center justify-between border-l-4 ${
          isEligibleForHackathons ? 'border-l-green-500' : 'border-l-rose-500'
        }`}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Current Attendance
            </p>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {attendance}%
              </span>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isEligibleForHackathons 
                  ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300' 
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              }`}>
                {isEligibleForHackathons ? '✓ ELIGIBLE FOR HACKATHON' : '✕ NOT ELIGIBLE (<60%)'}
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Min. Requirement: 60% • Verified Sep 01, 2026
            </p>
          </div>
          
          <div className={`h-16 w-16 flex items-center justify-center rounded-full border-4 ${
            isEligibleForHackathons ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-rose-500 text-rose-600 dark:text-rose-400'
          } font-bold text-lg flex-shrink-0`}>
            {attendance}
          </div>
        </div>

      </div>

      {/* 3-Column Split Section: Upcoming Opportunities (2 Cols) + Smart Notifications (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Upcoming Opportunities */}
        <section className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">
                Upcoming Opportunities
              </h3>
              <button 
                onClick={() => setActiveTab('events')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                View All Events
              </button>
            </div>

            <div className="space-y-3">
              {/* Python Innovation Hackathon Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="h-10 w-10 bg-slate-900 dark:bg-slate-800 rounded-lg flex items-center justify-center text-white font-mono font-bold italic text-base flex-shrink-0 shadow-xs border border-slate-700">
                    P
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Python Innovation Hackathon 2026
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Sep 08 • Team Size: 2-4 • Prize: ₹50,000 • Min. 60% Attendance
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isHackathonRegistered ? (
                    <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-bold rounded-md flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> REGISTERED
                    </span>
                  ) : isEligibleForHackathons ? (
                    <button 
                      onClick={() => handleRegisterHackathon(activeHackathon)}
                      disabled={registering === activeHackathon?.hackathon_id}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[11px] font-bold rounded-md transition-colors shadow-xs"
                    >
                      {registering === activeHackathon?.hackathon_id ? 'REGISTERING...' : 'REGISTER NOW'}
                    </button>
                  ) : (
                    <span 
                      className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold rounded-md cursor-not-allowed border border-slate-300 dark:border-slate-700"
                      title="Attendance below 60% - Registration restricted"
                    >
                      NOT ELIGIBLE
                    </span>
                  )}
                </div>
              </div>

              {/* Advanced ML Workshop */}
              {events[0] && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="h-10 w-10 bg-slate-700 dark:bg-slate-700/80 rounded-lg flex items-center justify-center text-white font-mono font-bold italic text-base flex-shrink-0 shadow-xs">
                      W
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {events[0].event_name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {events[0].event_date} • Venue: {events[0].venue} • Speaker: {events[0].speaker || 'Dr. Sivakumar'}
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    <button 
                      onClick={() => handleRegisterEvent(events[0])}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-[11px] font-bold rounded-md transition-colors"
                    >
                      REGISTER
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Embedded AI Attendance Prediction Box */}
          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
            <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-wide flex items-center">
              <span className="mr-2">✨</span> AI Attendance Prediction
            </h4>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-xs text-blue-700 dark:text-blue-300 sm:pr-8 leading-relaxed">
                Based on your {attendance}% attendance and domain profile ({currentUser.interested_domain}), you have an{' '}
                <span className="font-bold text-blue-900 dark:text-blue-200">
                  {mlPrediction ? `${Math.round(mlPrediction.probability)}% likelihood` : '87% likelihood'}
                </span>{' '}
                of attending the Python Innovation Hackathon.
              </p>
              <div className="text-left sm:text-center flex-shrink-0 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-800">
                <div className="text-base sm:text-lg font-black text-blue-800 dark:text-blue-300 leading-tight">
                  {mlPrediction?.classification.includes('Likely') ? 'LIKELY' : 'MEDIUM'}
                </div>
                <div className="text-[9px] text-blue-600 dark:text-blue-400 font-bold tracking-wider">
                  TO ATTEND
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Smart Notifications */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm sm:text-base">
              Smart Notifications
            </h3>
            
            <div className="space-y-4">
              {/* Notification 1 */}
              <div className="relative pl-6 pb-3.5 border-l-2 border-blue-200 dark:border-blue-900">
                <div className="absolute -left-[7px] top-0 h-3 w-3 rounded-full bg-blue-600" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  New Hackathon Alert
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                  Python Innovation 2026 is now open. Your {attendance}% attendance makes you{' '}
                  <span className={isEligibleForHackathons ? 'text-green-600 font-semibold' : 'text-rose-600 font-semibold'}>
                    {isEligibleForHackathons ? 'eligible' : 'ineligible'}
                  </span>!
                </p>
                <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">
                  10 minutes ago
                </p>
              </div>

              {/* Notification 2 */}
              <div className="relative pl-6 pb-3.5 border-l-2 border-slate-200 dark:border-slate-800">
                <div className="absolute -left-[7px] top-0 h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Team Match Suggestion
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  We found 3 students matching your interest in '{currentUser.interested_domain}'.
                </p>
                <p className="text-[9px] text-slate-400 mt-1 uppercase font-medium">
                  2 hours ago
                </p>
              </div>

              {/* Notification 3 */}
              <div className="relative pl-6 pb-1">
                <div className="absolute -left-[7px] top-0 h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Attendance Update
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  Academic record synchronized after lab session. Current: {attendance}%.
                </p>
                <p className="text-[9px] text-slate-400 mt-1 uppercase font-medium">
                  Yesterday
                </p>
              </div>
            </div>
          </div>

          {/* AI Assistant Quick Launcher Card */}
          <div 
            onClick={onOpenChatbot}
            className="mt-5 p-3 bg-slate-900 dark:bg-blue-950/80 rounded-lg text-white flex items-center justify-between cursor-pointer hover:bg-slate-800 dark:hover:bg-blue-900 transition-colors shadow-xs"
          >
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tight">
                AI Assistant
              </p>
              <p className="text-[11px] font-medium text-slate-200 truncate">
                Am I eligible for any other hackathon?
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
              🤖
            </div>
          </div>
        </section>

      </div>

    </div>
  );
};
