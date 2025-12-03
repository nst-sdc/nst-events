# Tekron App - Implemented Features

## Authentication & Security
- **Multi-role Support**: Dedicated login flows for Participants, Admins, and SuperAdmins.
- **JWT Authentication**: Secure, token-based session management.
- **Role-Based Access Control (RBAC)**: Protected routes and features based on user roles.
- **Participant Approval System**: Admins must approve new participant accounts before they can access the full app.

## Participant Features
- **Dashboard**: Real-time overview of event status, XP, and quick actions.
- **Digital ID (QR Code)**: Unique QR code for check-ins and identification.
- **Interactive Map**: Indoor navigation and venue maps to find event locations.
- **Live Schedule**: View upcoming, live, and completed events.
- **Gamification System**:
    - **XP & Leveling**: Earn XP and level up by participating in events.
    - **Badges**: Unlockable achievements (e.g., "Winner", "Volunteer").
- **Alerts & Notifications**: Real-time push notifications for announcements and updates.
- **Profile Management**: View and edit personal details.

## Admin Features
- **Admin Dashboard**: High-level statistics on participants, events, and system status.
- **QR Scanner**: Built-in scanner to verify participant IDs and check them into events.
- **Approval Management**: Interface to review and approve/reject new participant sign-ups.
- **Event Management**: Create, update, and manage the lifecycle of events (Upcoming -> Live -> Completed).
- **Live Leaderboard**: Monitor and manage real-time rankings for events.
- **Broadcast Alerts**: Send push notifications and in-app alerts to all participants.

## Technical Infrastructure
- **Backend**: Node.js & Express REST API.
- **Database**: PostgreSQL with Prisma ORM for type-safe database interactions.
- **Real-time Updates**: Socket.IO integration for live event status and leaderboard updates.
- **Push Notifications**: Integrated with Expo Push API for reliable cross-platform notifications.
- **Mobile App**: Built with React Native (Expo) for iOS and Android.
