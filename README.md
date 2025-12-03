# Tekron 2.0 - Event Management System

Tekron 2.0 is a comprehensive event management application designed to streamline participant registration, access control, and event administration. It features a robust backend with role-based access control and a React Native frontend for participants and admins.

## Features

### Authentication & Roles
- **Automatic Role Assignment**: Roles are determined by email domain:
  - `*@superadmin.com` → **SuperAdmin**
  - `*@admin.com` → **Admin**
  - Others → **Participant**
- **Secure Login**: JWT-based authentication with secure storage.
- **No Public Registration**: Accounts are pre-seeded or created by admins.

### Participant Features
- **Unapproved Access**:
  - View personal QR Code for entry.
  - View static Venue Map with instructions.
  - Restricted from accessing event details until approved.
- **Approved Access**:
  - **Dashboard**: View event schedule and announcements.
  - **Alerts**: Real-time notifications from admins.
  - **Profile**: Manage personal details.

### Admin Features
- **Dashboard**: Live metrics (Total Participants, Pending Approvals, etc.).
- **QR Scanner**: Scan participant QR codes to validate and approve entry.
- **Approval Workflow**: Review and approve/reject participants.
- **Announcements**: Send alerts to all participants.

## Tech Stack

### Backend (`tekron-backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Auth**: JWT, bcrypt
- **Tools**: Nodemon, Dotenv

### Frontend (`tekron-frontend`)
- **Framework**: React Native (Expo)
- **Routing**: Expo Router
- **State Management**: Zustand
- **UI**: Custom Theme System, Linear Gradients
- **Features**: Camera (QR Scanning), WebView (Maps), Secure Store

## Project Structure

```
tekron-2.0-APK/
├── tekron-backend/         # Express API & Database
│   ├── prisma/            # Schema & Seed script
│   ├── src/
│   │   ├── controllers/   # Logic for Auth, Admin, Participant
│   │   ├── routes/        # API Endpoints
│   │   ├── middleware/    # Auth Guards
│   │   └── utils/         # JWT, QR helpers
│   └── server.js          # Entry point
│
└── tekron-frontend/        # Expo React Native App
    ├── app/               # Screens & Navigation (File-based routing)
    │   ├── admin/         # Admin screens
    │   ├── participant/   # Participant screens
    │   └── auth/          # Login screen
    ├── components/        # Reusable UI components
    ├── context/           # Global State (Zustand)
    └── constants/         # Theme & Config
```

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app (for testing on device)
- PostgreSQL Database URL

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd tekron-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in `tekron-backend/` and add:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/dbname"
   JWT_SECRET="your_super_secret_key"
   PORT=3000
   ```
4. Push Database Schema:
   ```bash
   npx prisma db push
   ```
5. Seed the Database (Create default users):
   ```bash
   node prisma/seed.js
   ```
6. Start the Server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd tekron-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Backend URL:
   Open `constants/config.ts` and update `BACKEND_URL` with your machine's local IP address (not localhost if testing on device):
   ```typescript
   export const BACKEND_URL = 'http://YOUR_LOCAL_IP:3000';
   ```
4. Start the App:
   ```bash
   npx expo start
   ```
5. Scan the QR code with Expo Go (Android/iOS).

## Usage Guide

### Default Users (from Seed)

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **SuperAdmin** | `root@superadmin.com` | `SuperAdmin@123` | Full System Access |
| **Admin** | `john@admin.com` | `Admin@123` | Dashboard, Scanner, Approvals |
| **Participant** | `arpit@example.com` | `User@123` | Map/QR (Unapproved), Full (Approved) |

### Testing the Flow
1. **Login as Participant** (`arpit@example.com`).
   - You will see the **Venue Map** and **QR Code**.
   - You cannot access the Dashboard yet.
2. **Login as Admin** (`john@admin.com`) on another device or simulator.
   - Go to **Scanner** or **Approvals**.
   - Scan the participant's QR or manually approve them.
3. **Refresh Participant App**.
   - You should now have full access to the **Dashboard**, **Events**, and **Alerts**.

## Contributing
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

---
Built with by the Tekron Team.
