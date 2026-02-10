import { PrismaClient, EventStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker/locale/en_IN';

import crypto from 'crypto';

const prisma = new PrismaClient();

const generateQRCodeString = (participantId: string, createdAt: Date) => {
    const data = {
        id: participantId,
        timestamp: new Date(createdAt).toISOString(),
        type: 'participant_qr'
    };
    return JSON.stringify(data);
};

async function main() {
    console.log('🌱 Starting secure seed...');

    // 1. Cleanup
    console.log('🧹 Cleaning up database...');
    await prisma.approvalLog.deleteMany();
    await prisma.magicLinkToken.deleteMany();
    await prisma.eventParticipant.deleteMany();
    await prisma.participantBadge.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.photo.deleteMany();
    await prisma.lostFoundItem.deleteMany();
    await prisma.admin.deleteMany(); // Reset Admins
    await prisma.participant.deleteMany(); // Reset Participants
    await prisma.volunteer.deleteMany();
    await prisma.superAdmin.deleteMany();
    await prisma.event.deleteMany(); // Reset Events

    // 2. Master User "Arpit Sarang"
    const masterPassword = await bcrypt.hash('ArpitSarang', 10);
    // Use fixed ID for master user to generate stable QR
    const arpitId = 'master-admin-id';

    const arpit = await prisma.participant.upsert({
        where: { email: 'arpitsarang@gmail.com' },
        update: {
            name: 'Arpit Sarang',
            password: masterPassword,
            approved: true,
            // We can't easily update QR here without knowing the ID first if upsert is update, 
            // but for seed repeatedly running it's fine. 
            // Simplified: won't set QR on update to avoid complexity
        },
        create: {
            email: 'arpitsarang@gmail.com',
            name: 'Arpit Sarang',
            password: masterPassword,
            approved: true,
            qrCode: generateQRCodeString('arpit-sarang-id', new Date())
        },
    });

    console.log('👤 Upserted Master User: Arpit Sarang');

    // 2.1 Specific Role Users
    const userPass = await bcrypt.hash('user123@', 10);
    const userId = faker.string.uuid();
    await prisma.participant.create({
        data: {
            id: userId,
            email: 'user@gmail.com',
            name: 'User',
            password: userPass,
            approved: true,
            qrCode: generateQRCodeString(userId, new Date())
        }
    });

    const adminSpecificPass = await bcrypt.hash('admin123@', 10);
    await prisma.admin.create({
        data: {
            email: 'admin@gmail.com',
            name: 'Admin',
            password: adminSpecificPass,
        }
    });

    const volPass = await bcrypt.hash('volunteer123@', 10);
    await prisma.volunteer.create({
        data: {
            email: 'volunteer@gmail.com',
            name: 'Volunteer',
            password: volPass,
        }
    });

    const superAdminPass = await bcrypt.hash('superadmin123@', 10);
    await prisma.superAdmin.create({
        data: {
            email: 'superadmin@gmail.com',
            name: 'Super Admin',
            password: superAdminPass,
        }
    });

    console.log('✅ Created User, Admin, Volunteer, SuperAdmin');

    // 2.2 Newton Users
    const newtonUserPass = await bcrypt.hash('NSTUser123@', 10);
    const newtonUserId = faker.string.uuid();
    await prisma.participant.upsert({
        where: { email: 'newton@user.com' },
        update: {
            password: newtonUserPass,
            name: 'Newton User',
            approved: true
        },
        create: {
            id: newtonUserId,
            email: 'newton@user.com',
            name: 'Newton User',
            password: newtonUserPass,
            approved: true,
            qrCode: generateQRCodeString(newtonUserId, new Date())
        }
    });

    const newtonAdminPass = await bcrypt.hash('NSTAdmin123@', 10);
    await prisma.admin.upsert({
        where: { email: 'newton@admin.com' },
        update: {
            password: newtonAdminPass,
            name: 'Newton Admin'
        },
        create: {
            email: 'newton@admin.com',
            name: 'Newton Admin',
            password: newtonAdminPass,
        }
    });
    console.log('🍎 Created Newton User & Newton Admin');

    // 3. Magic Link for Arpit
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.magicLinkToken.create({
        data: {
            email: arpit.email,
            token: token,
            expiresAt: expiresAt,
        },
    });

    console.log(`🚀 ARPIT LOGIN LINK: nst-events://auth/callback?token=${token}`);

    // 4. Create 2 Admins
    const admins = ['admin1@nst.events', 'admin2@nst.events'];
    for (const adminEmail of admins) {
        let adminPass = faker.internet.password();
        if (adminEmail === 'admin1@nst.events') {
            adminPass = 'AdminPass123!';
        }
        const adminHash = await bcrypt.hash(adminPass, 10);

        await prisma.admin.create({
            data: {
                email: adminEmail,
                name: faker.person.fullName(),
                password: adminHash,
            }
        });
        console.log(`🛡️ Created Admin: ${adminEmail} (Pass: ${adminPass})`);
    }

    // 5. Dummy Participants (50 Unique Passwords)
    // 5. Dummy Participants
    console.log('👥 Creating 50 Dummy Participants...');

    // Create deterministic test user first
    const testUserPass = await bcrypt.hash('TestPass123!', 10);
    const testUserId = faker.string.uuid();
    await prisma.participant.create({
        data: {
            id: testUserId,
            email: 'testuser@nst.events',
            name: 'Test Participant',
            password: testUserPass,
            approved: true,
            xp: 100,
            level: 5,
            qrCode: generateQRCodeString(testUserId, new Date())
        }
    });
    console.log(`   [FIXED TEST USER] Email: testuser@nst.events | Pass: TestPass123!`);

    for (let i = 0; i < 50; i++) {
        const plainPassword = faker.internet.password();
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const email = faker.internet.email();
        const name = faker.person.fullName();

        await prisma.participant.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword,
                approved: faker.datatype.boolean(),
                xp: faker.number.int({ min: 0, max: 1000 }),
                level: faker.number.int({ min: 1, max: 10 }),
            },
        });

        // Log first 5 for testing
        if (i < 5) {
            console.log(`   [TEST USER ${i + 1}] Email: ${email} | Pass: ${plainPassword}`);
        }
    }

    // 6. Dummy Events
    const events: { title: string; description: string; location: string; startTime: Date; endTime: Date; status: EventStatus }[] = [];
    const baseDate = new Date();
    // Set to 2026 explicitly to match current context or use current year if preferred. 
    // Context says current time is 2026-01-21, so Jan 30/31 2026 are correct.
    const year = baseDate.getFullYear();

    const dates = [
        new Date(year, 0, 30), // Jan 30
        new Date(year, 0, 31)  // Jan 31
    ];

    const eventTemplates = [
        { title: 'Opening Ceremony', desc: 'Kickoff for the event.', loc: 'Main Auditorium' },
        { title: 'Hackathon Round 1', desc: 'First coding sprint.', loc: 'Lab A' },
        { title: 'Lunch Break', desc: 'Networking and food.', loc: 'Cafeteria' },
        { title: 'Guest Lecture', desc: 'Talk by industry expert.', loc: 'Seminar Hall' },
        { title: 'Gaming Tournament', desc: 'FIFA and Valorant.', loc: 'Recreation Room' },
        { title: 'Hackathon Round 2', desc: 'Deep work session.', loc: 'Lab B' },
        { title: 'Tech Quiz', desc: 'Test your tech trivia.', loc: 'Room 101' },
        { title: 'Workshop: AI', desc: 'Hands-on AI session.', loc: 'Lab C' },
        { title: 'Closing Ceremony', desc: 'Prize distribution.', loc: 'Main Auditorium' },
        { title: 'After Party', desc: 'Music and fun.', loc: 'Open Ground' }
    ];

    let eventIdx = 0;

    for (const date of dates) {
        // 5 events per day
        const startTimes = [9, 11, 14, 16, 18]; // 9 AM, 11 AM, 2 PM, 4 PM, 6 PM

        for (const hour of startTimes) {
            if (eventIdx >= eventTemplates.length) break;

            const startTime = new Date(date);
            startTime.setHours(hour, 0, 0, 0);

            const endTime = new Date(date);
            endTime.setHours(hour + 1, 30, 0, 0); // 1.5 hour duration

            events.push({
                title: eventTemplates[eventIdx].title,
                description: eventTemplates[eventIdx].desc,
                location: eventTemplates[eventIdx].loc,
                startTime: startTime,
                endTime: endTime,
                status: EventStatus.UPCOMING,
            });
            eventIdx++;
        }
    }

    await prisma.event.createMany({
        data: events
    });

    console.log('📅 Created 10 Dummy Events');

    console.log('✅ Secure Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
