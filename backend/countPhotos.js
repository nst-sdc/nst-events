const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://neondb_owner:npg_PUF9Yi4aqLIC@127.0.0.1:5433/neondb?sslmode=disable'
        }
    }
});

async function main() {
    try {
        const first = await prisma.photo.findFirst();
        if (first && first.url) {
            console.log('URL Prefix:', first.url.substring(0, 50));
            console.log('URL Length:', first.url.length);
        } else {
            console.log('No URL found');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
