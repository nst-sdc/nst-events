const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
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
    // 5. CREATE EVENT
    // ------------------------------------------
    const event = await prisma.event.create({
        data: {
            title: 'Tekron 2025',
            description: 'The official tech fest at Newton School of Technology, Pune.',
            location: 'NST Pune — MCA Building',
            startTime: new Date('2025-12-10T09:00:00Z'),
            endTime: new Date('2025-12-12T18:00:00Z'),
            status: 'UPCOMING',
        },
    });
    console.log(`Event created: ${event.title}`);

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
