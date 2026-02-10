
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const NEW_ADMIN = {
    email: 'newton@admin.com',
    password: 'NSTuser12345@',
    name: 'Newton Admin'
};

async function main() {
    try {
        console.log(`Adding admin: ${NEW_ADMIN.email}...`);

        // Check if exists
        const existing = await prisma.admin.findUnique({
            where: { email: NEW_ADMIN.email }
        });

        if (existing) {
            console.log('Admin already exists. Updating password...');
            const hashedPassword = await bcrypt.hash(NEW_ADMIN.password, 10);
            await prisma.admin.update({
                where: { email: NEW_ADMIN.email },
                data: { password: hashedPassword }
            });
            console.log('Admin updated.');
        } else {
            const hashedPassword = await bcrypt.hash(NEW_ADMIN.password, 10);
            await prisma.admin.create({
                data: {
                    email: NEW_ADMIN.email,
                    password: hashedPassword,
                    name: NEW_ADMIN.name
                }
            });
            console.log('Admin created.');
        }

    } catch (error) {
        console.error('Error adding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
