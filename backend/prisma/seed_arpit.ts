import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker/locale/en_IN';

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
    console.log('🌱 Starting seed for specific user...');

    const email = 'arpit@gmail.com';
    const passwordRaw = 'Arpit123@';
    const passwordHash = await bcrypt.hash(passwordRaw, 10);
    const name = 'Arpit';

    // Check if user exists
    const existingUser = await prisma.participant.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`⚠️ User ${email} already exists. Updating password and ensuring approved=false...`);
        await prisma.participant.update({
            where: { email },
            data: {
                password: passwordHash,
                approved: false, // Ensure unapproved as requested
                // Not modifying name or other fields to preserve potential existing data if any, 
                // but requirements say "create a user... and seed this data", 
                // so upsert is safer.
            },
        });
        console.log(`✅ Updated existing user: ${email}`);
    } else {
        const id = faker.string.uuid();
        await prisma.participant.create({
            data: {
                id,
                email,
                name,
                password: passwordHash,
                approved: false, // "without approve"
                qrCode: generateQRCodeString(id, new Date()),
                xp: 0,
                level: 1,
            },
        });
        console.log(`✅ Created new user: ${email}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
