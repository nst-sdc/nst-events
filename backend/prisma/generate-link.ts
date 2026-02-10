import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
    const email = 'demo@tekron.com';
    const magicToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Delete old tokens for clean start
    await prisma.magicLinkToken.deleteMany({ where: { email } });

    await prisma.magicLinkToken.create({
        data: {
            email,
            token: magicToken,
            expiresAt
        }
    });

    console.log(`LINK: nst-events://auth/callback?token=${magicToken}`);
}

main().finally(() => prisma.$disconnect());
