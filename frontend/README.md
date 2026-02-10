PLATFORM:
- React Native (Android + iOS)
- Mobile-first only (web layout for iOS)
- Components must map cleanly to React Native primitives

DESIGN SYSTEM:
- Modern, minimal, startup-grade UI
- Dark mode default, light mode supported
- Use neutral backgrounds with a strong accent color
- Rounded cards (12–16 radius)
- Consistent spacing (8px system)
- Clear typography hierarchy
- Touch-friendly buttons (min height 48px)

NAVIGATION:
- Bottom Tab Navigator for main sections
- Stack Navigator for drill-down screens
- Role-based navigation rendering

BOTTOM TABS:
- Home
- Schedule
- Leaderboard
- Notifications
- Profile

SCREENS TO DESIGN:

1. LOGIN SCREEN
- TextInput for NST Pune email (domain restricted)
- Primary CTA: “Continue”
- Helper text: “Only NST Pune email IDs allowed”
- Loading & error state

2. HOME / EVENTS LIST
- Header with app title
- Search input
- Horizontal filter chips
- Scrollable FlatList of Event Cards
Event Card:
- Poster image
- Event title
- Club name
- Date & time
- CTA button (Register / Registered)

3. EVENT DETAILS
- ScrollView layout
- Banner image at top
- Event info section:
  - Title
  - Club
  - Date, time, venue
- Description block
- Primary CTA: Register / Unregister
- Disabled state when registration closed

4. REGISTRATION SUCCESS
- Success icon
- Confirmation message
- Event summary card
- CTA buttons:
  - Add to Schedule
  - Back to Home

5. SCHEDULE SCREEN
- Calendar-style UI
- Highlight registered events
- Upcoming events list

6. LEADERBOARD SCREEN
- Toggle: Event-wise / Global
- Rank list using FlatList
- Highlight current user row

7. NOTIFICATIONS SCREEN
- List of notifications
- Icon per notification type
- Unread badge indicator

8. PROFILE SCREEN
- Avatar
- Name, email, role
- Stats cards:
  - Registered
  - Attended
  - Points
- Button: Settings

9. SETTINGS SCREEN
- Dark / Light mode toggle
- Notification toggles
- Logout button (destructive)

10. ABOUT SCREEN
- App description
- Purpose
- Version info

11. HELP & SUPPORT SCREEN
- FAQ accordion
- Contact support
- Report issue CTA

ROLE-BASED SCREENS:

12. CLUB ADMIN DASHBOARD
- Stats cards
- Button: Create Event
- List of managed events
- Actions:
  - Edit
  - View registrations
  - Upload results
  - Close registrations

13. CREATE / EDIT EVENT SCREEN
- Scrollable form
- Inputs:
  - Event name
  - Description
  - Date & time picker
  - Venue
  - Max participants
- Poster image picker
- Save / Publish CTA

14. SUPER ADMIN PANEL
- Dashboard overview
- Manage users
- Approve / revoke club-admins
- Manage all events
- Send global notifications

UX REQUIREMENTS:
- SafeAreaView usage
- KeyboardAvoidingView for forms
- Loading skeletons
- Empty states
- Error states
- Smooth transitions

COMPONENT EXPECTATION:
- All UI should be feasible with:
  View, Text, Image, FlatList, ScrollView,
  Pressable, TextInput, Modal

OUTPUT EXPECTATION:
- Screen-by-screen UI layouts
- Clear component hierarchy
- Consistent spacing & typography
