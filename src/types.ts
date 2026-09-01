export type Role = 'student' | 'admin';

export interface Student {
  student_id: string;
  name: string;
  email: string;
  department: string;
  year: number;
  password?: string;
  role: Role;
  attendance_percentage: number;
  engagement_score: number;
  interested_domain: string;
  skills?: string[];
  avatar?: string;
}

export interface EventItem {
  event_id: string;
  event_name: string;
  category: string;
  event_date: string;
  description: string;
  venue: string;
  registration_deadline: string;
  capacity: number;
  registered_count?: number;
  status?: string;
  speaker?: string;
  image?: string;
}

export interface Hackathon {
  hackathon_id: string;
  name: string;
  description: string;
  hackathon_date: string;
  venue: string;
  registration_deadline: string;
  team_size: string;
  technology: string;
  eligibility: string;
  minimum_attendance: number; // default 60
  status: 'Open' | 'Closed' | 'Upcoming';
  prize_pool?: string;
  registered_count?: number;
}

export interface Registration {
  registration_id: string;
  student_id: string;
  item_id: string; // event_id or hackathon_id
  item_type: 'event' | 'hackathon';
  item_title: string;
  date: string;
  registered_at: string;
  status: 'Registered' | 'Restricted' | 'Attended';
  eligibility: 'Eligible' | 'Not Eligible';
  rejection_reason?: string;
}

export interface NotificationItem {
  notification_id: string;
  student_id: string; // 'ALL' or specific student_id
  title: string;
  message: string;
  notification_type: 'event' | 'hackathon' | 'reminder' | 'attendance' | 'recommendation' | 'eligibility' | 'update';
  is_read: boolean;
  created_at: string;
  action_url?: string;
  badge_text?: string;
}

export interface UserSettings {
  student_id: string;
  theme: 'light' | 'dark' | 'system';
  accent_color: 'blue' | 'purple' | 'green';
  event_notifications: boolean;
  hackathon_notifications: boolean;
  recommendation_notifications: boolean;
  eligibility_notifications: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionLink?: string;
  actionText?: string;
}

export interface MatchScore {
  student: Student;
  matchPercentage: number;
  sharedInterests: string[];
  isHackathonEligible: boolean;
}

export interface MLPrediction {
  eventId: string;
  eventName: string;
  probability: number; // 0 - 100
  classification: 'Likely to Attend' | 'Maybe Attend' | 'Unlikely to Attend';
  featureBreakdown: {
    previousAttendanceScore: number;
    registrationHistoryScore: number;
    domainRelevanceScore: number;
    engagementScore: number;
    daysPenalty: number;
  };
}
