const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Clean up existing data
    // Delete in order of dependencies (child first)
    await prisma.approvalLog.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.event.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.superAdmin.deleteMany();

    // Hash password
    const password = await bcrypt.hash('Password', 10);
    const arpitPassword = await bcrypt.hash('ArpitSarang', 10);
    const maverickPassword = await bcrypt.hash('Maverick', 10);

    // Create SuperAdmin
    const superAdmin = await prisma.superAdmin.create({
        data: {
            email: 'superadmin@superadmin.com',
            name: 'Super Admin',
            password: password,
        },
    });
    console.log(`Created SuperAdmin: ${superAdmin.email}`);

    // Create Admin
    const admin = await prisma.admin.create({
        data: {
            email: 'admin@admin.com',
            name: 'Admin User',
            password: password,
        },
    });
    console.log(`Created Admin: ${admin.email}`);

    // Create Event
    const event = await prisma.event.create({
        data: {
            title: 'Tekron 2025',
            description: 'The biggest tech event of the year.',
            location: 'Tech Park, Innovation City',
            startTime: new Date('2025-12-10T09:00:00Z'),
            endTime: new Date('2025-12-12T18:00:00Z'),
        },
    });
    console.log(`Created Event: ${event.title}`);

    // Create Participants
    // 1. Approved Participant
    const participant1 = await prisma.participant.create({
        data: {
            email: 'arpit@example.com',
            name: 'Arpit Sarang',
            password: arpitPassword,
            approved: true,
            assignedEventId: event.id,
            qrCode: JSON.stringify({ type: 'participant', email: 'arpit@example.com' }),
            approvedById: admin.id,
            approvedAt: new Date(),
        },
    });
    console.log(`Created Participant: ${participant1.email}`);

    // 2. Unapproved Participant
    const participant2 = await prisma.participant.create({
        data: {
            email: 'maverick@example.com',
            name: 'Maverick',
            password: maverickPassword,
            approved: false,
            qrCode: JSON.stringify({ type: 'participant', email: 'maverick@example.com' }),
        },
    });
    console.log(`Created Participant: ${participant2.email}`);

    // Create Alert
    await prisma.alert.create({
        data: {
            title: 'Welcome to Tekron!',
            message: 'We are excited to have you here. Check the schedule for upcoming sessions.',
            senderRole: 'admin',
        },
    });
    console.log('Created Welcome Alert');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
