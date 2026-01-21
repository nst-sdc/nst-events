
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking events in DB...');
    const events = await prisma.event.findMany();
    console.log(`Found ${events.length} events:`);
    events.forEach(e => {
        console.log(`- ${e.title} at ${e.startTime} (Status: ${e.status})`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
