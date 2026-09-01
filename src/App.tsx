/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Student } from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { HackathonsView } from './components/HackathonsView';
import { EventsView } from './components/EventsView';
import { RegistrationsView } from './components/RegistrationsView';
import { MatchesView } from './components/MatchesView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AdminDashboard } from './components/AdminDashboard';
import { AIChatbotModal } from './components/AIChatbotModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Student | null>(store.getCurrentUser());
  const [currentRole, setCurrentRole] = useState<'student' | 'admin'>(store.getCurrentRole());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Subscribe to store updates (re-render on attendance/event changes)
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setCurrentRole(store.getCurrentRole());
    });
    return unsubscribe;
  }, []);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle switching persona
  const handleSelectStudent = (student: Student) => {
    store.setCurrentUser(student);
    store.setCurrentRole(student.role);
    if (student.role === 'admin') {
      setActiveTab('admin');
    } else if (activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  };

  const handleSelectRole = (role: 'student' | 'admin') => {
    store.setCurrentRole(role);
    if (role === 'admin') {
      setActiveTab('admin');
    } else if (activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  };

  // Notification count
  const unreadCount = currentUser ? store.getUnreadNotificationCount(currentUser.student_id) : 0;

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${
      darkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-[#f3f4f6] text-slate-900'
    }`}>
      
      {/* High Density Left Sidebar (Deep Navy #0d1b2a) */}
      <Sidebar
        currentUser={currentUser}
        currentRole={currentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Main App Canvas */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        
        {/* High Density Header Bar */}
        <Navbar
          currentUser={currentUser}
          currentRole={currentRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          unreadNotificationCount={unreadCount}
          onOpenChatbot={() => setIsChatbotOpen(true)}
          onSelectRole={handleSelectRole}
          onSelectStudent={handleSelectStudent}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl w-full mx-auto">
          {currentRole === 'admin' || activeTab === 'admin' ? (
            <AdminDashboard onOpenChatbot={() => setIsChatbotOpen(true)} />
          ) : currentUser ? (
            <>
              {activeTab === 'dashboard' && (
                <StudentDashboard
                  currentUser={currentUser}
                  setActiveTab={setActiveTab}
                  onOpenChatbot={() => setIsChatbotOpen(true)}
                />
              )}

              {activeTab === 'hackathons' && (
                <HackathonsView
                  currentUser={currentUser}
                  onOpenChatbot={() => setIsChatbotOpen(true)}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'events' && (
                <EventsView currentUser={currentUser} />
              )}

              {activeTab === 'registrations' && (
                <RegistrationsView
                  currentUser={currentUser}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'matches' && (
                <MatchesView currentUser={currentUser} />
              )}

              {activeTab === 'notifications' && (
                <NotificationsView
                  currentUser={currentUser}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  currentUser={currentUser}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  currentUser={currentUser}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />
              )}
            </>
          ) : (
            <div className="p-12 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold">Please select a student profile to begin</h2>
            </div>
          )}
        </main>

        {/* High Density Technical Status Footer */}
        <footer className="px-4 sm:px-6 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-medium gap-2">
          <p>Prototype developed for academic/hackathon demonstration purposes.</p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 dark:text-slate-500 font-bold">SYSTEM STATUS: NOMINAL</span>
            <span className="text-slate-400 dark:text-slate-500 font-bold hidden sm:inline">DB: SQLITE / PERSISTED</span>
            <span className="text-slate-400 dark:text-slate-500 font-bold">ML: RANDOM FOREST</span>
          </div>
        </footer>

      </div>

      {/* Floating High Density AI Campus Assistant Button */}
      <div 
        id="floating-ai-assistant-btn"
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 h-11 px-4 rounded-full bg-slate-900 dark:bg-blue-600 text-white shadow-xl border border-white/20 flex items-center space-x-2.5 cursor-pointer hover:scale-105 transition-all text-xs font-bold z-30"
        title="Open AI Campus Assistant"
      >
        <div className="h-6 w-6 rounded-full bg-blue-600 dark:bg-slate-900 flex items-center justify-center text-xs">
          🤖
        </div>
        <span className="tracking-tight">AI Campus Assistant</span>
      </div>

      {/* Floating AI Campus Assistant Chatbot Modal */}
      <AIChatbotModal
        currentUser={currentUser}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}
