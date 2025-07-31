const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Order Controllers
const getOrders = (req, res) => {
    prisma.order.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            },
            orderItems: {
                include: {
                    product: {
                        include: {
                            images: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    .then(orders => {
        res.status(200).json(orders);
    })
    .catch(error => {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "An error occurred while fetching orders." });
    });
};


const createOrder = async (req, res) => {
  const { userId, discount, deliveryFee, taxRate, status, orderItems } = req.body;

  if (!userId || !status || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ 
      error: "userId, status, and orderItems (array) are required." 
    });
  }

  // Validate orderItems structure
  for (const item of orderItems) {
    if (!item.productId || !item.quantity || !item.price) {
      return res.status(400).json({ 
        error: "Each order item must have productId, quantity, and price." 
      });
    }
  }

  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    // Fetch active user address
    const userAddress = await prisma.userAddress.findFirst({
      where: {
        userId: parseInt(userId),
        status: "active"
      }
    });

    if (!userAddress) {
      return res.status(404).json({ error: "Active user address not found." });
    }

    // Check if all products exist
    const productIds = orderItems.map(item => parseInt(item.productId));
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      select: {
        id: true
      }
    });

    const existingProductIds = existingProducts.map(p => p.id);
    const missingProductIds = productIds.filter(id => !existingProductIds.includes(id));

    if (missingProductIds.length > 0) {
      return res.status(404).json({ 
        error: `Products not found with IDs: ${missingProductIds.join(', ')}` 
      });
    }

    // Create order with order items in a transaction
    const order = await prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.order.create({
        data: {
          userId: parseInt(userId),
          discount: discount ? parseFloat(discount) : null,
          deliveryFee: deliveryFee ? parseFloat(deliveryFee) : null,
          taxRate: taxRate ? parseFloat(taxRate) : null,
          status
        }
      });

      // Create order items
      const orderItemsData = orderItems.map(item => ({
        orderId: newOrder.id,
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      }));

      await prisma.orderItem.createMany({
        data: orderItemsData
      });

      // Return order with user and address info + order items with product images
      return await prisma.order.findUnique({
        where: { id: newOrder.id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              addresses: {
                where: { status: "active" }, // Only active address
                select: {
                  id: true,
                  address: true,
                  city: true,
                  state: true,
                  zipCode: true,
                  country: true
                }
              }
            }
          },
          orderItems: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      });
    });

    res.status(201).json(order);

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "An error occurred while creating the order." });
  }
};


const getOrderById = (req, res) => {
  const orderId = parseInt(req.params.id);

  prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true
        }
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              discountPrice: true,
              images: {
                select: {
                  imageUrl: true
                }
              },
              variants: {
                select: {
                  color: true,
                  size: true,
                  price: true
                }
              }
            }
          }
        }
      }
    }
  })
  .then(order => {
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: "Order not found." });
    }
  })
  .catch(error => {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "An error occurred while fetching the order." });
  });
};
const updateOrder = async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { orderItems } = req.body;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({
      error: "orderItems (non-empty array) is required.",
    });
  }

  // Validate each order item
  for (const item of orderItems) {
    if (!item.productId || !item.quantity || !item.size || !item.color) {
      return res.status(400).json({
        error: "Each order item must include productId, quantity, size, and color.",
      });
    }
  }

  try {
    // Check if order exists
    const orderExists = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!orderExists) {
      return res.status(404).json({ error: "Order not found." });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Delete existing order items
      await tx.orderItem.deleteMany({
        where: { orderId },
      });

      // Recreate order items without allowing price updates
      const newItems = orderItems.map((item) => ({
        orderId,
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        size: item.size,
        color: item.color,
      }));

      await tx.orderItem.createMany({
        data: newItems,
      });

      // Return updated order with product details
      return await tx.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  discountPrice: true,
                  variants: {
                    select: {
                      color: true,
                      size: true,
                      price: true,
                    },
                  },
                  images: {
                    select: {
                      imageUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order items:", error);
    res.status(500).json({ error: "An error occurred while updating the order items." });
  }
};



module.exports = {
    getOrders,
    createOrder,
    getOrderById,
    updateOrder
};