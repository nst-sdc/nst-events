# Tekron App – Complete App Flow (QR Check-In + Approval System)

## 1. User Arrives at Reception Desk

* Participant walks to the event reception counter.
* They already have their **QR code** from their registration email.

---

## 2. Reception Staff Opens Scanner Interface

* Staff member opens **Reception Scanner Panel** inside the Tekron Admin App (or staff version of the app).
* The panel requires a **PIN login** to start scanning.

  * Prevents misuse
  * Tracks which staff member checked in which participant

---

## 3. Staff Scans Participant’s QR Code

* User holds up their QR.
* Staff device scans it.

Backend steps:

* QR is decoded
* System checks if user exists
* System verifies if the user is already checked in or pending approval

---

## 4. Approval Process

### Case A: User Exists and Valid

Staff sees:

* User name
* Event name
* Registration ID
* Approval button

Staff presses **Approve**.

Backend updates:

* user.status = "approved"
* timestamp recorded
* location assigned (if applicable)

User's app instantly unlocks full access.

---

## 5. User App After Approval

Once approved, the participant’s Tekron App automatically shows:

### a) Event Dashboard

* Assigned competition room
* Building and floor
* Reporting time
* Check-in status: “Approved”

### b) Event Details

* List of all events they registered for
* Their timings
* Special instructions

### c) Live Alerts

* Real-time updates
* Round announcements
* Schedule changes

### d. Navigation

* Map of the college with highlighted route to their assigned location

They get the full experience.

---

## 6. User App If NOT Approved

If the user opens the app **before being approved**, or if reception rejects them:

The app will **NOT show event details**.

Instead, it will show:

### a. College Map Only

* Full campus map
* Directions to major areas:

  * Registration desk
  * Auditorium
  * Canteen
  * Washrooms
  * Help centers
  * Event buildings

### b. Message

“Please complete your check-in at the reception desk to access event details.”

### c. Limited Mode

* No access to location assignments
* No event schedule
* No alerts or updates
* Only navigation and general information is available

This ensures:

* No user sees event locations without approval
* No security issues
* Smooth flow for volunteers and participants alike

---

## 7. Edge Cases

### Already Approved User

If user scans again:

* Staff sees “User already checked in at [time]”
* No double approval

### Invalid QR

Staff sees “Invalid or unregistered QR code”
User app stays in limited mode.

---

# High-Level Flow Diagram (Text Version)

User arrives → Opens app → Limited mode
↓
Reception Staff logs in (PIN) → Scans QR
↓
If Valid → Approve → Backend updates
↓
User app unlocks → Event dashboard + location + alerts
↓
If Not Approved → User sees only campus map + instructions
