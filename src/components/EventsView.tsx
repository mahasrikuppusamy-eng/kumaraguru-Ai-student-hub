import React, { useState } from 'react';
import { Student, EventItem } from '../types';
import { store } from '../services/store';
import { predictEventAttendance } from '../services/mlService';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  Check, 
  Sparkles, 
  BrainCircuit, 
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EventsViewProps {
  currentUser: Student;
}

export const EventsView: React.FC<EventsViewProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const events = store.getEvents();
  const registrations = store.getStudentRegistrations(currentUser.student_id);

  const categories = ['ALL', 'Artificial Intelligence', 'Web Development', 'Cybersecurity', 'Cloud Computing', 'Data Science'];

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const isRegistered = (eventId: string) => {
    return registrations.some(r => r.item_id === eventId && r.status === 'Registered');
  };

  const handleRegister = (event: EventItem) => {
    setRegisteringId(event.event_id);
    setFeedback(null);

    const result = store.registerForEvent(event.event_id, currentUser.student_id);
    
    setTimeout(() => {
      setRegisteringId(null);
      if (result.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
        setFeedback({ message: result.message, type: 'success' });
      } else {
        setFeedback({ message: result.message, type: 'error' });
      }
    }, 350);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Kumaraguru Campus Calendar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upcoming Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Workshops, technical summits, and masterclasses across engineering domains.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, topics, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between gap-3 shadow-sm ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold px-2">✕</button>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const registered = isRegistered(event.event_id);
          const ml = predictEventAttendance(currentUser, event);

          return (
            <div
              key={event.event_id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                    {event.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Cap: {event.registered_count || 0}/{event.capacity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {event.event_name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{event.event_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Deadline: {event.registration_deadline}</span>
                  </div>
                </div>

                {/* AI Attendance Prediction Badge */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>AI Predicted Turnout:</span>
                  </div>
                  <span className="font-extrabold text-indigo-700 dark:text-indigo-300">
                    {ml.probability}% ({ml.classification.split(' ')[0]})
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  View Event
                </button>

                {registered ? (
                  <button
                    disabled
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-default"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Registered</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(event)}
                    disabled={registeringId === event.event_id}
                    className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
                  >
                    <span>{registeringId === event.event_id ? 'Saving...' : 'Register'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {selectedEvent.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedEvent.event_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedEvent.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Date</span>
                <span className="font-semibold">{selectedEvent.event_date}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Venue</span>
                <span className="font-semibold">{selectedEvent.venue}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Deadline</span>
                <span className="font-semibold">{selectedEvent.registration_deadline}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Capacity</span>
                <span className="font-semibold">{selectedEvent.capacity} seats</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>

              <button
                onClick={() => {
                  handleRegister(selectedEvent);
                  setSelectedEvent(null);
                }}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
