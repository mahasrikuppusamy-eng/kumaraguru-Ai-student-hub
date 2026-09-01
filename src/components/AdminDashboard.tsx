import React, { useState } from 'react';
import { Student, EventItem, Hackathon, NotificationItem } from '../types';
import { store } from '../services/store';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BarChart3, 
  Bell, 
  Send, 
  Trash2, 
  Edit3, 
  Check, 
  Filter,
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  onOpenChatbot: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [adminTab, setAdminTab] = useState<'overview' | 'students' | 'events' | 'hackathons' | 'notifications'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [eligibilityFilter, setEligibilityFilter] = useState<'ALL' | 'ELIGIBLE' | 'INELIGIBLE'>('ALL');

  // Editing student attendance state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editAttendanceVal, setEditAttendanceVal] = useState<number>(75);

  // New Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('Artificial Intelligence');
  const [newEventDate, setNewEventDate] = useState('Sep 25, 2026');
  const [newEventVenue, setNewEventVenue] = useState('Main Seminar Hall');
  const [newEventCapacity, setNewEventCapacity] = useState(150);

  // New Hackathon Modal State
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [newHackName, setNewHackName] = useState('');
  const [newHackTech, setNewHackTech] = useState('AI & Web3');
  const [newHackDate, setNewHackDate] = useState('Oct 15, 2026');
  const [newHackVenue, setNewHackVenue] = useState('KCT Innovation Garage');
  const [newHackMinAttd, setNewHackMinAttd] = useState(60);

  // Notification Broadcast State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState<NotificationItem['notification_type']>('hackathon');
  const [notifTarget, setNotifTarget] = useState('ALL');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const students = store.getStudents();
  const events = store.getEvents();
  const hackathons = store.getHackathons();
  const analytics = store.getAnalytics();

  // Filtered students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.interested_domain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || s.department === departmentFilter;

    const matchesElig = eligibilityFilter === 'ALL' 
      ? true 
      : eligibilityFilter === 'ELIGIBLE' 
      ? s.attendance_percentage >= 60 
      : s.attendance_percentage < 60;

    return matchesSearch && matchesDept && matchesElig;
  });

  const handleSaveAttendance = (studentId: string) => {
    store.updateStudentAttendance(studentId, editAttendanceVal);
    setEditingStudentId(null);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName) return;

    store.addEvent({
      event_name: newEventName,
      category: newEventCategory,
      event_date: newEventDate,
      venue: newEventVenue,
      capacity: newEventCapacity,
      description: `Official campus event on ${newEventCategory} for undergraduate students.`,
      registration_deadline: '2 days prior',
      speaker: 'Faculty & Industry Experts',
      status: 'Open'
    });

    setShowEventModal(false);
    setNewEventName('');
    confetti({ particleCount: 50 });
  };

  const handleCreateHackathon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHackName) return;

    store.addHackathon({
      name: newHackName,
      technology: newHackTech,
      hackathon_date: newHackDate,
      venue: newHackVenue,
      team_size: '2-4 members',
      minimum_attendance: newHackMinAttd,
      description: `Competitive hackathon focusing on ${newHackTech}. Minimum ${newHackMinAttd}% attendance required.`,
      status: 'Open',
      registration_deadline: '1 week prior',
      prize_pool: '₹50,000'
    });

    setShowHackathonModal(false);
    setNewHackName('');
    confetti({ particleCount: 50 });
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMsg) return;

    store.broadcastNotification({
      title: notifTitle,
      message: notifMsg,
      notification_type: notifType,
      target_user_id: notifTarget,
      badge_text: notifType === 'hackathon' ? 'Hackathon Alert' : 'Announcement'
    });

    setNotifTitle('');
    setNotifMsg('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Admin Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrative Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kumaraguru Academic & Hackathon Portal Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Manage 100-student cohort, monitor 60% attendance eligibility, deploy events, and broadcast notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEventModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>

            <button
              onClick={() => setShowHackathonModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hackathon</span>
            </button>
          </div>
        </div>

        {/* Admin Subtabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-700/80 pt-4">
          {[
            { id: 'overview', label: 'Overview Analytics', icon: BarChart3 },
            { id: 'students', label: `Students Cohort (${students.length})`, icon: Users },
            { id: 'events', label: `Events (${events.length})`, icon: Calendar },
            { id: 'hackathons', label: `Hackathons (${hackathons.length})`, icon: Trophy },
            { id: 'notifications', label: 'Broadcast Dispatch', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-white text-slate-900 shadow-md font-bold'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Metrics Top Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block">Total Enrolled Students</span>
              <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                {analytics.totalStudents}
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 mt-2 block font-medium">
                100 Synthetic Database Records
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block">Average Attendance</span>
              <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                {analytics.averageAttendance}%
              </div>
              <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analytics.averageAttendance}%` }}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block">Hackathon Eligible Students (≥ 60%)</span>
              <div className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-2">
                <span>{analytics.eligibleStudents}</span>
                <span className="text-xs font-semibold text-slate-400">/ {analytics.totalStudents} ({Math.round((analytics.eligibleStudents/analytics.totalStudents)*100)}%)</span>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 block font-medium">
                ✓ Cleared for participation
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block">Ineligible Students (&lt; 60%)</span>
              <div className="mt-2 text-3xl font-black text-rose-600 dark:text-rose-400 flex items-baseline gap-2">
                <span>{analytics.ineligibleStudents}</span>
                <span className="text-xs font-semibold text-slate-400">/ {analytics.totalStudents} ({Math.round((analytics.ineligibleStudents/analytics.totalStudents)*100)}%)</span>
              </div>
              <span className="text-xs text-rose-600 dark:text-rose-400 mt-2 block font-medium">
                ✕ Restricted by attendance rule
              </span>
            </div>
          </div>

          {/* Attendance Distribution Chart & Engagement Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Distribution Visualization */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span>Attendance Distribution & Policy Breakdown</span>
                <span className="text-xs text-slate-400 font-normal">N = {analytics.totalStudents}</span>
              </h3>

              <div className="space-y-4 pt-2">
                {/* 75% and Above */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-700 dark:text-emerald-300">High Standing (≥ 75% Attendance)</span>
                    <span className="text-slate-800 dark:text-white">{analytics.attendanceDistribution.high} Students</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(analytics.attendanceDistribution.high / analytics.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* 60% - 74% */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-700 dark:text-amber-300">Eligible Threshold (60% - 74% Attendance)</span>
                    <span className="text-slate-800 dark:text-white">{analytics.attendanceDistribution.medium} Students</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${(analytics.attendanceDistribution.medium / analytics.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Below 60% */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-700 dark:text-rose-300">Restricted / Ineligible (&lt; 60% Attendance)</span>
                    <span className="text-slate-800 dark:text-white">{analytics.attendanceDistribution.low} Students</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${(analytics.attendanceDistribution.low / analytics.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <strong>System Policy Enforcement: </strong> 
                The 60% rule automatically checks the student's attendance percentage when creating any hackathon registration in the store. Ineligible students receive an immediate block.
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Administrative Quick Actions
              </h3>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setAdminTab('students')}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    <span>Update Student Attendance Records</span>
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setAdminTab('notifications')}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <span>Send Hackathon Attendance Warning Broadcast</span>
                  </span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setShowEventModal(true)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Publish New Campus Workshop</span>
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: STUDENTS COHORT TABLE (100 Students) */}
      {adminTab === 'students' && (
        <div className="space-y-4">
          
          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={eligibilityFilter}
                onChange={(e) => setEligibilityFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none"
              >
                <option value="ALL">All Eligibility Statuses</option>
                <option value="ELIGIBLE">✓ Eligible Only (≥ 60%)</option>
                <option value="INELIGIBLE">✕ Ineligible Only (&lt; 60%)</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Artificial Intelligence & Data Science">AI & DS</option>
                <option value="Information Technology">IT</option>
                <option value="Electronics & Communication Engineering">ECE</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] z-10">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Department & Year</th>
                    <th className="py-3 px-4">Interested Domain</th>
                    <th className="py-3 px-4">Attendance %</th>
                    <th className="py-3 px-4">Hackathon Eligibility</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredStudents.map((s) => {
                    const isElig = s.attendance_percentage >= 60;
                    const isEditing = editingStudentId === s.student_id;

                    return (
                      <tr key={s.student_id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30">
                        
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{s.name}</span>
                              <span className="text-[11px] text-slate-400">{s.student_id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          <div>{s.department}</div>
                          <div className="text-[10px] text-slate-400">Year {s.year}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-semibold">
                            {s.interested_domain}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={editAttendanceVal}
                                onChange={(e) => setEditAttendanceVal(parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 bg-white dark:bg-slate-900 border border-blue-500 rounded text-xs"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveAttendance(s.student_id)}
                                className="p-1 rounded bg-emerald-600 text-white"
                                title="Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {s.attendance_percentage}%
                              </span>
                              <button
                                onClick={() => {
                                  setEditingStudentId(s.student_id);
                                  setEditAttendanceVal(s.attendance_percentage);
                                }}
                                className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                title="Edit Attendance"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isElig
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                          }`}>
                            {isElig ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{isElig ? '✓ Eligible' : '✕ Ineligible (<60%)'}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              // Toggle eligibility by setting to 90 or 50
                              const targetVal = isElig ? 54 : 92;
                              store.updateStudentAttendance(s.student_id, targetVal);
                            }}
                            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                          >
                            Toggle Status
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS MANAGEMENT */}
      {adminTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Campus Events Catalog ({events.length})
            </h3>
            <button
              onClick={() => setShowEventModal(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <div key={e.event_id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    {e.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{e.event_name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{e.description}</p>
                  
                  <div className="mt-3 text-xs space-y-1 text-slate-400">
                    <div>📅 {e.event_date}</div>
                    <div>📍 {e.venue}</div>
                    <div>👥 Registered: {e.registered_count || 0} / {e.capacity}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                  <span className="text-emerald-600 font-bold">Status: {e.status}</span>
                  <button
                    onClick={() => store.deleteEvent(e.event_id)}
                    className="text-rose-500 hover:text-rose-700 font-semibold p-1"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HACKATHONS MANAGEMENT */}
      {adminTab === 'hackathons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Campus Hackathons ({hackathons.length})
            </h3>
            <button
              onClick={() => setShowHackathonModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create Hackathon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hackathons.map((h) => (
              <div key={h.hackathon_id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                      {h.status}
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      Min Attd: {h.minimum_attendance}%
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{h.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{h.description}</p>
                  
                  <div className="mt-3 text-xs space-y-1 text-slate-400">
                    <div>📅 Date: {h.hackathon_date}</div>
                    <div>📍 Venue: {h.venue}</div>
                    <div>💻 Tech: {h.technology}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Teams: {h.team_size}</span>
                  <button
                    onClick={() => store.deleteHackathon(h.hackathon_id)}
                    className="text-rose-500 hover:text-rose-700 font-semibold p-1"
                    title="Delete Hackathon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BROADCAST NOTIFICATIONS */}
      {adminTab === 'notifications' && (
        <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Broadcast Smart Announcement to Students
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish notifications directly into student feeds and AI chatbot context.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                placeholder="e.g. Python Hackathon 2026 Registration Open"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Detailed Message
              </label>
              <textarea
                rows={3}
                placeholder="Details of the announcement. Note that hackathon eligibility will be checked."
                value={notifMsg}
                onChange={(e) => setNotifMsg(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                >
                  <option value="hackathon">Hackathon Alert</option>
                  <option value="event">Event Alert</option>
                  <option value="eligibility">Eligibility Notice</option>
                  <option value="general">General Announcement</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Audience
                </label>
                <select
                  value={notifTarget}
                  onChange={(e) => setNotifTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                >
                  <option value="ALL">All 100 Students</option>
                  <option value="student001">Student A Only (student001)</option>
                  <option value="student002">Student B Only (student002)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast to Students</span>
              </button>

              {broadcastSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                  ✓ Announcement broadcasted successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Event</h3>
            
            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Event Name</label>
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="e.g. Next-Gen Web Development Summit"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Event Date</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Venue</label>
                  <input
                    type="text"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newEventCapacity}
                    onChange={(e) => setNewEventCapacity(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE HACKATHON MODAL */}
      {showHackathonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Hackathon</h3>
            
            <form onSubmit={handleCreateHackathon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Hackathon Name</label>
                <input
                  type="text"
                  value={newHackName}
                  onChange={(e) => setNewHackName(e.target.value)}
                  placeholder="e.g. AI Agents 48h Sprint"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={newHackTech}
                    onChange={(e) => setNewHackTech(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Date</label>
                  <input
                    type="text"
                    value={newHackDate}
                    onChange={(e) => setNewHackDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Venue</label>
                  <input
                    type="text"
                    value={newHackVenue}
                    onChange={(e) => setNewHackVenue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Min Attendance Required (%)</label>
                  <input
                    type="number"
                    value={newHackMinAttd}
                    onChange={(e) => setNewHackMinAttd(parseInt(e.target.value) || 60)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowHackathonModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl"
                >
                  Publish Hackathon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
