
# **Database Schema(ERD)**

```mermaid
erDiagram

    User ||--|{ QRCode : "has"
    User ||--|{ CheckInLog : "checked in logs"
    User ||--|{ AdminAction : "performed"
    User ||--o| Event : "assigned to"

    Event ||--o{ User : "participants"
    Event ||--o| Location : "has"
    Event ||--o{ Alert : "alerts"

    Location ||--o{ Event : "events held"

    AdminAction {
        string id
        string adminId
        string action
        json   meta
        datetime createdAt
    }

    CheckInLog {
        string id
        string userId
        string adminId
        datetime scannedAt
        string status
    }

    Alert {
        string id
        string senderId
        string eventId
        string title
        string message
        datetime createdAt
    }

    QRCode {
        string id
        string code
        string userId
        datetime createdAt
    }

    User {
        string id
        string name
        string email
        string password
        string role
        string approvalStatus
        boolean checkedIn
        string assignedEventId
        datetime approvedAt
        datetime createdAt
        datetime updatedAt
    }

    Event {
        string id
        string title
        string description
        datetime startTime
        datetime endTime
        string locationId
        datetime createdAt
        datetime updatedAt
    }

    Location {
        string id
        string name
        string building
        string floor
        string mapLink
        string description
        datetime createdAt
        datetime updatedAt
    }
```

---

# This ERD Covers:

* Users (roles: participant/admin)
* QR Codes
* Check-in approval logs
* Event allocations
* Locations
* Alerts system
* Admin audit log
* Full relationship mapping (one-to-one, one-to-many, many-to-many)

