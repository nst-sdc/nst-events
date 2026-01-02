# Features & RBAC Matrix

This document outlines the features and permissions available to different user roles within the Tekron Event App.

## Roles Overview

1.  **SuperAdmin**: Complete system control, including admin management and global configurations.
2.  **Admin**: Event execution, participant management, and on-ground operations.
3.  **Participant**:
    *   **Unapproved**: Limited access (Registration status, basic info).
    *   **Approved**: Full access to event features (Leaderboards, Alerts, Badges).

---

## Feature Matrix

### 1. User Management & Authentication

| Feature | SuperAdmin | Admin | Participant | Notes |
| :--- | :---: | :---: | :---: | :--- |
| Login (Email/Pass) | ✅ | ✅ | ✅ | Role determined by email domain |
| Magic Link Login | ✅ | ✅ | ✅ | Secure passwordless entry |
| View My Profile | N/A | N/A | ✅ | |
| View QR Code | N/A | N/A | ✅ | For check-in/verification |
| Check Approval Status | N/A | N/A | ✅ | |

### 2. Participant Administration

| Feature | SuperAdmin | Admin | Participant | Notes |
| :--- | :---: | :---: | :---: | :--- |
| Create Admin Accounts | ✅ | ❌ | ❌ | Restricted to SuperAdmin |
| View All Participants | ✅ | ✅ | ❌ | |
| View Pending Approvals | ✅ | ✅ | ❌ | Filtered list |
| Approve Participant | ✅ | ✅ | ❌ | Grants full app access |
| Reject Participant | ✅ | ✅ | ❌ | |
| Validate User QR | ✅ | ✅ | ❌ | For tracking attendance/entry |

### 3. Event Management

| Feature | SuperAdmin | Admin | Participant | Notes |
| :--- | :---: | :---: | :---: | :--- |
| Create Events | ✅ | ❌ | ❌ | |
| Update Event Details | ✅ | ❌ | ❌ | |
| Delete Events | ✅ | ❌ | ❌ | |
| Update Event Status | ✅ | ✅ | ❌ | e.g., Set to LIVE/COMPLETED |
| View Live Events | ✅ | ✅ | ✅ | Accessible to Unapproved too |
| View All Events | ✅ | ✅ | ✅ | **Requires Approval** for Participants |

### 4. Gamification & Scoring

| Feature | SuperAdmin | Admin | Participant | Notes |
| :--- | :---: | :---: | :---: | :--- |
| Update Scores | ✅ | ✅ | ❌ | |
| View Leaderboard | ✅ | ✅ | ✅ | **Requires Approval** for Participants |
| Create Badges | ✅ | ❌ | ❌ | Define new achievement types |
| Award Badges | ✅ | ✅ | ❌ | Give badges to users |
| View My Badges | N/A | N/A | ✅ | **Requires Approval** |
| View All Badges | ✅ | ❌ | ❌ | System-wide view |

### 5. Communication & Utility

| Feature | SuperAdmin | Admin | Participant | Notes |
| :--- | :---: | :---: | :---: | :--- |
| Send Alerts | ✅ | ✅ | ❌ | Push notifications/In-app alerts |
| View Alerts | ✅ | ✅ | ✅ | **Requires Approval** for Participants |
| View Unapproved Map | N/A | N/A | ✅ | Basic venue map for new users |
| Lost & Found (View) | ✅ | ✅ | ✅ | |
| Lost & Found (Report) | ✅ | ✅ | ✅ | |
| Lost & Found (Claim) | ✅ | ✅ | ✅ | |

---

## Detailed API Permissions

### SuperAdmin Routes
*   `POST /superadmin/create-admin`: Create new admin users.
*   `POST /superadmin/create-event`: Create new events.
*   `PUT /superadmin/events/:id`: Update event details.
*   `DELETE /superadmin/events/:id`: Remove events.
*   `POST /superadmin/badges`: Define new badges.
*   `GET /superadmin/badges`: List all defined badges.

### Admin Routes
*   `GET /admin/participants`: List all registered users.
*   `GET /admin/participants/pending`: List users waiting for approval.
*   `POST /admin/approve/:participantId`: Approve a user.
*   `POST /admin/reject/:participantId`: Reject a user.
*   `POST /admin/validate-qr`: Scan and verify user QR.
*   `PATCH /admin/events/:id/status`: Change event lifecycle (UPCOMING -> LIVE).
*   `POST /admin/events/:id/score`: Update participant scores.
*   `POST /admin/badges/award`: Grant a badge to a participant.

### Participant Routes
*   **Unapproved Access**:
    *   `GET /participant/me`: Profile info.
    *   `GET /participant/status`: Approval status.
    *   `GET /participant/qr`: Personal QR code.
    *   `GET /participant/unapproved-map`: Basic venue info.
    *   `GET /participant/events/live`: Only currently happening events.
*   **Approved Access Only** (Middleware: `requireApproval`):
    *   `GET /participant/events`: Full schedule.
    *   `GET /participant/events/:id/leaderboard`: Rankings.
    *   `GET /participant/alerts`: Notifications.
    *   `GET /participant/badges`: My earned achievements.

### Shared / Utility Routes
*   `POST /auth/login`: Unified login.
*   `POST /auth/magic-login`: Magic link generation.
*   `GET /lost-found`: View items (Authenticated).
*   `POST /lost-found/report`: Report item (Authenticated).
