
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

* [ ] Login screen UI
* [ ] OTP / Email login logic
* [ ] Create user session persistence
* [ ] Handle invalid / expired QR codes
* [ ] Add “Forgot password / resend QR” screens (optional)

---

## **Phase 4: QR Check-In System**

* [ ] Build QR scanner screen
* [ ] Validate QR against backend
* [ ] Mark user as checked-in in database
* [ ] Auto-assign room/location
* [ ] Push location to user instantly
* [ ] Add animated success popup (“You’re checked in!”)

---

## **Phase 5: Core User Experience**

* [ ] Build dashboard showing:

  * [ ] Event name
  * [ ] Assigned location
  * [ ] Schedule
  * [ ] Alerts
* [ ] Add micro-animations (fade, slide, bounce)
* [ ] Add toast notifications
* [ ] Add interactive transitions
* [ ] Add dark mode support

---

## **Phase 6: Real-Time Updates**

* [ ] Implement push notifications (Expo/Firebase)
* [ ] Build Alerts tab with live updates
* [ ] Add round updates + scoring updates
* [ ] Add emergency alert override (big red banner)

---

## **Phase 7: Admin Panel (Optional but OP)**

* [ ] Admin login
* [ ] View participant stats
* [ ] Track who checked in
* [ ] Send announcements
* [ ] Assign/change event locations
* [ ] Live dashboard (attendance + active events)

---

## **Phase 8: UI Polishing**

* [ ] Smooth animations everywhere
* [ ] Custom popups with blur/glass effects
* [ ] Fancy loader screen
* [ ] Polished card design
* [ ] Logo + splash screen
* [ ] Proper typography hierarchy

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
