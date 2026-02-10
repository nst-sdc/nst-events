
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const generateQRCodeString = (participantId: string, createdAt: Date) => {
    const data = {
        id: participantId,
        timestamp: new Date(createdAt).toISOString(),
        type: 'participant_qr'
    };
    return JSON.stringify(data);
};

interface ParticipantData {
    name: string;
    email: string;
    password: string;
    eventName: string;
}

async function main() {
    console.log('🌱 Starting participant seed from credentials.md...');

    // 1. Read and Parse credentials.md
    const credentialsPath = path.join(__dirname, '../credentials.md');
    if (!fs.existsSync(credentialsPath)) {
        console.error('❌ credentials.md not found at', credentialsPath);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(credentialsPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    const participants: ParticipantData[] = [];
    let isTableStart = false;

    // Basic markdown table parser
    for (const line of lines) {
        if (line.includes('| Name | Email | Password | Event Name |')) {
            isTableStart = true;
            continue;
        }
        if (isTableStart && line.includes('|---|')) {
            continue;
        }
        if (isTableStart && line.startsWith('|')) {
            const parts = line.split('|').map(p => p.trim());
            // Expected format: | Name | Email | Password | Event Name |
            // parts[0] is empty, parts[1] is Name, etc.
            if (parts.length >= 5) {
                const name = parts[1];
                const email = parts[2];
                const password = parts[3];
                const eventName = parts[4];

                if (name && email && password && eventName) {
                    participants.push({ name, email, password, eventName });
                }
            }
        }
    }

    console.log(`📝 Found ${participants.length} participants to seed.`);

    // 2. Clear existing participants
    console.log('🧹 Clearing existing participants...');
    // We need to clear tables that reference Participant first or cascade delete
    // Based on schema: 
    // ParticipantBadge (participantId)
    // Feedback (participantId)
    // Photo (uploaderId)
    // LostFoundItem (reportedById, claimedById)
    // ApprovalLog (participantId)
    // EventParticipant (participantId)
    await prisma.participantBadge.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.photo.deleteMany();
    // LostFoundItem has two relations, need to be careful. cascading usually handles it but explicit delete is safer
    await prisma.lostFoundItem.deleteMany();
    await prisma.approvalLog.deleteMany();
    await prisma.eventParticipant.deleteMany();

    // Deleting participants
    await prisma.participant.deleteMany();
    console.log('✅ Participants cleared.');

    // 3. Process Events and Insert Participants
    const eventCounts: Record<string, number> = {};
    const eventCache: Record<string, string> = {}; // Name -> ID

    for (const p of participants) {
        // Find or create event
        let eventId = eventCache[p.eventName];
        if (!eventId) {
            const existingEvent = await prisma.event.findFirst({
                where: { title: p.eventName }
            });

            if (existingEvent) {
                eventId = existingEvent.id;
            } else {
                // Create minimal event if not exists
                const newEvent = await prisma.event.create({
                    data: {
                        title: p.eventName,
                        description: `Event for ${p.eventName}`,
                        location: 'TBD',
                        startTime: new Date(),
                        endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // +1 day
                    }
                });
                eventId = newEvent.id;
                console.log(`🆕 Created missing event: ${p.eventName}`);
            }
            eventCache[p.eventName] = eventId;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(p.password, 10);

        // Create Participant
        // Using upsert to be safe against duplicate emails in the source list, keeping the last one or just creating
        // Since we deleted all, create should work, but unique constraint on email might hit if duplicates in list.
        // Let's use upsert or try-catch. credentials.md might have duplicates?
        // Let's assume unique emails for now, but handle error gracefully.

        try {
            const newParticipant = await prisma.participant.create({
                data: {
                    name: p.name,
                    email: p.email,
                    password: hashedPassword,
                    approved: false, // Explicitly false as requested
                    assignedEventId: eventId,
                    // Generate QR immediately
                    qrCode: '' // Placeholder, update below or generate ID first?
                }
            });

            // Update QR code with the actual ID
            const qrCode = generateQRCodeString(newParticipant.id, newParticipant.createdAt);
            await prisma.participant.update({
                where: { id: newParticipant.id },
                data: { qrCode }
            });

            // Also add to EventParticipant for the leaderboard/tracking
            await prisma.eventParticipant.create({
                data: {
                    participantId: newParticipant.id,
                    eventId: eventId
                }
            });

            // Count
            eventCounts[p.eventName] = (eventCounts[p.eventName] || 0) + 1;

        } catch (e: any) {
            if (e.code === 'P2002') {
                console.warn(`⚠️ Duplicate email skipped: ${p.email}`);
            } else {
                console.error(`❌ Error adding ${p.email}:`, e.message);
            }
        }
    }

    // 4. Log Counts
    console.log('\n📊 Seeding Summary (Participants per Event):');
    console.table(eventCounts);

    // Also total
    const total = Object.values(eventCounts).reduce((a, b) => a + b, 0);
    console.log(`\nTotal seeded: ${total}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
