import React from 'react';
import { Student } from '../types';
import { 
  LayoutDashboard, 
  Calendar, 
  Trophy, 
  ClipboardList, 
  Users, 
  Bell, 
  User, 
  Settings, 
  ShieldCheck, 
  Bot,
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarProps {
  currentUser: Student | null;
  currentRole: 'student' | 'admin';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenChatbot: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentRole,
  activeTab,
  setActiveTab,
  unreadCount,
  mobileOpen,
  setMobileOpen,
  onOpenChatbot,
}) => {
  const isAdmin = currentRole === 'admin' || currentUser?.role === 'admin';

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
    count?: number;
  }

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy, badge: '60% Rule' },
    { id: 'registrations', label: 'My Registrations', icon: ClipboardList },
    { id: 'matches', label: 'Matchmaker', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadCount },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin', label: 'Admin Center', icon: ShieldCheck, badge: 'Staff' },
    { id: 'dashboard', label: 'Student View', icon: LayoutDashboard },
    { id: 'events', label: 'Events Manager', icon: Calendar },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems: NavItem[] = isAdmin ? adminNavItems : studentNavItems;

  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col bg-[#0d1b2a] text-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-white/10 shadow-2xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                KUMARAGURU
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">
                AI Student Hub
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isAdmin ? 'Administration' : 'Main Portal'}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/20">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-1">
            <button
              onClick={onOpenChatbot}
              className="w-full flex items-center space-x-3 rounded-lg bg-gradient-to-r from-blue-700/60 to-indigo-700/60 border border-blue-500/30 p-2.5 text-xs font-medium text-white hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm"
            >
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-[11px] font-bold text-blue-200">AI Campus Bot</p>
                <p className="text-[9px] text-slate-300 truncate">Eligibility & Turnout AI</p>
              </div>
            </button>
          </div>
        </nav>

        {/* User Identity Footer */}
        {currentUser && (
          <div className="p-3.5 border-t border-white/10 bg-[#0a1522]">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
                {getInitials(currentUser.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium text-white">
                  {currentUser.name}
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  {currentUser.student_id} • Year {currentUser.year || 'III'}
                </p>
              </div>
              {currentUser.role === 'student' && (
                <div
                  className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                    currentUser.attendance_percentage >= 60 ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  title={`${currentUser.attendance_percentage}% Attendance (${
                    currentUser.attendance_percentage >= 60 ? 'Eligible' : 'Ineligible'
                  })`}
                />
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
