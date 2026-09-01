import { Student, EventItem, Hackathon, NotificationItem, Registration, UserSettings } from '../types';

export const RAW_100_STUDENTS_CSV = `student_id,student_name,attendance_percentage,interested_domain
STU001,Aarav Kumar,92,Artificial Intelligence
STU002,Aditya Raj,86,Machine Learning
STU003,Akash Menon,78,Web Development
STU004,Arjun Prakash,95,Data Science
STU005,Arun Kumar,88,Cybersecurity
STU006,Ashwin Raj,51,Python Programming
STU007,Bala Murugan,73,Cloud Computing
STU008,Bharath Kumar,90,Artificial Intelligence
STU009,Dinesh Kumar,84,Machine Learning
STU010,Gokul Raj,76,Web Development
STU011,Hari Prasad,93,Data Science
STU012,Harish Kumar,87,Cybersecurity
STU013,Karthik S,82,Python Programming
STU014,Kishore Kumar,69,Cloud Computing
STU015,Lokesh Raj,31,Artificial Intelligence
STU016,Madhan Kumar,85,Machine Learning
STU017,Manoj Kumar,79,Web Development
STU018,Nikhil Raj,96,Data Science
STU019,Naveen Kumar,89,Cybersecurity
STU020,Pranav S,77,Python Programming
STU021,Rahul Kumar,83,Cloud Computing
STU022,Rakesh Raj,54,Artificial Intelligence
STU023,Rohit Kumar,88,Machine Learning
STU024,Saran Kumar,72,Web Development
STU025,Sanjay Raj,91,Data Science
STU026,Saravanan M,86,Cybersecurity
STU027,Siddharth Kumar,80,Python Programming
STU028,Surya Prakash,74,Cloud Computing
STU029,Tarun Raj,97,Artificial Intelligence
STU030,Vignesh Kumar,89,Machine Learning
STU031,Vijay Kumar,83,Web Development
STU032,Vishal Raj,92,Data Science
STU033,Yashwanth S,78,Cybersecurity
STU034,Abhinav Kumar,35,Python Programming
STU035,Ajay Raj,71,Cloud Computing
STU036,Anand Kumar,93,Artificial Intelligence
STU037,Anirudh S,87,Machine Learning
STU038,Ashok Kumar,80,Web Development
STU039,Deepak Raj,50,Data Science
STU040,Dev Kumar,84,Cybersecurity
STU041,Dhanush S,76,Python Programming
STU042,Ganesh Kumar,88,Cloud Computing
STU043,Gowtham Raj,95,Artificial Intelligence
STU044,Jeevan Kumar,82,Machine Learning
STU045,Kavin S,79,Web Development
STU046,Kishan Raj,91,Data Science
STU047,Krishna Kumar,46,Cybersecurity
STU048,Mohan Raj,73,Python Programming
STU049,Naveen S,94,Cloud Computing
STU050,Pradeep Kumar,89,Artificial Intelligence
STU051,Priyanka S,96,Machine Learning
STU052,Divya Kumar,90,Web Development
STU053,Ananya Raj,87,Data Science
STU054,Aishwarya S,93,Cybersecurity
STU055,Harini Kumar,85,Python Programming
STU056,Keerthana Raj,79,Cloud Computing
STU057,Kavya S,22,Artificial Intelligence
STU058,Nandhini Kumar,88,Machine Learning
STU059,Pavithra Raj,81,Web Development
STU060,Priya Kumar,95,Data Science
STU061,Riya S,89,Cybersecurity
STU062,Sneha Raj,84,Python Programming
STU063,Swetha Kumar,47,Cloud Computing
STU064,Vaishnavi S,91,Artificial Intelligence
STU065,Varshini Raj,56,Machine Learning
STU066,Abinaya Kumar,80,Web Development
STU067,Akshaya S,94,Data Science
STU068,Amritha Raj,88,Cybersecurity
STU069,Bhavya Kumar,83,Python Programming
STU070,Dharani S,52,Cloud Computing
STU071,Gayathri Raj,97,Artificial Intelligence
STU072,Janani Kumar,90,Machine Learning
STU073,Keerthi S,78,Web Development
STU074,Lavanya Raj,93,Data Science
STU075,Monisha Kumar,85,Cybersecurity
STU076,Nithya S,81,Python Programming
STU077,Pavithra Kumar,89,Cloud Computing
STU078,Ramya Raj,96,Artificial Intelligence
STU079,Reshma S,87,Machine Learning
STU080,Shalini Kumar,79,Web Development
STU081,Sowmya Raj,92,Data Science
STU082,Swetha S,84,Cybersecurity
STU083,Tharani Kumar,90,Python Programming
STU084,Vaishali Raj,76,Cloud Computing
STU085,Yamini S,45,Artificial Intelligence
STU086,Aarthi Kumar,88,Machine Learning
STU087,Anusha Raj,82,Web Development
STU088,Bhavana S,91,Data Science
STU089,Chandrika Kumar,86,Cybersecurity
STU090,Deepika Raj,74,Python Programming
STU091,Ishwarya S,93,Cloud Computing
STU092,Meena Kumar,59,Artificial Intelligence
STU093,Nivetha Raj,80,Machine Learning
STU094,Pooja S,96,Web Development
STU095,Roshini Kumar,87,Data Science
STU096,Shreya Raj,83,Cybersecurity
STU097,Sowmiya S,78,Python Programming
STU098,Tamilselvi Kumar,90,Cloud Computing
STU099,Usha Raj,94,Artificial Intelligence
STU100,Zoya S,85,Machine Learning`;

export const DOMAIN_SKILLS_MAP: Record<string, string[]> = {
  'Artificial Intelligence': ['Python', 'PyTorch', 'TensorFlow', 'Deep Learning', 'Computer Vision', 'NLP'],
  'Machine Learning': ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis', 'Random Forest'],
  'Web Development': ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS', 'Next.js'],
  'Data Science': ['Python', 'SQL', 'Tableau', 'Big Data', 'Statistics', 'PowerBI'],
  'Cybersecurity': ['Ethical Hacking', 'Network Security', 'Linux', 'Cryptography', 'SIEM', 'Penetration Testing'],
  'Python Programming': ['Python', 'Django', 'Flask', 'Data Structures', 'OOP', 'FastAPI'],
  'Cloud Computing': ['AWS', 'Docker', 'Kubernetes', 'GCP', 'DevOps', 'Microservices'],
};

// Generate list of 100 students from CSV plus demo accounts
export function parseInitialStudents(): Student[] {
  const lines = RAW_100_STUDENTS_CSV.trim().split('\n').slice(1);
  const students: Student[] = [];

  // 1. Primary Demo Eligible Student (Student A)
  students.push({
    student_id: 'student001',
    name: 'Student A',
    email: 'student.a@kct.ac.in',
    department: 'Computer Science & Engineering',
    year: 3,
    password: 'student123',
    role: 'student',
    attendance_percentage: 92,
    engagement_score: 87,
    interested_domain: 'Artificial Intelligence',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  // 2. Primary Demo Low-Attendance Student
  students.push({
    student_id: 'student_low',
    name: 'Low Attendance Student',
    email: 'student.low@kct.ac.in',
    department: 'Information Technology',
    year: 2,
    password: 'student123',
    role: 'student',
    attendance_percentage: 54,
    engagement_score: 48,
    interested_domain: 'Python Programming',
    skills: ['Python', 'HTML/CSS', 'Basic Flask'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  });

  // 3. Admin user
  students.push({
    student_id: 'admin001',
    name: 'Staff Admin',
    email: 'admin@kct.ac.in',
    department: 'Dean Office - Student Affairs',
    year: 0,
    password: 'admin123',
    role: 'admin',
    attendance_percentage: 100,
    engagement_score: 99,
    interested_domain: 'Administration & AI Analytics',
    skills: ['Campus Management', 'Event Planning', 'AI Insights'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  });

  // 4. Parse the 100 synthetic students
  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Electrical & Electronics',
  ];

  lines.forEach((line, index) => {
    const parts = line.split(',');
    if (parts.length >= 4) {
      const id = parts[0].trim();
      const name = parts[1].trim();
      const attendance = parseInt(parts[2].trim(), 10);
      const domain = parts[3].trim();
      const dept = departments[index % departments.length];
      const year = (index % 4) + 1;
      const skills = DOMAIN_SKILLS_MAP[domain] || ['Python', 'Problem Solving'];
      // Engagement roughly proportional to attendance with realistic variance
      const engagement = Math.min(99, Math.max(25, Math.round(attendance * 0.9 + (index % 15))));

      students.push({
        student_id: id,
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@kct.ac.in`,
        department: dept,
        year: year,
        password: 'student123',
        role: 'student',
        attendance_percentage: attendance,
        engagement_score: engagement,
        interested_domain: domain,
        skills: skills,
      });
    }
  });

  // 5. Additional synthetic low-attendance students for boundary condition testing
  students.push({
    student_id: 'STU101',
    name: 'Kavitha Ramesh',
    email: 'kavitha.ramesh@kct.ac.in',
    department: 'Information Technology',
    year: 3,
    password: 'student123',
    role: 'student',
    attendance_percentage: 45,
    engagement_score: 41,
    interested_domain: 'Artificial Intelligence',
    skills: ['Python', 'Data Science'],
  });

  students.push({
    student_id: 'STU102',
    name: 'Suresh Babu',
    email: 'suresh.babu@kct.ac.in',
    department: 'Mechanical Engineering',
    year: 2,
    password: 'student123',
    role: 'student',
    attendance_percentage: 30,
    engagement_score: 28,
    interested_domain: 'Web Development',
    skills: ['HTML', 'CSS', 'JavaScript'],
  });

  students.push({
    student_id: 'STU103',
    name: 'Pooja Sundaram',
    email: 'pooja.sundaram@kct.ac.in',
    department: 'Computer Science & Engineering',
    year: 4,
    password: 'student123',
    role: 'student',
    attendance_percentage: 59,
    engagement_score: 55,
    interested_domain: 'Machine Learning',
    skills: ['Python', 'Scikit-learn'],
  });

  return students;
}

export const INITIAL_EVENTS: EventItem[] = [
  {
    event_id: 'EVT001',
    event_name: 'AI & ML Workshop',
    category: 'Artificial Intelligence',
    event_date: 'September 5, 2026',
    description: 'Learn the fundamentals of Artificial Intelligence and Machine Learning through practical, hands-on examples with neural networks and scikit-learn.',
    venue: 'Ramanujan Computing Centre, Lab 3',
    registration_deadline: 'September 4, 2026',
    capacity: 120,
    registered_count: 86,
  },
  {
    event_id: 'EVT002',
    event_name: 'Full-Stack Web Bootcamp',
    category: 'Web Development',
    event_date: 'September 12, 2026',
    description: 'Deep dive into modern web development using React, TypeScript, Node.js, and Tailwind CSS. Build a full-stack web project in a single intensive weekend.',
    venue: 'KCT Innovation Lab',
    registration_deadline: 'September 10, 2026',
    capacity: 90,
    registered_count: 74,
  },
  {
    event_id: 'EVT003',
    event_name: 'Cybersecurity Defense Seminar',
    category: 'Cybersecurity',
    event_date: 'September 15, 2026',
    description: 'Understand vulnerability assessments, ethical hacking methodologies, and modern SIEM threat response protocols from industry leaders.',
    venue: 'Swami Vivekananda Auditorium',
    registration_deadline: 'September 14, 2026',
    capacity: 250,
    registered_count: 180,
  },
  {
    event_id: 'EVT004',
    event_name: 'Cloud Native & DevOps Summit',
    category: 'Cloud Computing',
    event_date: 'September 20, 2026',
    description: 'Architecting scalable microservices on AWS and Google Cloud Platform with Docker and Kubernetes cluster management.',
    venue: 'Seminar Hall 2, Admin Block',
    registration_deadline: 'September 18, 2026',
    capacity: 100,
    registered_count: 65,
  },
  {
    event_id: 'EVT005',
    event_name: 'Data Science & Predictive Analytics Summit',
    category: 'Data Science',
    event_date: 'September 25, 2026',
    description: 'Explore big data pipelines, exploratory data analysis, and advanced predictive analytics algorithms for real-world enterprise applications.',
    venue: 'Convention Hall A',
    registration_deadline: 'September 23, 2026',
    capacity: 150,
    registered_count: 112,
  },
];

export const INITIAL_HACKATHONS: Hackathon[] = [
  {
    hackathon_id: 'HACK001',
    name: 'Python Innovation Hackathon 2026',
    description: 'Build innovative software, AI assistants, and web automation tools using Python and modern cloud tech stack. 24-hour non-stop coding showdown.',
    hackathon_date: 'September 8, 2026',
    venue: 'Kumaraguru Campus, C-Block Hall',
    registration_deadline: 'September 6, 2026',
    team_size: '2–4 Members',
    technology: 'Python / AI / Web / Cloud',
    eligibility: 'Minimum 60% Attendance Required',
    minimum_attendance: 60,
    status: 'Open',
    prize_pool: '₹50,000 Cash Prize + Incubation Grant',
    registered_count: 42,
  },
  {
    hackathon_id: 'HACK002',
    name: 'Smart Campus AI Grand Challenge',
    description: 'Design next-generation smart campus solutions addressing sustainable energy, intelligent student safety, AI tutoring, and campus logistics.',
    hackathon_date: 'September 22, 2026',
    venue: 'KCT Tech Park Ground Floor',
    registration_deadline: 'September 19, 2026',
    team_size: '3–5 Members',
    technology: 'AI / IoT / Mobile / Computer Vision',
    eligibility: 'Minimum 60% Attendance Required',
    minimum_attendance: 60,
    status: 'Open',
    prize_pool: '₹75,000 + Venture Seed Funding',
    registered_count: 28,
  },
  {
    hackathon_id: 'HACK003',
    name: 'Kumaraguru Web3 & FinTech Hackathon',
    description: 'Decentralized applications, automated compliance systems, and algorithmic trading tools using smart contracts and secure architectures.',
    hackathon_date: 'October 10, 2026',
    venue: 'Dr. Mahalingam Vigyan Bhavan',
    registration_deadline: 'October 5, 2026',
    team_size: '2–4 Members',
    technology: 'Solidity / TypeScript / Web3 / Python',
    eligibility: 'Minimum 60% Attendance Required',
    minimum_attendance: 60,
    status: 'Upcoming',
    prize_pool: '₹1,00,000 + Internship Opportunities',
    registered_count: 14,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    notification_id: 'NOTIF001',
    student_id: 'ALL',
    title: '🔔 NEW HACKATHON ALERT: Python Innovation Hackathon 2026',
    message: 'Registration is now open! Please verify your attendance meets the minimum 60% threshold before submitting your team application.',
    notification_type: 'hackathon',
    is_read: false,
    created_at: '2026-09-01T08:30:00Z',
    badge_text: 'Hackathon Alert',
  },
  {
    notification_id: 'NOTIF002',
    student_id: 'ALL',
    title: 'Upcoming AI & ML Workshop',
    message: 'Hands-on practical session starts September 5 at Ramanujan Computing Centre. Limited seats available.',
    notification_type: 'event',
    is_read: false,
    created_at: '2026-08-30T10:15:00Z',
    badge_text: 'Event Reminder',
  },
  {
    notification_id: 'NOTIF003',
    student_id: 'student001',
    title: 'AI Recommendation: Data Science Summit',
    message: 'Based on your interest in Artificial Intelligence, our AI engine suggests checking out the upcoming Data Science & Predictive Analytics Summit.',
    notification_type: 'recommendation',
    is_read: false,
    created_at: '2026-08-29T14:20:00Z',
    badge_text: 'AI Recommendation',
  },
  {
    notification_id: 'NOTIF004',
    student_id: 'student_low',
    title: '⚠️ Attendance Warning & Hackathon Restriction',
    message: 'Your current attendance is 54%. The minimum attendance requirement for hackathon participation is 60%. Please attend regular classes to regain eligibility.',
    notification_type: 'eligibility',
    is_read: false,
    created_at: '2026-08-28T09:00:00Z',
    badge_text: 'Attendance Alert',
  },
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    registration_id: 'REG001',
    student_id: 'student001',
    item_id: 'EVT001',
    item_type: 'event',
    item_title: 'AI & ML Workshop',
    date: 'Sep 5, 2026',
    registered_at: '2026-08-28',
    status: 'Registered',
    eligibility: 'Eligible',
  },
  {
    registration_id: 'REG002',
    student_id: 'student001',
    item_id: 'EVT003',
    item_type: 'event',
    item_title: 'Cybersecurity Defense Seminar',
    date: 'Sep 15, 2026',
    registered_at: '2026-08-25',
    status: 'Registered',
    eligibility: 'Eligible',
  },
];
