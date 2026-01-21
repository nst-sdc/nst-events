
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Approving all participants...');
    const result = await prisma.participant.updateMany({
        data: {
            approved: true
        }
    });
    console.log(`✅ Approved ${result.count} participants.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
