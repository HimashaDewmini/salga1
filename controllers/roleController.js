const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        users: true, // Include related users if needed
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: roles,
      message: 'Roles retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving roles',
      error: error.message
    });
  }
};
module.exports = {
  getAllRoles
};