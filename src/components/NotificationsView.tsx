import React, { useState } from 'react';
import { Student, NotificationItem } from '../types';
import { store } from '../services/store';
import { 
  Bell, 
  Trophy, 
  Calendar, 
  Sparkles, 
  AlertTriangle, 
  CheckCheck, 
  Clock, 
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface NotificationsViewProps {
  currentUser: Student;
  setActiveTab: (tab: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ currentUser, setActiveTab }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const notifications = store.getNotificationsForUser(currentUser.student_id);

  const filtered = notifications.filter(n => {
    if (filterType === 'ALL') return true;
    return n.notification_type === filterType;
  });

  const getIcon = (type: NotificationItem['notification_type']) => {
    switch (type) {
      case 'hackathon':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'recommendation':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'eligibility':
      case 'attendance':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Smart Campus Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notifications & Smart Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalized announcements, hackathon eligibility alerts, and AI recommendations.
          </p>
        </div>

        <button
          onClick={() => store.markAllNotificationsAsRead(currentUser.student_id)}
          className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold scrollbar-none">
        {['ALL', 'hackathon', 'event', 'recommendation', 'eligibility'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-full capitalize transition-all whitespace-nowrap ${
              filterType === type
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {type === 'ALL' ? 'All Alerts' : `${type}s`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No notifications found</h3>
            <p className="text-xs text-slate-400 mt-1">You're all caught up with campus events and announcements.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.notification_id}
              onClick={() => store.markNotificationAsRead(n.notification_id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.is_read
                  ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
                {getIcon(n.notification_type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {n.title}
                    </span>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {new Date(n.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {n.message}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {n.badge_text || n.notification_type}
                  </span>

                  {n.notification_type === 'hackathon' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('hackathons');
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Hackathon →
                    </button>
                  )}

                  {n.notification_type === 'event' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('events');
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Event Details →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
