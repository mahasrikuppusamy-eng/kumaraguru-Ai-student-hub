import { Student, EventItem, Hackathon, NotificationItem, Registration, UserSettings } from '../types';
import { parseInitialStudents, INITIAL_EVENTS, INITIAL_HACKATHONS, INITIAL_NOTIFICATIONS, INITIAL_REGISTRATIONS } from '../data/initialData';

const STORAGE_KEYS = {
  CURRENT_USER: 'kumaraguru_current_user',
  STUDENTS: 'kumaraguru_students',
  EVENTS: 'kumaraguru_events',
  HACKATHONS: 'kumaraguru_hackathons',
  REGISTRATIONS: 'kumaraguru_registrations',
  NOTIFICATIONS: 'kumaraguru_notifications',
  SETTINGS: 'kumaraguru_settings',
  DARK_MODE: 'kumaraguru_theme',
};

class StudentHubStore {
  private students: Student[] = [];
  private events: EventItem[] = [];
  private hackathons: Hackathon[] = [];
  private registrations: Registration[] = [];
  private notifications: NotificationItem[] = [];
  private currentRole: 'student' | 'admin' = 'student';
  private currentUser: Student | null = null;
  private settings: Record<string, UserSettings> = {};
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      this.students = storedStudents ? JSON.parse(storedStudents) : parseInitialStudents();
      if (!storedStudents) {
        this.saveStudents();
      }

      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      this.events = storedEvents ? JSON.parse(storedEvents) : INITIAL_EVENTS;
      if (!storedEvents) {
        this.saveEvents();
      }

      const storedHackathons = localStorage.getItem(STORAGE_KEYS.HACKATHONS);
      this.hackathons = storedHackathons ? JSON.parse(storedHackathons) : INITIAL_HACKATHONS;
      if (!storedHackathons) {
        this.saveHackathons();
      }

      const storedRegistrations = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      this.registrations = storedRegistrations ? JSON.parse(storedRegistrations) : INITIAL_REGISTRATIONS;
      if (!storedRegistrations) {
        this.saveRegistrations();
      }

      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifications ? JSON.parse(storedNotifications) : INITIAL_NOTIFICATIONS;
      if (!storedNotifications) {
        this.saveNotifications();
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      } else {
        // Default to student001 (Student A)
        this.currentUser = this.students.find(s => s.student_id === 'student001') || this.students[0];
        this.saveCurrentUser();
      }

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = storedSettings ? JSON.parse(storedSettings) : {};
    } catch (e) {
      console.error('Error initializing store from localStorage:', e);
      this.students = parseInitialStudents();
      this.events = INITIAL_EVENTS;
      this.hackathons = INITIAL_HACKATHONS;
      this.registrations = INITIAL_REGISTRATIONS;
      this.notifications = INITIAL_NOTIFICATIONS;
      this.currentUser = this.students[0];
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private saveStudents() {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
  }

  private saveEvents() {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
  }

  private saveHackathons() {
    localStorage.setItem(STORAGE_KEYS.HACKATHONS, JSON.stringify(this.hackathons));
  }

  private saveRegistrations() {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(this.registrations));
  }

  private saveNotifications() {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
  }

  private saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  private saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
  }

  // --- Auth & User ---
  public getCurrentUser(): Student | null {
    if (!this.currentUser) return null;
    // Always return freshest record from students list
    const fresh = this.students.find(s => s.student_id === this.currentUser?.student_id);
    return fresh || this.currentUser;
  }

  public getCurrentRole(): 'student' | 'admin' {
    return this.currentRole;
  }

  public setCurrentRole(role: 'student' | 'admin') {
    this.currentRole = role;
    this.notify();
  }

  public setCurrentUser(student: Student) {
    this.currentUser = student;
    this.currentRole = student.role;
    this.saveCurrentUser();
    this.notify();
  }

  public login(userId: string, password?: string): { success: boolean; message: string; user?: Student } {
    const cleanId = userId.trim();
    const user = this.students.find(
      s => s.student_id.toLowerCase() === cleanId.toLowerCase() || s.email.toLowerCase() === cleanId.toLowerCase()
    );

    if (!user) {
      return { success: false, message: 'Invalid Student / Staff ID. Please verify your credentials.' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, message: 'Incorrect password. Try "student123" for demo.' };
    }

    this.currentUser = user;
    this.saveCurrentUser();
    this.notify();
    return { success: true, message: `Welcome back, ${user.name}!`, user };
  }

  public logout() {
    this.currentUser = null;
    this.saveCurrentUser();
    this.notify();
  }

  public switchUser(studentId: string) {
    const target = this.students.find(s => s.student_id === studentId);
    if (target) {
      this.currentUser = target;
      this.saveCurrentUser();
      this.notify();
    }
  }

  // --- Data getters ---
  public getStudents(): Student[] {
    return [...this.students];
  }

  public getEvents(): EventItem[] {
    return [...this.events];
  }

  public getHackathons(): Hackathon[] {
    return [...this.hackathons];
  }

  public getStudentRegistrations(studentId?: string): Registration[] {
    const id = studentId || this.currentUser?.student_id;
    if (!id) return [];
    return this.registrations.filter(r => r.student_id === id);
  }

  public getAllRegistrations(): Registration[] {
    return [...this.registrations];
  }

  public getNotificationsForUser(studentId?: string): NotificationItem[] {
    const id = studentId || this.currentUser?.student_id;
    if (!id) return [];
    return this.notifications.filter(n => n.student_id === 'ALL' || n.student_id === id);
  }

  public getUnreadNotificationCount(studentId?: string): number {
    return this.getNotificationsForUser(studentId).filter(n => !n.is_read).length;
  }

  public markNotificationAsRead(notificationId: string) {
    this.notifications = this.notifications.map(n => 
      n.notification_id === notificationId ? { ...n, is_read: true } : n
    );
    this.saveNotifications();
    this.notify();
  }

  public markAllNotificationsAsRead(studentId?: string) {
    const id = studentId || this.currentUser?.student_id;
    if (!id) return;
    this.notifications = this.notifications.map(n => {
      if (n.student_id === 'ALL' || n.student_id === id) {
        return { ...n, is_read: true };
      }
      return n;
    });
    this.saveNotifications();
    this.notify();
  }

  // --- Mandatory Hackathon & Event Registration Logic with STRICT 60% RULE ---
  public registerForHackathon(hackathonId: string, studentId?: string): { success: boolean; message: string; registration?: Registration } {
    const id = studentId || this.currentUser?.student_id;
    if (!id) {
      return { success: false, message: 'Authentication required. Please login first.' };
    }

    const student = this.students.find(s => s.student_id === id);
    if (!student) {
      return { success: false, message: 'Student record not found.' };
    }

    const hackathon = this.hackathons.find(h => h.hackathon_id === hackathonId);
    if (!hackathon) {
      return { success: false, message: 'Hackathon not found.' };
    }

    const minAttendance = hackathon.minimum_attendance || 60;

    // MANDATORY BACKEND CHECK: Attendance must be >= 60%
    if (student.attendance_percentage < minAttendance) {
      // Record restriction in registration log for clear audit trail if desired
      const deniedRegistration: Registration = {
        registration_id: `REG_${Date.now()}`,
        student_id: student.student_id,
        item_id: hackathon.hackathon_id,
        item_type: 'hackathon',
        item_title: hackathon.name,
        date: hackathon.hackathon_date,
        registered_at: new Date().toISOString().split('T')[0],
        status: 'Restricted',
        eligibility: 'Not Eligible',
        rejection_reason: `Registration denied. Your current attendance is ${student.attendance_percentage}%. The minimum attendance requirement is ${minAttendance}%.`,
      };

      return {
        success: false,
        message: `Registration denied. Your current attendance is ${student.attendance_percentage}%, which is below the mandatory ${minAttendance}% requirement.`,
        registration: deniedRegistration,
      };
    }

    // Check duplicate
    const existing = this.registrations.find(r => r.student_id === student.student_id && r.item_id === hackathonId && r.status === 'Registered');
    if (existing) {
      return { success: false, message: 'You have already registered for this hackathon!' };
    }

    const newReg: Registration = {
      registration_id: `REG_${Date.now()}`,
      student_id: student.student_id,
      item_id: hackathon.hackathon_id,
      item_type: 'hackathon',
      item_title: hackathon.name,
      date: hackathon.hackathon_date,
      registered_at: new Date().toISOString().split('T')[0],
      status: 'Registered',
      eligibility: 'Eligible',
    };

    this.registrations.unshift(newReg);
    this.saveRegistrations();

    // Increment hackathon registered count
    this.hackathons = this.hackathons.map(h => 
      h.hackathon_id === hackathonId ? { ...h, registered_count: (h.registered_count || 0) + 1 } : h
    );
    this.saveHackathons();

    // Add confirmation notification
    const confirmationNotif: NotificationItem = {
      notification_id: `NOTIF_${Date.now()}`,
      student_id: student.student_id,
      title: `✓ Hackathon Registration Confirmed: ${hackathon.name}`,
      message: `Your registration for ${hackathon.name} is confirmed. Attendance verified at ${student.attendance_percentage}%. Team details will be emailed.`,
      notification_type: 'hackathon',
      is_read: false,
      created_at: new Date().toISOString(),
      badge_text: 'Confirmed',
    };
    this.notifications.unshift(confirmationNotif);
    this.saveNotifications();

    this.notify();
    return {
      success: true,
      message: `✓ Successfully registered! Your attendance is ${student.attendance_percentage}%, which meets the minimum ${minAttendance}% attendance requirement.`,
      registration: newReg,
    };
  }

  public registerForEvent(eventId: string, studentId?: string): { success: boolean; message: string; registration?: Registration } {
    const id = studentId || this.currentUser?.student_id;
    if (!id) {
      return { success: false, message: 'Authentication required. Please login first.' };
    }

    const student = this.students.find(s => s.student_id === id);
    if (!student) {
      return { success: false, message: 'Student record not found.' };
    }

    const event = this.events.find(e => e.event_id === eventId);
    if (!event) {
      return { success: false, message: 'Event not found.' };
    }

    const existing = this.registrations.find(r => r.student_id === student.student_id && r.item_id === eventId && r.status === 'Registered');
    if (existing) {
      return { success: false, message: 'You have already registered for this event!' };
    }

    const newReg: Registration = {
      registration_id: `REG_${Date.now()}`,
      student_id: student.student_id,
      item_id: event.event_id,
      item_type: 'event',
      item_title: event.event_name,
      date: event.event_date,
      registered_at: new Date().toISOString().split('T')[0],
      status: 'Registered',
      eligibility: 'Eligible',
    };

    this.registrations.unshift(newReg);
    this.saveRegistrations();

    // Increment event registered count
    this.events = this.events.map(e => 
      e.event_id === eventId ? { ...e, registered_count: (e.registered_count || 0) + 1 } : e
    );
    this.saveEvents();

    // Notification
    this.notifications.unshift({
      notification_id: `NOTIF_${Date.now()}`,
      student_id: student.student_id,
      title: `Event Registration Confirmed: ${event.event_name}`,
      message: `You are registered for ${event.event_name} on ${event.event_date} at ${event.venue}.`,
      notification_type: 'event',
      is_read: false,
      created_at: new Date().toISOString(),
      badge_text: 'Registered',
    });
    this.saveNotifications();

    this.notify();
    return {
      success: true,
      message: `Successfully registered for ${event.event_name}!`,
      registration: newReg,
    };
  }

  // --- Admin Operations ---
  public addEvent(event: Omit<EventItem, 'event_id' | 'registered_count'>): EventItem {
    const newEvent: EventItem = {
      ...event,
      event_id: `EVT${String(this.events.length + 1).padStart(3, '0')}`,
      registered_count: 0,
    };
    this.events.unshift(newEvent);
    this.saveEvents();

    // Dispatch global notification
    this.notifications.unshift({
      notification_id: `NOTIF_${Date.now()}`,
      student_id: 'ALL',
      title: `📅 New Event Added: ${newEvent.event_name}`,
      message: `${newEvent.description.substring(0, 100)}... Date: ${newEvent.event_date}`,
      notification_type: 'event',
      is_read: false,
      created_at: new Date().toISOString(),
      badge_text: 'New Event',
    });
    this.saveNotifications();

    this.notify();
    return newEvent;
  }

  public updateEvent(eventId: string, updates: Partial<EventItem>) {
    this.events = this.events.map(e => e.event_id === eventId ? { ...e, ...updates } : e);
    this.saveEvents();
    this.notify();
  }

  public deleteEvent(eventId: string) {
    this.events = this.events.filter(e => e.event_id !== eventId);
    this.saveEvents();
    this.notify();
  }

  public addHackathon(hackathon: Partial<Hackathon> & { name: string; minimum_attendance?: number }): Hackathon {
    const newHack: Hackathon = {
      hackathon_id: `HACK${String(this.hackathons.length + 1).padStart(3, '0')}`,
      name: hackathon.name,
      description: hackathon.description || 'Campus competitive hackathon.',
      hackathon_date: hackathon.hackathon_date || 'TBD',
      venue: hackathon.venue || 'KCT Campus',
      registration_deadline: hackathon.registration_deadline || 'Open',
      team_size: hackathon.team_size || '2-4 members',
      technology: hackathon.technology || 'General',
      eligibility: 'Min 60% Attendance',
      minimum_attendance: hackathon.minimum_attendance || 60,
      status: hackathon.status || 'Open',
      prize_pool: hackathon.prize_pool || '₹50,000',
      registered_count: 0,
    };
    this.hackathons.unshift(newHack);
    this.saveHackathons();

    // Send alert to all students
    this.notifications.unshift({
      notification_id: `NOTIF_${Date.now()}`,
      student_id: 'ALL',
      title: `⚡ NEW HACKATHON: ${newHack.name}`,
      message: `Registration is open! Eligibility: Minimum ${newHack.minimum_attendance}% attendance required. Date: ${newHack.hackathon_date}.`,
      notification_type: 'hackathon',
      is_read: false,
      created_at: new Date().toISOString(),
      badge_text: 'Hackathon Alert',
    });
    this.saveNotifications();

    this.notify();
    return newHack;
  }

  public updateHackathon(hackathonId: string, updates: Partial<Hackathon>) {
    this.hackathons = this.hackathons.map(h => h.hackathon_id === hackathonId ? { ...h, ...updates } : h);
    this.saveHackathons();
    this.notify();
  }

  public deleteHackathon(hackathonId: string) {
    this.hackathons = this.hackathons.filter(h => h.hackathon_id !== hackathonId);
    this.saveHackathons();
    this.notify();
  }

  public broadcastNotification(
    paramsOrTitle: string | { title: string; message: string; notification_type: NotificationItem['notification_type']; target_user_id?: string; badge_text?: string },
    message?: string,
    type?: NotificationItem['notification_type'],
    target?: 'ALL' | string
  ) {
    let finalTitle = '';
    let finalMsg = '';
    let finalType: NotificationItem['notification_type'] = 'general' as any;
    let finalTarget = 'ALL';
    let finalBadge = 'Announcement';

    if (typeof paramsOrTitle === 'object') {
      finalTitle = paramsOrTitle.title;
      finalMsg = paramsOrTitle.message;
      finalType = paramsOrTitle.notification_type;
      finalTarget = paramsOrTitle.target_user_id || 'ALL';
      finalBadge = paramsOrTitle.badge_text || 'Announcement';
    } else {
      finalTitle = paramsOrTitle;
      finalMsg = message || '';
      finalType = type || 'event';
      finalTarget = target || 'ALL';
      finalBadge = 'Announcement';
    }

    const newNotif: NotificationItem = {
      notification_id: `NOTIF_${Date.now()}`,
      student_id: finalTarget,
      title: finalTitle,
      message: finalMsg,
      notification_type: finalType,
      is_read: false,
      created_at: new Date().toISOString(),
      badge_text: finalBadge,
    };
    this.notifications.unshift(newNotif);
    this.saveNotifications();
    this.notify();
  }

  public getAnalytics() {
    const totalStudents = this.students.length;
    const totalAttendance = this.students.reduce((acc, s) => acc + s.attendance_percentage, 0);
    const averageAttendance = totalStudents > 0 ? Math.round((totalAttendance / totalStudents) * 10) / 10 : 0;
    const eligibleStudents = this.students.filter(s => s.attendance_percentage >= 60).length;
    const ineligibleStudents = totalStudents - eligibleStudents;

    const high = this.students.filter(s => s.attendance_percentage >= 75).length;
    const medium = this.students.filter(s => s.attendance_percentage >= 60 && s.attendance_percentage < 75).length;
    const low = this.students.filter(s => s.attendance_percentage < 60).length;

    return {
      totalStudents,
      averageAttendance,
      eligibleStudents,
      ineligibleStudents,
      attendanceDistribution: { high, medium, low },
      totalEvents: this.events.length,
      totalHackathons: this.hackathons.length,
      totalRegistrations: this.registrations.length,
    };
  }

  public getUserSettings(studentId?: string): UserSettings {
    const id = studentId || this.currentUser?.student_id || 'default';
    if (!this.settings[id]) {
      this.settings[id] = {
        student_id: id,
        theme: 'light',
        accent_color: 'blue',
        event_notifications: true,
        hackathon_notifications: true,
        recommendation_notifications: true,
        eligibility_notifications: true,
      };
      this.saveSettings();
    }
    return this.settings[id];
  }

  public updateUserSettings(settings: Partial<UserSettings>, studentId?: string) {
    const id = studentId || this.currentUser?.student_id || 'default';
    this.settings[id] = { ...this.getUserSettings(id), ...settings };
    this.saveSettings();
    this.notify();
  }

  public updateStudentAttendance(studentId: string, attendance: number) {
    this.students = this.students.map(s => 
      s.student_id === studentId ? { ...s, attendance_percentage: attendance } : s
    );
    this.saveStudents();
    if (this.currentUser?.student_id === studentId) {
      this.currentUser = { ...this.currentUser, attendance_percentage: attendance };
      this.saveCurrentUser();
    }
    this.notify();
  }

  public resetToDefaults() {
    this.resetAllData();
  }

  public resetAllData() {
    localStorage.clear();
    this.init();
    this.notify();
  }
}

export const store = new StudentHubStore();
