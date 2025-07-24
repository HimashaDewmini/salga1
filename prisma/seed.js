const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.productReview.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.variant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.system.deleteMany();

    // Create system settings
    const system = await prisma.system.create({
        data: {
            name: "E-Commerce Store",
            description: "Online fashion store",
            deliveryFee: 10.00,
            taxRate: 0.15
        }
    });
    console.log(`Created system settings with id: ${system.id}`);

    // Create roles
    const roles = [
        { name: 'admin', description: 'Administrator' },
        { name: 'customer', description: 'Regular customer' }
    ];

    for (const role of roles) {
        const createdRole = await prisma.role.create({ data: role });
        console.log(`Created role with id: ${createdRole.id}`);
    }

    // Create sample users
    const users = [
        {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            profileUrl: 'https://example.com/profile/john.jpg',
            phoneNumber: '+1234567890',
            roleId: 1, // Admin role
        },
        {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            password: 'password456',
            profileUrl: 'https://example.com/profile/jane.jpg',
            phoneNumber: '+1234567891',
            roleId: 2, // Customer role
        },
        {
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob@example.com',
            password: 'password789',
            profileUrl: 'https://example.com/profile/bob.jpg',
            phoneNumber: '+1234567892',
            roleId: 2, // Customer role
        }
    ];

    // Create categories
    const categories = [
        { name: 'Men', description: 'Men\'s Fashion' },
        { name: 'Women', description: 'Women\'s Fashion' },
        { name: 'Kids', description: 'Kids\' Fashion' }
    ];

    for (const category of categories) {
        const createdCategory = await prisma.category.create({ data: category });
        console.log(`Created category with id: ${createdCategory.id}`);
    }

    // Create products with variants and images
    const products = [
        {
            name: 'Classic T-Shirt',
            description: 'Comfortable cotton t-shirt',
            categoryId: 1,
            discountPrice: 15.99,
            variants: {
                create: [
                    { color: 'Black', size: 'S', price: 19.99 },
                    { color: 'Black', size: 'M', price: 19.99 },
                    { color: 'White', size: 'S', price: 19.99 }
                ]
            },
            images: {
                create: [
                    { imageUrl: 'https://example.com/tshirt-1.jpg' },
                    { imageUrl: 'https://example.com/tshirt-2.jpg' }
                ]
            }
        },
        {
            name: 'Denim Jeans',
            description: 'Classic denim jeans',
            categoryId: 1,
            discountPrice: 45.99,
            variants: {
                create: [
                    { color: 'Blue', size: '30', price: 59.99 },
                    { color: 'Blue', size: '32', price: 59.99 },
                    { color: 'Black', size: '30', price: 59.99 }
                ]
            },
            images: {
                create: [
                    { imageUrl: 'https://example.com/jeans-1.jpg' },
                    { imageUrl: 'https://example.com/jeans-2.jpg' }
                ]
            }
        },
        {
            name: 'Summer Dress',
            description: 'Light and comfortable summer dress',
            categoryId: 2,
            discountPrice: 35.99,
            variants: {
                create: [
                    { color: 'Red', size: 'S', price: 49.99 },
                    { color: 'Blue', size: 'M', price: 49.99 },
                    { color: 'Green', size: 'L', price: 49.99 }
                ]
            },
            images: {
                create: [
                    { imageUrl: 'https://example.com/dress-1.jpg' },
                    { imageUrl: 'https://example.com/dress-2.jpg' }
                ]
            }
        }
    ];

    console.log('Start seeding...');

    // Create users with addresses
    for (const user of users) {
        const createdUser = await prisma.user.create({
            data: {
                ...user,
                addresses: {
                    create: [
                        {
                            address: '123 Main St',
                            city: 'New York',
                            state: 'NY',
                            zipCode: '10001',
                            country: 'USA'
                        }
                    ]
                }
            }
        });
        console.log(`Created user with id: ${createdUser.id}`);
    }

    // Create products with their variants and images
    for (const product of products) {
        const createdProduct = await prisma.product.create({
            data: product
        });
        console.log(`Created product with id: ${createdProduct.id}`);
    }

    // Create some reviews
    await prisma.productReview.create({
        data: {
            productId: 1,
            userId: 2,
            rating: 4.5,
            comment: "Great product, very comfortable!"
        }
    });

    // Create a cart item
    await prisma.cartItem.create({
        data: {
            cartId: 1,
            userId: 2,
            productId: 1,
            quantity: 2
        }
    });

    // Create a wishlist item
    await prisma.wishlistItem.create({
        data: {
            wishlistId: 1,
            userId: 2,
            productId: 2
        }
    });

    // Create an order with items
    await prisma.order.create({
        data: {
            userId: 2,
            status: 'pending',
            discount: 10.00,
            deliveryFee: 5.00,
            taxRate: 0.15,
            orderItems: {
                create: [
                    {
                        productId: 1,
                        quantity: 2,
                        price: 19.99
                    }
                ]
            }
        }
    });

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
