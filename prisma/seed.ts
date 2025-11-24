import {PrismaClient} from '../lib/generated/prisma/client';
const prisma = new PrismaClient();

async function main(){
    const demoUserId = "69619b98-1dd3-4246-9aa3-eadfdfce28a8";

    await prisma.product.createMany({
        data: Array.from({length: 25}).map((_, index) => ({
            
                userId: demoUserId,
                name: `Product ${index + 1}`,
                price: (Math.random() * 90 + 10).toFixed(2),
                quantity: Math.floor(Math.random() * 20),
                lowStockAt: 5,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index * 5)),
            
        })),
    })
}

main().
catch((e) => {
    console.error(e);
    process.exit(1);
}).
    finally(async () => {
    await prisma.$disconnect();
});