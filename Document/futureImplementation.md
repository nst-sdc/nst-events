## MASTER IMPLEMENTATION PROMPT FOR TEKRON FEATURES

**"Extend my existing Tekron app (Expo React Native + React Native Web + Node.js/Express + Prisma/Postgres backend) with the following features, fully integrated with my existing roles (Participant, Admin, SuperAdmin, Volunteer), QR approval system, and Tekron branding. Implement backend, frontend (mobile + web), database schema, and admin tooling for ALL features described below. Use clean architecture, TypeScript if possible, and production-quality code.**

The app context:

* Tekron = tech fest at Newton School of Technology, Pune
* Roles:

  * Participant (unapproved/approved, QR-based check-in)
  * Admin (check-in, approvals, participant ops)
  * SuperAdmin (system control, events, admins, alerts)
  * Volunteer (new role to be added)
* Backend: Node.js + Express + Prisma + PostgreSQL + JWT
* Frontend: Expo + Expo Router (app dir) + RN Web
* RBAC already exists with auth middlewares.

Now implement the following features:"

---

### 1️⃣ Live Event Tracking (Real-Time Status) (Done)

**Goal:** Track and display live event state: upcoming, live, delayed, finished.

**Backend:**

* Extend `Event` model:

  ```prisma
  enum EventStatus {
    UPCOMING
    LIVE
    PAUSED
    COMPLETED
    CANCELLED
  }

  model Event {
    id          String      @id @default(uuid())
    title       String
    description String?
    location    String?
    startTime   DateTime?
    endTime     DateTime?
    status      EventStatus @default(UPCOMING)
    currentRound Int?       // optional
    // other fields...
  }
  ```
* Admin/SuperAdmin endpoints:

  * `PATCH /admin/events/:id/status` → update status + optional `currentRound`
  * `GET /events/live` → list all LIVE events
* Optionally use Socket.IO or Server-Sent Events to push live updates; otherwise use polling.

**Frontend:**

* Participant dashboard:

  * Show “Live Now”, “Starting Soon”, “Completed” sections.
* Live badge UI:

  * Animated "LIVE" chip with pulsing red dot for ongoing events.
* Admin view:

  * Toggle buttons to move events between states.

---

### 2️⃣ Live Leaderboards (Done)

**Goal:** Show live rankings for competitive events (coding, quiz, hackathon, etc.).

**Backend:**

* Add models:

  ```prisma
  model EventParticipant {
    id            String   @id @default(uuid())
    participantId String
    eventId       String
    score         Int      @default(0)
    rank          Int?
    updatedAt     DateTime @default(now())

    participant   Participant @relation(fields: [participantId], references: [id])
    event         Event       @relation(fields: [eventId], references: [id])
  }
  ```
* Endpoints:

  * `GET /events/:id/leaderboard`
  * `POST /admin/events/:id/score` → update score for a participant.
  * Automatically recompute rank when scores update.

**Frontend:**

* For participants:

  * “Leaderboard” tab on event detail page.
* For admins:

  * Simple input UI to update participant scores.
* UI:

  * Animated rank changes (e.g. slide + highlight when rank improves).

---

### 3️⃣ Smart Notifications (Context-Aware) (Done)

**Goal:** Send time-based + event-based notifications.

**Backend:**

* Integrate Expo Push Notifications:

  * Store `pushToken` on `Participant`, `Admin`.
* Scheduled notification worker:

  * For each registered participant, send:

    * “Your event starts in 30 minutes” based on event.startTime.
* Endpoints:

  * `POST /admin/events/:id/notify-participants`
  * `POST /superadmin/broadcast`

**Frontend:**

* Ask permission for notifications on login.
* Settings toggle: enable/disable notifications.
* Handle receiving notifications in app (foreground + background).

---

### 4️⃣ Digital Event Badges (Done)

**Goal:** Award digital badges for participation & achievements.

**Backend:**

* Models:

  ```prisma
  model Badge {
    id          String   @id @default(uuid())
    name        String
    description String?
    iconUrl     String?
    type        String  
  }

  model ParticipantBadge {
    id            String   @id @default(uuid())
    participantId String
    badgeId       String
    awardedAt     DateTime @default(now())

    participant   Participant @relation(fields: [participantId], references: [id])
    badge         Badge       @relation(fields: [badgeId], references: [id])
  }
  ```
* SuperAdmin endpoints to create badges.
* Admin or system rules to award badges (e.g., attendance, winning event).

**Frontend:**

* Profile: “My Tekron Badges” section.
* Shareable badge view (for screenshots / LinkedIn).
* Animated badge unlock popup.

---

### 5️⃣ Gamification + XP System (Done)

**Goal:** Reward engagement with XP and levels.

**Backend:**

* Extend Participant:

  ```prisma
  model Participant {
    // ...
    xp       Int    @default(0)
    level    Int    @default(1)
  }
  ```
* XP sources:

  * Check-in → +X XP
  * Attending event → +Y XP
  * Submitting feedback → +Z XP
* Endpoint:

  * `GET /participant/xp`
  * Auto-level logic (e.g. every 100 XP → level up).

**Frontend:**

* Dashboard: XP progress bar + level chip.
* Subtle "Level Up" animation.

---

### 6️⃣ Tekron Map + Indoor Navigation (Done)

**Goal:** Static but smart indoor navigation for NST.

**Backend:**

* `Location` model:

  ```prisma
  model Location {
    id        String   @id @default(uuid())
    name      String
    building  String
    floor     String
    mapCode   String?  // e.g. code to map overlay
    isPublic  Boolean  @default(true)
  }
  ```
* Link events to locations.

**Frontend:**

* Use:

  * For web: Google Maps iframe (you already have) for campus.
  * For indoor: custom RN SVG / image map per floor.
* Unapproved users:

  * Show *only* static map and directions to registration desk (4th floor MCA).
* Approved users:

  * Highlight exact event room/ building.

---

### 7️⃣ Volunteer Panel (New Role) (Done)

**Goal:** Support volunteers with limited but useful permissions.

**Backend:**

* Add `Volunteer` model or `role: "VOLUNTEER"` in User entity.
* Permissions:

  * See participants assigned to their event.
  * Mark "arrived" / "in room".
  * Read-only view of event details.
* Endpoints:

  * `/volunteer/events`
  * `/volunteer/events/:id/attendees`
  * `/volunteer/attendees/:id/mark-arrived`

**Frontend:**

* New stack: VolunteerApp.
* Simple, mobile-first UI: list of events, attendees, presence toggles.

---

### 9️⃣ Offline Mode / PWA Support

**Goal:** App usable even with bad/no internet.

**Web (PWA):**

* Use Expo Web + `expo export:web`.
* Add service worker:

  * Cache:

    * Participant QR
    * Timetable
    * Basic event info
    * Last known location map
* Show offline banner when no connection.

**Mobile:**

* Cache critical data in AsyncStorage:

  * Participant details
  * QR code
  * Registered events and times
* Show stale data with “Last updated at…” label.

---

### 1️⃣0️⃣ Feedback System Per Event (Done)

**Goal:** Collect insights after every event.

**Backend:**

```prisma
model Feedback {
  id            String   @id @default(uuid())
  participantId String
  eventId       String
  rating        Int      // 1-5
  comment       String?
  createdAt     DateTime @default(now())

  participant   Participant @relation(fields: [participantId], references: [id])
  event         Event       @relation(fields: [eventId], references: [id])
}
```

* Rules:

  * One feedback per event per participant.
* Endpoints:

  * `POST /participant/events/:id/feedback`
  * `GET /admin/events/:id/feedback-summary`

**Frontend:**

* After event end → show feedback modal.
* 1–5 stars + optional comment.
* Admin view: average rating, total responses, comments list.

---

### 1️⃣1️⃣ Emergency Broadcast Mode (Done)

**Goal:** Critical communication system.

**Backend:**

* Add field to `Alert`:

  ```prisma
  model Alert {
    // ...
    isEmergency Boolean @default(false)
  }
  ```
* Endpoint:

  * `POST /superadmin/alerts/emergency`

    * Sends to all participants + admins.
* Emergency alerts should bypass normal filters.

**Frontend:**

* Show:

  * Full-width red banner at top of app.
  * Popup modal on first receive.
* Banner persists until dismissed.

---

### 1️⃣4️⃣ Photo Wall (Moderated Gallery) (Done)

**Goal:** Show Tekron highlights in the app.

**Backend:**

```prisma
model Photo {
  id            String   @id @default(uuid())
  uploaderId    String
  url           String
  caption       String?
  approved      Boolean  @default(false)
  createdAt     DateTime @default(now())

  uploader Participant @relation(fields: [uploaderId], references: [id])
}
```

* Participants upload photos.
* Admin/SuperAdmin approve them.
* Endpoints:

  * `POST /participant/photos`
  * `GET /photos/public`
  * `GET /admin/photos/pending`
  * `POST /admin/photos/:id/approve`

**Frontend:**

* Gallery screen with grid layout.
* "Upload your Tekron moment" (optional).
* Only approved photos displayed publicly.

---

### 1️⃣5️⃣ Lost & Found System (Done)

**Goal:** Simple but powerful Lost & Found.

**Backend:**

```prisma
model LostFoundItem {
  id          String   @id @default(uuid())
  type        String   // LOST | FOUND
  title       String
  description String?
  location    String?
  reportedById String
  claimedById String?
  status      String   // OPEN | CLAIMED | CLOSED
  createdAt   DateTime @default(now())

  reportedBy Participant @relation("ReportedBy", fields: [reportedById], references: [id])
  claimedBy  Participant? @relation("ClaimedBy", fields: [claimedById], references: [id])
}
```

* Endpoints:

  * `POST /participant/lost-found/report`
  * `GET /participant/lost-found`
  * `POST /admin/lost-found/:id/mark-claimed`

**Frontend:**

* "Lost & Found" section:

  * Separate tabs for LOST and FOUND.
  * Simple forms to report items.
  * Admin tools for marking items resolved.

---

### 🧠 BONUS — SuperAdmin Analytics Dashboards

**Goal:** Give SuperAdmin a full view of Tekron.

**Backend:**

* Analytics endpoints:

  * `/superadmin/analytics/overview`

    * Total participants, approved, checked-in
    * Events count, feedback avg, XP distribution
  * `/superadmin/analytics/events`

    * Per-event participation, feedback, live status
  * `/superadmin/analytics/engagement`

    * XP, badge distribution, leaderboard stats

**Frontend:**

* SuperAdmin Dashboard:

  * Charts (using something like Victory Native / Recharts on web).
  * Cards:

    * “Total Tekron Participants”
    * “Check-in Rate”
    * “Average Event Rating”
    * “Top Events”
  * Time-filtering (today / fest duration).

---

### 🔧 General Requirements

* Use existing RBAC and add new VOLUNTEER where needed.
* Write clean, modular code:

  * `controllers/`, `services/`, `routes/`, `middleware/`
* Add validation for all inputs.
* Make sure all new endpoints are secured by correct middleware.
* Keep everything mobile + web compatible.
* Add at least basic tests for critical flows (leaderboard, feedback, approvals, emergency broadcast).

**Deliver all updated Prisma schemas, migrations, backend routes, controllers, services, and frontend screens/components for these features. Make the whole system production-ready and aligned with Tekron’s branding and UX.**
