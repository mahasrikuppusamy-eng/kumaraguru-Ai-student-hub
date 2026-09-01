import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../types';
import { store } from '../services/store';
import { 
  Bell, 
  Bot, 
  Sun, 
  Moon, 
  Menu, 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle,
  Check,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentUser: Student | null;
  currentRole: 'student' | 'admin';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  unreadNotificationCount: number;
  onOpenChatbot: () => void;
  onSelectRole: (role: 'student' | 'admin') => void;
  onSelectStudent: (student: Student) => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  unreadNotificationCount,
  onOpenChatbot,
  onSelectRole,
  onSelectStudent,
  onToggleMobileSidebar,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const notifications = currentUser ? store.getNotificationsForUser(currentUser.student_id) : [];

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const students = store.getStudents();
  const studentA = students.find((s) => s.student_id === 'student001') || students[0];
  const studentLow = students.find((s) => s.student_id === 'student_low') || students.find((s) => s.attendance_percentage < 60) || students[1];
  const adminUser = students.find((s) => s.role === 'admin') || {
    ...students[0],
    name: 'Dr. K. Rathinam (Admin)',
    student_id: 'admin001',
    role: 'admin' as const,
    attendance_percentage: 100,
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Student Dashboard';
      case 'events':
        return 'Events & Workshops';
      case 'hackathons':
        return 'Hackathons Arena';
      case 'registrations':
        return 'My Registrations';
      case 'matches':
        return 'AI Matchmaker';
      case 'notifications':
        return 'Campus Notifications';
      case 'profile':
        return 'Academic Profile';
      case 'settings':
        return 'Hub Settings';
      case 'admin':
      case 'admin-dashboard':
        return 'Admin Control Center';
      default:
        return 'Student Dashboard';
    }
  };

  const getSubtitleBadge = () => {
    if (currentRole === 'admin' || activeTab === 'admin') {
      return 'Staff Administrator • Full Access';
    }
    if (!currentUser) return 'Kumaraguru Portal';
    return `Semester ${currentUser.semester || 'V'} • ${currentUser.interested_domain || 'AI/ML Stream'}`;
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 transition-colors shadow-xs">
      
      {/* Left Title & Mobile Menu Toggle */}
      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 sm:space-x-3 truncate">
          <h2 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white truncate">
            {getTitle()}
          </h2>
          <span className="hidden md:inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/80">
            {getSubtitleBadge()}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        
        {/* Quick Demo Persona Switcher (High Density Chips) */}
        <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700/80 text-[11px]">
          <span className="text-[10px] font-bold uppercase text-slate-400 px-1.5">Persona:</span>
          
          <button
            onClick={() => {
              if (studentA) onSelectStudent(studentA);
            }}
            className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
              currentUser?.student_id === studentA?.student_id && currentRole !== 'admin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Student A (92%)</span>
          </button>

          <button
            onClick={() => {
              if (studentLow) onSelectStudent(studentLow);
            }}
            className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
              currentUser?.student_id === studentLow?.student_id && currentRole !== 'admin'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Student B (54%)</span>
          </button>

          <button
            onClick={() => {
              onSelectRole(currentRole === 'admin' ? 'student' : 'admin');
            }}
            className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
              currentRole === 'admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="navbar-notification-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Notification Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Smart Notifications</span>
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={() => store.markAllNotificationsAsRead(currentUser?.student_id)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-5 text-center text-xs text-slate-500 dark:text-slate-400">
                    No notifications at this time.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.notification_id}
                      onClick={() => {
                        store.markNotificationAsRead(n.notification_id);
                        setActiveTab('notifications');
                        setNotificationsOpen(false);
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                        !n.is_read ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {n.title}
                        </span>
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed text-[11px]">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setNotificationsOpen(false);
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 w-full py-1"
                >
                  <span>View all notifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {/* Switch Role Action Button (Admin / Student) */}
        <button
          onClick={() => {
            const targetRole = currentRole === 'admin' ? 'student' : 'admin';
            onSelectRole(targetRole);
          }}
          className="rounded-md bg-slate-900 dark:bg-blue-600 px-3 sm:px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors shadow-xs"
        >
          {currentRole === 'admin' ? 'Switch to Student' : 'Switch to Admin'}
        </button>
      </div>

    </header>
  );
};
