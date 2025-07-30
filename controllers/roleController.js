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

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await prisma.role.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        users: true
      }
    });
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: role,
      message: 'Role retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving role',
      error: error.message
    });
  }
};

// Create new role
const createRole = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      });
    }
    
    // Check if role with same name already exists
    const existingRole = await prisma.role.findUnique({
      where: { name }
    });
    
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }
    
    const newRole = await prisma.role.create({
      data: {
        name,
        description,
        status: status || 'active'
      }
    });
    
    res.status(201).json({
      success: true,
      data: newRole,
      message: 'Role created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole
};