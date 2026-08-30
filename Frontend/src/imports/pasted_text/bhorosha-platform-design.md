
**A Privacy-Preserving Professor & Course Review Platform (3 Dynamic Roles: Student / Teacher / Admin)**

Design a complete, production-ready web app UI for **"Bhorosha"** — a privacy-preserving professor and course review platform used by a university community. The app must be **fully dynamic and role-aware**: the exact same navigation shell adapts its content, permissions, and navbar links based on which of the **3 roles** is logged in — **Student, Teacher, Admin**. Do not design three separate apps; design ONE system with conditional states per role. **Do not fill screens with demo/sample content** — design every list, card grid, and table using realistic empty states and structural placeholders (e.g. "Course Name", "0 reviews") rather than invented sample data, since the platform launches with no seeded content.

### 1. Brand & Design System (Light + Dark)
- Style: clean, modern, trustworthy "campus SaaS" feel — approachable but credible, since it deals with sensitive feedback data.
- Design **both a Light theme and a Dark theme**, using the same token names so components can swap via a theme variant. Include a theme toggle (sun/moon switch) in the navbar for all roles.

**Light theme tokens:**
- Primary (brand/blue): `#4F7EF7`, hover/dark `#3B6EE8`, light tint `#EEF3FF`
- Accent (success/positive, green): `#10B981`, light tint `#ECFDF5`
- Anonymous indicator (purple): `#7C3AED`, light tint `#F5F3FF`
- Danger (red): `#EF4444` | Warning (amber): `#F59E0B`
- Background: `#F8FAFC` | Card/surface: `#FFFFFF` | Border: `#E2E8F0`
- Text: primary `#1E293B`, muted `#64748B`

**Dark theme tokens (same semantic roles, adjusted for contrast/comfort):**
- Primary (brand/blue): `#6C93FF`, hover/light `#8FA9FF`, tint surface `#1B2440`
- Accent (green): `#34D399`, tint surface `#0F2A22`
- Anonymous indicator (purple): `#A78BFA`, tint surface `#241A3D`
- Danger (red): `#F87171` | Warning (amber): `#FBBF24`
- Background: `#0F172A` | Card/surface: `#1E293B` | Border: `#334155`
- Text: primary `#F1F5F9`, muted `#94A3B8`

- Typography: **Poppins** (semibold/bold) for headings, **Inter** for body/UI text — same in both themes.
- Corner radius: soft, consistent rounding (cards ~12–16px, buttons/inputs ~8–10px).
- Build a **Design System / Style Guide frame first**, each component shown in BOTH light and dark: color swatches, type scale (H1–H6, body, caption), buttons (primary, secondary, ghost, danger — default/hover/disabled), input fields (default/focus/error/disabled), badges/tags, star-rating component, avatar (with image + fallback initials), anonymous-post badge, status chips (pending/approved/rejected, answered/unanswered), toast/notification, modal, empty states, loading skeleton set, and theme toggle switch.

### 2. Global Navigation Shell (role-conditional)
Design ONE responsive navbar/sidebar component, in light and dark, with visible states for each role. **Admin can only ever see the Admin interface; Student and Teacher can only ever see their own interface** — no shared views across roles.
- **Logged out**: Logo, Browse (public), Login, Sign Up, theme toggle.
- **Student**: Logo, Search bar (courses/professors), Dashboard, Q&A, My Reviews, Notifications bell, theme toggle, Profile avatar dropdown (Profile, Settings, Change Password, Anonymity preferences, Logout).
- **Teacher**: Logo, My Courses, Feedback Dashboard, Q&A (courses they teach), Notifications, theme toggle, Profile avatar dropdown (Profile, Settings, Change Password, Logout).
- **Admin**: Logo, Admin badge/label, Users, Courses, Content Moderation, Reports, Analytics, theme toggle, Profile avatar dropdown (Settings, Change Password, Logout).
- Show the same navbar frame twice per role (light + dark) so theming is visually explicit.

### 3. Authentication Flow & Rules
1. **Landing / Public Browse page** — hero section explaining Bhorosha, search bar for courses/professors, top-rated courses, top-rated professors, CTA to sign up. Design in light and dark.
2. **Role Selection (first step)** — Student or Teacher choose their role before creating an account (2 large selectable cards). Admin does **not** appear here — Admin has no signup flow and logs in directly with pre-provisioned credentials.
3. **Sign Up screen**:
   - **Student**: full name, university email restricted to the format `u{studentID}@student.cuet.ac.bd` (e.g. `u2204061@student.cuet.ac.bd`), password (min. 8 characters, must include upper/lowercase, number, symbol) + confirm password. Show inline validation for both the email pattern and password strength.
   - **Teacher**: full name, university email restricted to the format `u{teacherID}@teacher.cuet.ac.bd`, password (same strength rule) + confirm password.
   - Show an error state for an email that doesn't match the required domain pattern.
4. **Login screen** — single shared layout, works for all 3 roles (email/password + "Forgot password" link). No signup link shown for Admin context — Admin uses this same screen with pre-provisioned credentials.
5. **OTP / Email Verification screen** — for Student/Teacher signup only.
6. **Forgot Password flow** — request (enter university email) → OTP/reset link → set new password. Available to Student and Teacher only.
Design each state: default, filled, error/validation, loading (button spinner), success toast — in both light and dark.

### 4. STUDENT Role Screens
- **Student Dashboard / Home**: search + filters (department, semester, rating, tags like "Heavy Workload", "Well-structured"), grid/list of course cards and professor cards (avatar/initials, name, department, avg star rating, review count, top tags), quick links to "My Reviews" and "My Questions".
- **Course Detail Page**: header (course code, name, department, teacher, semester, avg rating with star breakdown 5→1 star bar chart), tag cloud, review list (each review: rating, tags, text, "Posted anonymously" purple badge OR named author, timestamp, helpful upvote/downvote count), "Write a Review" button, Q&A tab with question threads (ask a question box, list of Q&A with answered/unanswered chip).
- **Professor Detail Page**: same layout pattern as course detail but professor-centric (courses they teach listed as chips, aggregated rating, profile photo).
- **Write Review Modal/Screen**: multi-criteria star ratings (e.g., Teaching Quality, Workload, Grading Fairness), text area, tag picker (multi-select chips), **Anonymous toggle switch** (prominently designed — show ON/OFF states and a small tooltip explaining "Your name will be hidden from everyone, including professors and admins"), submit button.
- **Ask a Question Modal**: text area, same anonymous toggle, submit.
- **My Reviews / My Questions page**: list of the student's own submitted reviews & questions with status chips (approved/pending/rejected, answered/unanswered), edit/delete options.
- **Notifications panel**: dropdown or page — "Your question was answered", "Your review was approved", etc.
- **Profile & Settings**: avatar (initials-based, no upload needed for students), name, department, semester (read-only, derived from student ID), default-anonymity preference toggle, notification preferences.
- **Change Password screen**: current password, new password, confirm new password, with the same strength validation as signup, success/error states.
- **Empty states**: no reviews yet, no search results, no questions yet — friendly illustration + CTA, no invented sample content.

### 5. TEACHER Role Screens
- **Teacher Dashboard**: summary cards (overall avg rating, total reviews, total questions pending answer, trending feedback tags), list of their courses with per-course avg rating and review count.
- **Course Feedback View** (per course): aggregated rating breakdown chart, filterable review list (all reviews are visible but **anonymous authorship is preserved and cannot be revealed** — never design a "reveal identity" affordance for anonymous items), ability to mark reviews as "acknowledged" / flag inappropriate for admin review.
- **Q&A Management**: list of unanswered questions across their courses first, then answered; "Answer" modal (text area, submit — teacher's identity always shown, never anonymous for answers).
- **Analytics tab**: rating trend over semesters (line/bar chart), most common feedback tags (tag frequency bars).
- **Profile & Settings**:
  - **Profile photo upload** — avatar with an "upload/change photo" affordance (drag-and-drop or click-to-browse), crop/preview state, remove-photo option, and a fallback initials-avatar state when no photo is set.
  - Name, department, title, public teacher-profile preview (shown to students).
- **Change Password screen**: same pattern as Student — current password, new password, confirm new password, validation and success/error states.

### 6. ADMIN Role Screens
- **Course Management (Admin-only)**: Admin adds and manages courses. Include a "10 departments" structure — CSE, EEE, ME, MIE, MME, PME, Civil, WRE, Biomedical, ETE, Architecture, URP — as a department filter/selector. "Add Course" form: course name, course code, department (dropdown of the 10), credit hours, short description, assigned teacher. Course list/table view with edit/delete actions. Students only ever see courses that an Admin has added — no student-side course creation.
- **Admin Dashboard / Analytics Overview**: platform-wide KPI cards (total users, total courses, total reviews, total questions, flagged content count, active anonymous posts), usage trend chart, recent activity feed.
- **User Management**: table of users (name, role, department, status active/suspended, join date), search/filter, role-change action, suspend/ban action, row detail drawer.
- **Content Moderation Queue**: tabbed list — Pending Reviews / Pending Questions / Reported Content — each row shows content preview, anonymous or named badge, course/professor context, Approve / Reject / Escalate buttons, reason/note field on reject.
- **Reports & Abuse Handling**: list of user-submitted reports with reason, linked content, status (open/resolved), resolve modal.
- **Platform Analytics**: charts for review volume over time, top departments, top-rated & lowest-rated courses/professors, anonymous vs. named post ratio.
- **Admin cannot see the real identity of anonymous authors in the UI** — reflect this constraint visually (identity field always shows "Anonymous" with a lock icon for such content, even in the admin table).
- **Change Password screen**: same pattern, current/new/confirm password with validation.

### 7. Shared/Cross-Role Components to Design as a Library
- Star rating input & display (interactive + read-only)
- Anonymous badge (purple, lock icon) vs. Named author chip
- Status chips: pending (amber), approved (green), rejected (red), answered (green), unanswered (grey)
- Tag/chip picker and tag pill
- Search bar with filter drawer (department, semester, rating range, sort)
- Card components: Course Card, Professor Card, Review Card, Question Card, User Row (admin table)
- Modal patterns: Write Review, Ask Question, Confirm Action (approve/reject/suspend), Success/Error toast
- Avatar component: initials fallback + uploaded-photo variant (used by Teacher profile)
- Password field component: masked/unmasked toggle, strength meter, error state
- Empty state illustration pattern
- Notification dropdown item
- Theme toggle switch (light/dark)
- Sidebar/topbar navigation states per role (from section 2)

### 8. Interaction / State Coverage (make this explicit in the file)
For every key screen, include frames for:
- Default / populated state
- Empty state
- Loading/skeleton state
- Error state (e.g., failed submit, network error, invalid email domain, password mismatch)
- Anonymous vs. Named variant (for reviews & questions)
- Light vs. Dark theme variant
- Mobile responsive variant (at least Student Dashboard, Course Detail, Write Review, Admin Moderation Queue, Teacher Profile with photo upload) at 375px width

### 9. Information Architecture / Sitemap
Include a simple sitemap frame showing the flow:
`Landing → Role Selection (Student/Teacher) or Direct Admin Login → Signup (Student/Teacher only) → OTP → Login → [Student Dashboard | Teacher Dashboard | Admin Dashboard] → respective sub-pages`, with arrows showing how Course/Professor detail pages are shared entry points reachable from Student search and from Teacher's "My Courses," and how Admin's "Course Management" feeds the courses students browse.

### 10. Deliverable Structure in Figma
Organize pages as:
1. 🎨 Design System (Light + Dark)
2. 🔐 Auth Flow
3. 🎓 Student Flow
4. 👨‍🏫 Teacher Flow
5. 🛡️ Admin Flow
6. 🧩 Components Library
7. 🗺️ Sitemap / User Flow

Use auto-layout, components + variants (not just duplicated frames) so role, theme, and state changes can be swapped via the Variants panel, and name layers clearly (e.g., `ReviewCard/Anonymous/Approved/Dark`, `Navbar/Role=Teacher/Theme=Light`).

## PROMPT END

---

### Notes for you (not part of the prompt)
- Kept the existing blue/green/purple palette from your coded app's `index.css` since it's already a strong fit for a trust-driven student–teacher platform — just formalized it as the light theme and added a matching dark theme.
- Access rules (student/teacher email domain formats, admin direct login, no cross-role visibility) are now written into the Auth and Navigation sections so Figma Make encodes them as actual screen logic/validation states, not just a note.
- Password change screens are added per role, and the Teacher profile now includes a real photo-upload component with fallback initials state.
- "No demo data" is stated up front and repeated in the Student empty-states line, so generated screens use structural placeholders instead of invented sample reviews/courses.
