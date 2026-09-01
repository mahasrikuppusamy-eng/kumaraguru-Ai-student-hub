import { Student, Hackathon, EventItem, ChatMessage } from '../types';
import { store } from './store';

export class CampusChatbotEngine {
  public static get_hackathon_response(student: Student | null, query: string): string {
    const hackathons = store.getHackathons();
    const nextHack = hackathons.find(h => h.status === 'Open') || hackathons[0];

    if (query.includes('next') || query.includes('upcoming') || query.includes('when')) {
      if (nextHack) {
        return `The next hackathon is **${nextHack.name}** scheduled on **${nextHack.hackathon_date}** at **${nextHack.venue}**. Registration deadline is **${nextHack.registration_deadline}**. Team size is ${nextHack.team_size}.`;
      }
      return `We currently have ${hackathons.length} upcoming hackathons on campus. You can view them in the Hackathons tab!`;
    }

    if (query.includes('prize') || query.includes('cash')) {
      return nextHack?.prize_pool 
        ? `The prize pool for **${nextHack.name}** is **${nextHack.prize_pool}**!`
        : `Exciting cash prizes and incubation grants are available for all podium finishers!`;
    }

    return `Kumaraguru Hackathons are 24-hour innovation marathons! The active hackathon right now is **${nextHack?.name || 'Python Innovation Hackathon 2026'}**. Remember: Minimum 60% attendance is strictly enforced.`;
  }

  public static get_eligibility_response(student: Student | null, query: string): string {
    if (!student) {
      return `Please log in with your Student ID to check your personalized hackathon eligibility. The campus-wide minimum attendance requirement is **60%**.`;
    }

    const attendance = student.attendance_percentage;
    const isEligible = attendance >= 60;

    if (query.includes('why') && (query.includes('cant') || query.includes("can't") || query.includes('cannot') || query.includes('reject') || query.includes('disable'))) {
      if (!isEligible) {
        return `Your current attendance is **${attendance}%**, which is below the mandatory **60%** threshold. Kumaraguru policy requires at least 60% attendance to unlock hackathon registrations. Attending your regular classes will boost your percentage back above 60%!`;
      }
      return `Your attendance is **${attendance}%** (which is above 60%), so you are fully eligible! If you are facing any registration issues, make sure your team size meets requirements or check if you already registered.`;
    }

    if (query.includes('minimum') || query.includes('rule') || query.includes('policy')) {
      return `The minimum attendance requirement for hackathon participation at Kumaraguru is **60%**. Students below 60% cannot register.`;
    }

    if (isEligible) {
      return `Yes! Your current attendance is **${attendance}%**, which meets the minimum **60%** requirement. You are **✓ Eligible** to register for the hackathon.`;
    } else {
      return `Unfortunately, your current attendance is **${attendance}%**. The minimum attendance requirement is **60%**, so you are currently **✕ Not Eligible** to participate in the hackathon.`;
    }
  }

  public static get_attendance_response(student: Student | null): string {
    if (!student) {
      return `Please log in to view your attendance record.`;
    }

    const attendance = student.attendance_percentage;
    const isEligible = attendance >= 60;
    const statusText = isEligible ? '✓ Eligible for Hackathons' : '✕ Below Hackathon Requirement (Min 60%)';

    return `Your recorded attendance is **${attendance}%** (${statusText}). You have attended all major lab sessions this semester.`;
  }

  public static get_event_response(student: Student | null, query: string): string {
    const events = store.getEvents();
    if (query.includes('ai') || query.includes('workshop') || query.includes('machine learning')) {
      const aiEvent = events.find(e => e.category.toLowerCase().includes('intelligence') || e.category.toLowerCase().includes('machine'));
      if (aiEvent) {
        return `We have the **${aiEvent.event_name}** happening on **${aiEvent.event_date}** at ${aiEvent.venue}. ${aiEvent.description}`;
      }
    }

    return `Upcoming campus events include:\n- **AI & ML Workshop** (Sep 5)\n- **Full-Stack Web Bootcamp** (Sep 12)\n- **Cybersecurity Defense Seminar** (Sep 15)\n- **Cloud Native & DevOps Summit** (Sep 20)\n\nYou can register for any of these directly on the Events page!`;
  }

  public static get_registration_response(student: Student | null): string {
    if (!student) return `Please log in to view your registrations.`;
    const regs = store.getStudentRegistrations(student.student_id);

    if (regs.length === 0) {
      return `You currently haven't registered for any events yet. Explore the **Events** and **Hackathons** tabs to get started!`;
    }

    const titles = regs.map(r => `• **${r.item_title}** (${r.date}) - Status: *${r.status}*`).join('\n');
    return `You have **${regs.length} active registration(s)**:\n${titles}`;
  }

  public static get_engagement_response(student: Student | null): string {
    if (!student) return `Please log in to view your engagement score.`;
    return `Your overall Engagement Score is **${student.engagement_score}%** 🌟. This is calculated dynamically using your class attendance (${student.attendance_percentage}%), event registrations, workshop completions, and campus hackathon participation!`;
  }

  public static get_recommendation_response(student: Student | null): string {
    if (!student) return `Please log in to view AI recommendations personalized to your domain.`;
    const domain = student.interested_domain;
    const events = store.getEvents();
    const matched = events.filter(e => e.category.toLowerCase().includes(domain.toLowerCase()) || domain.toLowerCase().includes(e.category.toLowerCase()));

    if (matched.length > 0) {
      return `Based on your interest in **${domain}**, our AI engine strongly recommends:\n1. **${matched[0].event_name}** on ${matched[0].event_date}\n2. **Python Innovation Hackathon 2026**\n\nThese will boost your practical skills and team engagement!`;
    }

    return `Our AI recommends checking out the **AI & ML Workshop** and the **Python Innovation Hackathon 2026** to build real-world project experience.`;
  }

  public static generate_response(student: Student | null, message: string): string {
    const text = message.toLowerCase().trim();

    // 1. Eligibility and attendance rules (highest priority)
    if (
      text.includes('eligible') ||
      text.includes('eligibility') ||
      text.includes('can i participate') ||
      text.includes('can i register') ||
      text.includes('am i allowed') ||
      text.includes('minimum attendance') ||
      text.includes('attendance requirement') ||
      text.includes('why cant i') ||
      text.includes("why can't i") ||
      text.includes('why cannot i')
    ) {
      return this.get_eligibility_response(student, text);
    }

    // 2. Attendance queries
    if (text.includes('my attendance') || text.includes('attendance percentage') || text.includes('current attendance')) {
      return this.get_attendance_response(student);
    }

    // 3. Hackathons
    if (text.includes('hackathon') || text.includes('hack') || text.includes('coding contest') || text.includes('prize')) {
      return this.get_hackathon_response(student, text);
    }

    // 4. Registrations
    if (text.includes('my registration') || text.includes('registered events') || text.includes('my bookings')) {
      return this.get_registration_response(student);
    }

    // 5. Engagement score
    if (text.includes('engagement') || text.includes('score') || text.includes('points') || text.includes('rank')) {
      return this.get_engagement_response(student);
    }

    // 6. Recommendations
    if (text.includes('recommend') || text.includes('suggest') || text.includes('for me')) {
      return this.get_recommendation_response(student);
    }

    // 7. General events
    if (text.includes('event') || text.includes('workshop') || text.includes('seminar') || text.includes('bootcamp')) {
      return this.get_event_response(student, text);
    }

    // 8. Matchmaking / Teammates
    if (text.includes('team') || text.includes('teammate') || text.includes('partner') || text.includes('match')) {
      return `You can find compatible project and hackathon partners in the **Matches** tab! Our AI uses **Cosine Similarity** to match students with complementary skills in ${student?.interested_domain || 'AI & Development'}. It also filters for hackathon eligibility.`;
    }

    // 9. Greetings
    if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('help')) {
      return `Hello ${student?.name || 'there'} 👋! I'm your Kumaraguru AI Campus Assistant. How can I help you today? You can ask me about hackathon eligibility, your attendance, upcoming events, AI recommendations, or finding teammates.`;
    }

    // Fallback
    return `I can help you check your **Hackathon Eligibility**, view **Your Attendance**, discover **Recommended Events**, or find **Teammates**. What would you like to know?`;
  }
}
