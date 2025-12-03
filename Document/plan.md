
# **Tekron App — Full Project TODO List (Start → Finish)**

## **Phase 1: Initialization & Planning**

* [x] Define exact event flow (registration → check-in → location assignment → updates)
* [x] Decide central backend: Node + Supabase
* [x] Create GitHub repo + branches (main, dev, feature/*)
* [x] Set up project architecture for React Native
* [x] Decide UI theme + design system (colors, spacing, typography)
* [x] Create wireframes for all screens
* [x] Plan database models (Users, Events, Checkins, Alerts)

---

## **Phase 2: Core Setup**

* [x] Initialize React Native project
* [x] Install navigation (react-navigation)
* [x] Install state management (Zustand / Redux / Context)
* [x] Set up backend with auth
* [x] Setup QR generator + QR scanner dependency
* [x] Create environment variable setup

---

## **Phase 3: Authentication System**

* [x] Login screen UI
* [x] Email login logic
* [x] Create user session persistence
* [x] Handle invalid / expired QR codes
* [x] Add “Forgot password / resend QR” screens (Removed as per requirements)

---

## **Phase 4: QR Check-In System**

* [x] Build QR scanner screen
* [x] Validate QR against backend
* [x] Mark user as checked-in in database
* [x] Auto-assign room/location
* [x] Push location to user instantly
* [x] Add animated success popup (“You’re checked in!”)

---

## **Phase 5: Core User Experience**

* [x] Build dashboard showing:

  * [x] Event name
  * [x] Assigned location
  * [x] Schedule
  * [x] Alerts
* [x] Add micro-animations (fade, slide, bounce)
* [x] Add toast notifications
* [x] Add interactive transitions
* [x] Add dark mode support

---

## **Phase 6: Real-Time Updates**

* [x] Implement push notifications (Expo)
* [x] Build Alerts tab with live updates
* [x] Add round updates + scoring updates
* [x] Add emergency alert override (big red banner)

---

## **Phase 7: Admin Panel **

* [x] Admin login
* [x] View participant stats
* [x] Track who checked in
* [x] Send announcements
* [x] Assign/change event locations
* [x] Live dashboard (attendance + active events)

---

## **Phase 8: UI Polishing**

* [x] Smooth animations everywhere
* [x] Custom popups with blur/glass effects
* [x] Fancy loader screen
* [x] Polished card design
* [x] Logo + splash screen
* [x] Proper typography hierarchy

---

## **Phase 9: Testing**

* [ ] Test QR scanning in real lighting
* [ ] Test app on low-end phones
* [ ] Test slow network conditions
* [ ] Verify location assignment accuracy
* [ ] Test push notifications
* [ ] Catch all crashes + fix bugs

---

## **Phase 10: Build & Deployment**

* [ ] Prepare release build (signed APK or AAB)
* [ ] Test the release version on real devices
* [ ] Deploy backend to Render / Firebase / Vercel
* [ ] Publish app internally or sideload for event team
* [ ] Make documentation + onboarding guide

---

## **Phase 11: Final Touches Before Event**

* [ ] Load all event data into backend
* [ ] Add volunteer test accounts
* [ ] Dry-run the check-in system
* [ ] Prepare backup devices/scanners
* [ ] Print instructions for volunteers
