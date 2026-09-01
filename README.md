# Kumaraguru AI Student Hub

> **AI-Powered Student Engagement, Events & Smart Campus Platform**  
> Complete Full-Stack Web Application Prototype for Hackathons, College Projects & Tech Demonstrations.

🌐 **Live Demo URL:** [https://mahasrikuppusamy-eng.github.io/kumaraguru-Ai-student-hub/](https://mahasrikuppusamy-eng.github.io/kumaraguru-Ai-student-hub/)

---

## 🌟 Executive Overview

**Kumaraguru AI Student Hub** is a campus engagement and smart event management portal engineered for modern universities. It features a complete student portal, administrative oversight, machine learning-driven attendance turnouts, vector-based teammate matchmaking, and an interactive AI Campus Assistant.

### 🛡️ Core Business Rule (Strictly Enforced in Logic)
> **Mandatory Rule:** *"A student must maintain at least **60% attendance** to register for or participate in any college hackathon."*

This rule is enforced directly within the central state layer (`src/services/store.ts`). Any attempt by a student with attendance `< 60%` to submit a hackathon registration is immediately rejected and recorded as restricted.

---

## 🚀 Key Functional Modules

### 1. Student Dashboard & Academic Records
- **Personalized Greeting**: Dynamic time-aware welcome for enrolled students.
- **Engagement Score**: Participation index computed from workshops, seminars, and attendance records.
- **Attendance & Eligibility Meter**:
  - `✓ ELIGIBLE FOR HACKATHON` (Green badge if attendance ≥ 60%)
  - `✕ NOT ELIGIBLE FOR HACKATHON` (Red badge if attendance < 60%)
- **AI Turnout Predictor**: Random Forest simulation estimating probability of attending upcoming technical events.
- **Personalized Feed**: Recommendations tailored to student's technical domain.

### 2. Hackathons Arena
- **Comprehensive Listings**: Active and upcoming hackathons (e.g. *Python Innovation Hackathon 2026*, *AI Agents 48h Sprint*).
- **Dynamic Registration Gate**:
  - Eligible students (≥ 60%) can register with one click, triggering confirmation alerts and confetti animations.
  - Ineligible students (< 60%) receive an explicit restriction notice with disabled registration controls.
- **Team Size, Venue, & Prize Pool**: Modals detailing technology stacks, deadlines, and prize structures.

### 3. Events & Workshops Calendar
- **Domain Categories**: Artificial Intelligence, Web Development, Cybersecurity, Cloud Computing, and Data Science.
- **Real-Time Capacity**: Live counter tracking registered seats against venue caps.
- **ML Probability Breakdown**: Shows factors influencing expected student turnout.

### 4. AI Student Matchmaker (Cosine Similarity)
- **Vector-Based Match Score**: Compares student domain interests, technical skills, and department profiles.
- **Hackathon-Ready Filter**: Toggle to show only peers meeting the mandatory 60% attendance requirement.
- **Team Invitations**: Send team invites with instant notification dispatch.

### 5. AI Campus Assistant (Chatbot Engine)
- **Context-Aware Knowledge**: Accesses the active student's verified attendance and registration records.
- **Quick-Action Chips**:
  - `Am I eligible for hackathon?`
  - `What is the next hackathon?`
  - `My attendance`
  - `What is the minimum attendance?`
  - `Why can't I register?`
- **Dynamic Responses**: Tailored answers explaining whether the student meets the 60% requirement based on live data.

### 6. Admin Control Center
- **Cohort Analytics**: Average attendance, eligible vs. ineligible student distribution, and event counts across 100 students.
- **Inline Record Editor**: Change any student's attendance percentage to immediately observe recalculated hackathon eligibility.
- **Event & Hackathon Creator**: Publish workshops and configure custom attendance thresholds.
- **Broadcast Dispatch**: Send announcements to all students or specific departments.

### 7. Interactive Demo Banner & Settings
- **Role & Persona Switcher**:
  - **Student A** (92% Attendance — Hackathon Eligible)
  - **Student B** (54% Attendance — Hackathon Ineligible)
  - **Admin** (Administrator with full analytical control)
- **Live Attendance Slider**: Dynamically simulate attendance changes between 30% and 100% to test real-time gatekeeper behavior.
- **Theme Mode**: Full support for Light and Dark modes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18 (TypeScript) + Vite |
| **Styling & UI** | Tailwind CSS + Lucide Icons + Canvas Confetti |
| **State Management** | Centralized Store with localStorage persistence |
| **Machine Learning** | Random Forest Ensemble Turnout Simulation + Vector Cosine Similarity |
| **Natural Language** | Contextual rule-based AI Campus Assistant |
| **Synthetic Dataset** | 100 structured student records across CSE, AI & DS, IT, and ECE |

---

## 📂 Project Structure

```
├── index.html                     # Main HTML entry point
├── metadata.json                  # Application metadata & configuration
├── src/
│   ├── main.tsx                   # React root mount
│   ├── App.tsx                    # Master layout & dynamic routing
│   ├── types.ts                   # TypeScript interfaces & enums
│   ├── data/
│   │   └── initialData.ts         # 100-student dataset, events & hackathons
│   ├── services/
│   │   ├── store.ts               # Central state manager & 60% rule gatekeeper
│   │   ├── mlService.ts           # Random Forest & Cosine Matchmaker
│   │   └── chatbotService.ts      # AI Campus Assistant chatbot engine
│   └── components/
│       ├── DemoBanner.tsx         # Quick role/student switcher for presentations
│       ├── Navbar.tsx             # Responsive header with notification badge
│       ├── StudentDashboard.tsx   # Dashboard with attendance & ML cards
│       ├── HackathonsView.tsx     # Hackathons page with eligibility gate
│       ├── EventsView.tsx         # Events catalog & search
│       ├── RegistrationsView.tsx  # Confirmed & restricted registration records
│       ├── MatchesView.tsx        # AI Student Matchmaker
│       ├── NotificationsView.tsx  # Smart campus announcements & alerts
│       ├── ProfileView.tsx        # Student academic profile & standings
│       ├── SettingsView.tsx       # Theme, preferences, & attendance simulator
│       ├── AdminDashboard.tsx     # Admin analytics & student management
│       └── AIChatbotModal.tsx     # Floating AI Assistant chatbot
```

---

## 🎯 Verification & Testing Flow

1. **Verify Eligible Student**:
   - In the top demo banner, click **Student A (92%)**.
   - Navigate to **Hackathons** or **Dashboard** — note the green **`✓ ELIGIBLE FOR HACKATHON`** badge.
   - Click **Register Now** on *Python Innovation Hackathon 2026* — registration succeeds with confetti!
   - Open the **AI Assistant** and ask *"Am I eligible for hackathon?"* — it answers that your 92% attendance clears the 60% requirement.

2. **Verify Ineligible Student**:
   - In the top demo banner, switch to **Student B (54%)**.
   - Navigate to **Hackathons** — note the red **`✕ NOT ELIGIBLE FOR HACKATHON`** badge.
   - Note that registration is strictly disabled.
   - Open the **AI Assistant** and ask *"Why can't I register?"* — it specifically explains that your attendance (54%) is below 60%.

3. **Verify Admin Role**:
   - In the top demo banner, switch to **Admin**.
   - View attendance distribution analytics for the 100-student cohort.
   - Navigate to the **Students Cohort** tab and modify any student's attendance to see instant real-time recalculation of their eligibility.
