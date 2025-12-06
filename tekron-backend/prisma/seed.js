const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Tekron database...');

    // ------------------------------------------
    // 1. CLEAN DATABASE IN PROPER DEPENDENCY ORDER
    // ------------------------------------------

    await prisma.approvalLog.deleteMany();
    await prisma.eventParticipant.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.event.deleteMany();
    await prisma.location.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.superAdmin.deleteMany();

    // ------------------------------------------
    // 2. HASH PASSWORDS
    // ------------------------------------------
    const defaultPass = await bcrypt.hash('Password', 10);
    const arpitPass = await bcrypt.hash('ArpitSarang', 10);
    const maverickPass = await bcrypt.hash('Maverick', 10);

    // ------------------------------------------
    // 3. CREATE SUPERADMIN
    // ------------------------------------------
    const superAdmin = await prisma.superAdmin.create({
        data: {
            email: 'superadmin@superadmin.com',
            name: 'Super Admin',
            password: defaultPass,
        },
    });
    console.log(`SuperAdmin created: ${superAdmin.email}`);

    // ------------------------------------------
    // 4. CREATE ADMIN
    // ------------------------------------------
    const admin = await prisma.admin.create({
        data: {
            email: 'admin@admin.com',
            name: 'Event Admin',
            password: defaultPass,
        },
    });
    console.log(`Admin created: ${admin.email}`);

    // ------------------------------------------
    // 5. CREATE LOCATIONS & EVENTS
    // ------------------------------------------

    const locationsData = [
        { name: 'Main Auditorium', building: 'Block A', floor: 'Ground', mapCode: 'AUD-001', isPublic: true },
        { name: 'Seminar Hall 1', building: 'Block A', floor: '1st Floor', mapCode: 'SEM-101', isPublic: true },
        { name: 'Computer Lab 1', building: 'Block B', floor: '2nd Floor', mapCode: 'LAB-201', isPublic: true },
        { name: 'Computer Lab 2', building: 'Block B', floor: '2nd Floor', mapCode: 'LAB-202', isPublic: true },
        { name: 'Workshop Area', building: 'Block C', floor: 'Ground', mapCode: 'WS-001', isPublic: true },
        { name: 'Conference Room', building: 'Admin Block', floor: '3rd Floor', mapCode: 'CONF-301', isPublic: true },
        { name: 'Open Air Theatre', building: 'Campus Grounds', floor: 'Ground', mapCode: 'OAT-001', isPublic: true },
        { name: 'Cafeteria', building: 'Student Center', floor: 'Ground', mapCode: 'CAFE-001', isPublic: true },
        { name: 'Library Discussion Room', building: 'Library', floor: '1st Floor', mapCode: 'LIB-101', isPublic: true },
        { name: 'Innovation Hub', building: 'Block D', floor: '4th Floor', mapCode: 'HUB-401', isPublic: true },
    ];

    const createdLocations = [];
    for (const loc of locationsData) {
        const createdLoc = await prisma.location.create({ data: loc });
        createdLocations.push(createdLoc);
        console.log(`Location created: ${loc.name}`);
    }

    const eventsData = [
        {
            title: 'Tekron 2025 Opening Ceremony',
            description: 'Grand opening of the tech fest.',
            location: 'Main Auditorium - Room 001',
            startTime: new Date('2025-12-10T09:00:00Z'),
            endTime: new Date('2025-12-10T11:00:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[0].id
        },
        {
            title: 'AI & ML Workshop',
            description: 'Hands-on session on Artificial Intelligence.',
            location: 'Computer Lab 1 - Room 201',
            startTime: new Date('2025-12-10T12:00:00Z'),
            endTime: new Date('2025-12-10T15:00:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[2].id
        },
        {
            title: 'Hackathon Kickoff',
            description: 'Start of the 24-hour hackathon.',
            location: 'Seminar Hall 1 - Room 101',
            startTime: new Date('2025-12-10T16:00:00Z'),
            endTime: new Date('2025-12-10T17:00:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[1].id
        },
        {
            title: 'Cybersecurity Talk',
            description: 'Expert talk on modern security threats.',
            location: 'Conference Room - Room 301',
            startTime: new Date('2025-12-11T10:00:00Z'),
            endTime: new Date('2025-12-11T12:00:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[5].id
        },
        {
            title: 'Robotics Showcase',
            description: 'Display of student robotics projects.',
            location: 'Workshop Area - Room 001',
            startTime: new Date('2025-12-11T14:00:00Z'),
            endTime: new Date('2025-12-11T17:00:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[4].id
        },
        {
            title: 'Coding Contest',
            description: 'Competitive programming challenge.',
            location: 'Computer Lab 2 - Room 202',
            startTime: new Date('2025-12-11T09:00:00Z'),
            endTime: new Date('2025-12-11T12:00:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[3].id
        },
        {
            title: 'Cultural Night',
            description: 'Music and dance performances.',
            location: 'Open Air Theatre - Room 001',
            startTime: new Date('2025-12-11T19:00:00Z'),
            endTime: new Date('2025-12-11T22:00:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[6].id
        },
        {
            title: 'Startup Pitch',
            description: 'Students pitch their startup ideas.',
            location: 'Innovation Hub - Room 401',
            startTime: new Date('2025-12-12T10:00:00Z'),
            endTime: new Date('2025-12-12T13:00:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[9].id
        },
        {
            title: 'Networking Lunch',
            description: 'Lunch with industry experts.',
            location: 'Cafeteria - Room 001',
            startTime: new Date('2025-12-12T13:00:00Z'),
            endTime: new Date('2025-12-12T14:30:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[7].id
        },
        {
            title: 'Closing Ceremony',
            description: 'Prize distribution and closing remarks.',
            location: 'Main Auditorium - Room 001',
            startTime: new Date('2025-12-12T16:00:00Z'),
            endTime: new Date('2025-12-12T18:00:00Z'),
            status: 'UPCOMING',
            venueId: createdLocations[0].id
        }
    ];

    const createdEvents = [];
    for (const evt of eventsData) {
        const createdEvent = await prisma.event.create({ data: evt });
        createdEvents.push(createdEvent);
        console.log(`Event created: ${createdEvent.title}`);
    }

    // Assign one event to variables for later use in seed
    const event = createdEvents[0];

    // ------------------------------------------
    // 6. CREATE PARTICIPANTS
    // ------------------------------------------

    // Approved Participant
    const participant1 = await prisma.participant.create({
        data: {
            email: 'arpit@example.com',
            name: 'Arpit Sarang',
            password: arpitPass,
            approved: true,
            assignedEventId: event.id,
            qrCode: JSON.stringify({
                type: 'participant',
                email: 'arpit@example.com',
                eventId: event.id,
            }),
            approvedById: admin.id,
            approvedAt: new Date(),
        },
    });
    console.log(`Approved Participant created: ${participant1.email}`);

    // Unapproved Participant
    const participant2 = await prisma.participant.create({
        data: {
            email: 'maverick@example.com',
            name: 'Maverick',
            password: maverickPass,
            approved: false,
            qrCode: JSON.stringify({
                type: 'participant',
                email: 'maverick@example.com',
            }),
        },
    });
    console.log(`Unapproved Participant created: ${participant2.email}`);

    // ------------------------------------------
    // 7. CREATE EVENT PARTICIPANT RECORDS
    // ------------------------------------------

    await prisma.eventParticipant.create({
        data: {
            participantId: participant1.id,
            eventId: event.id,
            score: 0,
            rank: null,
        },
    });

    await prisma.eventParticipant.create({
        data: {
            participantId: participant2.id,
            eventId: event.id,
            score: 0,
            rank: null,
        },
    });

    console.log('Event participants linked');

    // ------------------------------------------
    // 8. CREATE APPROVAL LOG
    // ------------------------------------------

    await prisma.approvalLog.create({
        data: {
            participantId: participant1.id,
            adminId: admin.id,
            notes: 'Approved during initial onboarding',
        },
    });

    console.log('Approval log created');

    // ------------------------------------------
    // 9. CREATE ALERT
    // ------------------------------------------

    await prisma.alert.create({
        data: {
            title: 'Welcome to Tekron',
            message: 'Your journey at Tekron 2025 starts now. Check the schedule for upcoming sessions.',
            senderRole: 'admin',
        },
    });

    console.log('Alert created');

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
