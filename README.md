# Tekron App

Tekron App is an event management and check-in system designed to eliminate the chaos typically seen during college fests. The application streamlines participant entry, delivers real-time updates, and provides precise event location assignments immediately after check-in. Built with React Native, the app focuses on reliability, speed, and a smooth user experience through clean design and subtle animations.

---

## Overview

Last year’s fest struggled with scattered communication, delayed announcements, and confusion during check-in. Tekron App solves this by centralizing all user interactions and event information into one platform.

Key features include:

* QR-based check-in linked to email registration
* Automated location assignment for competitions
* Real-time alerts and announcements
* A modern, intuitive interface with smooth animations
* Scalable backend integration for participants and admins

---

## Features

### QR Check-In System

Participants receive a QR code via their registration confirmation email. Scanning this code verifies their identity, completes check-in, and triggers automated location updates within the app.

### Location Assignment

After successful check-in, the user is assigned:

* Event room or hall
* Floor and building identifiers
* Reporting time and instructions

### Real-Time Updates

Organizers can push:

* Schedule changes
* Round announcements
* Critical alerts and instructions

Participants receive these instantly inside the app.

### Modern UI/UX

* Clean and minimal interface
* Micro-animations for transitions
* Custom popups and modals
* Dark mode support
* Smooth navigation and interactions

---

## Tech Stack

**Frontend**

* React Native
* React Navigation
* Zustand / Redux / Context API (based on implementation)

**Backend**

* Node.js with Express / Firebase / Supabase (depending on chosen architecture)

**Additional Tools**

* QR code generator and scanner
* Push notification service (Firebase or similar)
* Cloud hosting (Render / Vercel / Firebase)

---

## Project Structure

```
/Tekron-App
  /src
    /components
    /screens
    /navigation
    /context or /store
    /services
    /utils
  /android
  /ios
  App.js
  package.json
```

---

## Core Screens

* Login / Authentication
* QR Scanner
* Check-In Success
* Dashboard
* Event Location Screen
* Alerts and Updates
* Settings

---

## Setup Instructions

### 1. Clone Repository

```
git clone https://github.com/nst-sdc/tekron-2.0-APK.git
cd tekron-app
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

Create a `.env` file and add:

```
API_URL=
FIREBASE_CONFIG=...
```

### 4. Run the App

```
npx react-native run-android
```

---

## Building the APK

### Debug APK

```
cd android
./gradlew assembleDebug
```

### Release APK

1. Generate a keystore
2. Configure `android/app/build.gradle` with signing configs
3. Build:

```
./gradlew assembleRelease
```

Final APK will be located at:

```
android/app/build/outputs/apk/release/
```

---

## Roadmap

* Add admin dashboard for event coordinators
* Add location mapping with markers
* Add offline fallback mode
* Add leaderboard and scoring module
* Improve analytics for attendance tracking

---

## Contributing

Fork the repository, create a feature branch, and open a pull request.
For major changes, open an issue first to discuss your ideas.

---

## License

This project is licensed under the MIT License.

