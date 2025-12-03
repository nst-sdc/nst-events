# Tekron App – Role-Based Login Flow

Based on the user’s role field in the database: `role: "participant"` or `role: "admin"`

---

## 1. User Opens the App

* App shows login screen (Email + Password / OTP).
* User enters credentials.

---

## 2. Backend Authenticates User

API returns:

* `uid`
* `name`
* `email`
* `role` (participant or admin)
* `approved_status` (for participants only)
* Token/session

This is the key field:

```
role: "participant" OR "admin"
```

---

# FLOW A: If role = participant

Participants get the **event mobile app experience**.

### Step 1: Redirect to Participant Home Shell

App checks:

```
if (role === "participant") {
    navigate("ParticipantApp");
}
```

### Step 2: Check Participant Approval Status

Two possible states:

### Case A: Approved

Show **full participant dashboard**:

* Competition location
* Timings & schedule
* Live event updates
* Map navigation
* Announcements
* QR check-in status

### Case B: Not Approved Yet

Show **limited mode**:

* Only campus map
* Directions & instructions
* Message: “Please check in at the reception desk.”

No access to:

* Event location
* Schedule
* Alerts
* Participant dashboard

---

# FLOW B: If role = admin

Admins get **a totally separate interface** — NOT the participant app.

### Step 1: Redirect to Admin Dashboard

```
if (role === "admin") {
    navigate("AdminDashboard");
}
```

### Admin Dashboard Features:

* QR scanner for participant check-in
* PIN verification screen
* Participant verification view
* Approve / Reject control
* Real-time event analytics
* Send alerts to all participants
* View locations, occupancy, trends
* Dashboard for all event stats

Admins never see the participant UI.
Participants never see the admin UI.

This separation is critical for security + clean UX.

---

# Final Role Logic (React Native Example)

```js
if (user.role === "admin") {
    navigation.replace("AdminDashboard");
} else if (user.role === "participant") {
    if (user.approved) {
        navigation.replace("ParticipantHome");
    } else {
        navigation.replace("LimitedAccessMap");
    }
}
```

Clean, simple, scalable.

---

# End-to-End Role Flow Summary

## Login → Check role

### If admin

→ Open Admin Dashboard
→ Full management access

### If participant

→ Check approved status
→ If approved → Event Dashboard
→ If not approved → Map-Only Mode


