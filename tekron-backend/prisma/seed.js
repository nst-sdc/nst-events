const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const saltRounds = 10;

    // SuperAdmin
    const superAdminPassword = await bcrypt.hash('SuperAdmin@123', saltRounds);
    const superAdmin = await prisma.superAdmin.upsert({
        where: { email: 'root@superadmin.com' },
        update: { password: superAdminPassword },
        create: {
            email: 'root@superadmin.com',
            name: 'Super Admin',
            password: superAdminPassword,
        },
    });
    console.log(`Created SuperAdmin: ${superAdmin.email}`);

    // Admin
    const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
    const admin = await prisma.admin.upsert({
        where: { email: 'john@admin.com' },
        update: { password: adminPassword },
        create: {
            email: 'john@admin.com',
            name: 'John Doe',
            password: adminPassword,
        },
    });
    console.log(`Created Admin: ${admin.email}`);

    // Participant
    const participantPassword = await bcrypt.hash('User@123', saltRounds);
    const participant = await prisma.participant.upsert({
        where: { email: 'arpit@example.com' },
        update: { password: participantPassword },
        create: {
            email: 'arpit@example.com',
            name: 'Arpit',
            password: participantPassword,
            approved: true, // "Full (Approved)"
        },
    });
    console.log(`Created Participant: ${participant.email}`);

    // Create Event
    const event = await prisma.event.create({
        data: {
            title: 'Tekron Tech Summit 2024',
            description: 'Annual tech summit for innovation and networking.',
            location: 'Convention Center, Mumbai',
            startTime: new Date('2024-12-15T09:00:00Z'),
            endTime: new Date('2024-12-15T18:00:00Z'),
        },
    });
    console.log(`Created Event: ${event.title}`);

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
