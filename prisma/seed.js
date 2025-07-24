const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Create sample users
    const users = [
        {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            profile: 'https://example.com/profile/john.jpg' // Example profile URL
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password456',
            profile: 'https://example.com/profile/jane.jpg' // Example profile URL
        },
        {
            name: 'Bob Johnson',
            email: 'bob@example.com',
            password: 'password789',
            profile: 'https://example.com/profile/bob.jpg' // Example profile URL
        },
        {
            name: 'Alice Brown',
            email: 'alice@example.com',
            password: 'passwordabc',
            profile: 'https://example.com/profile/alice.jpg' // Example profile URL
        }
    ];

    const products = [
        {
            name: 'Product 1',
            description: 'Description for Product 1',
            price: 19.99,
            image: 'https://example.com/product1.jpg',
            stock: 100,
            category: 'Category A'
        },
        {
            name: 'Product 2',
            description: 'Description for Product 2',
            price: 29.99,
            image: 'https://example.com/product2.jpg',
            stock: 50,
            category: 'Category B'
        },
        {
            name: 'Product 3',
            description: 'Description for Product 3',
            price: 39.99,
            image: 'https://example.com/product3.jpg',
            stock: 75,
            category: 'Category C'
        }
    ];

    console.log('Start seeding...');

    for (const user of users) {
        const createdUser = await prisma.user.create({
            data: user
        });
        console.log(`Created user with id: ${createdUser.id}`);
    }

    for (const product of products) {
        const createdProduct = await prisma.product.create({
            data: product
        });
        console.log(`Created product with id: ${createdProduct.id}`);
    }

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
