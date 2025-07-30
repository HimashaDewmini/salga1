const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // Create Roles
  const adminRole = await prisma.role.create({
    data: { name: 'Admin', description: 'Administrator' }
  });
  const userRole = await prisma.role.create({
    data: { name: 'User', description: 'Regular user' }
  });

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      roleId: adminRole.id,
      status: 'active'
    }
  });

  // Create Categories
  const category = await prisma.category.create({
    data: { name: 'Electronics', description: 'Electronic items' }
  });

  // Create Products
  const product = await prisma.product.create({
    data: {
      name: 'Smartphone',
      description: 'Latest smartphone',
      categoryId: category.id
    }
  });

  // Create Product Image
  await prisma.productImage.create({
    data: {
      productId: product.id,
      imageUrl: 'https://example.com/image.jpg'
    }
  });

  // Create Variant
  await prisma.variant.create({
    data: {
      productId: product.id,
      color: 'Black',
      size: '128GB',
      price: 699.99
    }
  });

  // Create Product Review
  await prisma.productReview.create({
    data: {
      productId: product.id,
      userId: user1.id,
      rating: 4.5,
      comment: 'Great phone!'
    }
  });

  // Create User Address
  await prisma.userAddress.create({
    data: {
      userId: user1.id,
      address: '123 Main St',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  });

  // Create Cart Item
  await prisma.cartItem.create({
    data: {
      cartId: 1,
      userId: user1.id,
      productId: product.id,
      quantity: 2
    }
  });

  // Create Wishlist Item
  await prisma.wishlistItem.create({
    data: {
      wishlistId: 1,
      userId: user1.id,
      productId: product.id
    }
  });

  // Create Order
  const order = await prisma.order.create({
    data: {
      userId: user1.id,
      status: 'pending'
    }
  });

  // Create Order Item
  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: product.id,
      quantity: 1,
      price: 699.99
    }
  });

  // Create System
  await prisma.system.create({
    data: {
      name: 'Main System',
      description: 'Primary system',
      deliveryFee: 10.0,
      taxRate: 0.08
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });