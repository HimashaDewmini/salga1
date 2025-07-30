const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');


const getUsers = (req, res) => {
    prisma.user.findMany()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json({ error: "An error occurred while fetching users." });
        });
};

const addUser = async (req, res) => {

    let profileUrl;

    if (req.file) {
        profileUrl = req.file.filename;
    } else {
        profileUrl = null
    }

    const { roleId, firstName, lastName, email, password, phoneNumber, status } = req.body;



    if (!roleId || !firstName || !lastName || !email || !password || !phoneNumber || !status) {
        return res.status(400).json({ error: "roleId, firstName, lastName, email, password,phoneNumber and status are required." });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                roleId: parseInt(roleId),
                firstName,
                lastName,
                email,
                password: hashedPassword,
                profileUrl,
                phoneNumber,
                status,
            }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the user." });
    }
};

// const getUserByEmailAndPhone = (req, res) => {
//     const { email, phoneNumber } = req.query;

//     if (!email || !phoneNumber) {
//         return res.status(400).json({ error: "email and phoneNumber are required." });
//     }

//     prisma.user.findFirst({
//         where: {
//             email: email,
//             phoneNumber: phoneNumber,
//         },
//         include: {
//             role: true,
//             reviews: true,
//             cartItems: true,
//             wishlistItems: true,
//             addresses: true,
//             orders: true,
//         }

//     }).then(user => {
//         if (user) {
//             res.status(200).json(user);
//         } else {
//             res.status(404).json({ error: "User not found." });
//         }
//     }).catch(error => {
//         console.error("Error fetching user:", error);
//         res.status(500).json({ error: "An error occurred while fetching the user." });
//     });
// };

const getUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            role: true,
            reviews: true,
            cartItems: true,
            wishlistItems: true,
            addresses: true,
            orders: true,
        }
    }).then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found." });
        }
    }).catch(error => {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "An error occurred while fetching the user." });
    });
};
const getUserByEmail = (req, res) => {
    const { email } = req.params;

    prisma.user.findUnique({
        where: { email: email }
    })
    .then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found." });
        }
    })
    .catch(error => {
        res.status(500).json({ error: "An error occurred while fetching the user." });
    });
};


const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    let profileUrl = req.file ? req.file.filename : req.body.profileUrl || null;
    const { roleId, firstName, lastName, email, password, phoneNumber, status } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                roleId: parseInt(roleId),
                firstName,
                lastName,
                email,
                password,
                profileUrl,
                phoneNumber,
                status,
            }
        });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "An error occurred while updating the user." });
    }
};


//UserAddressControllers
const createAddress = async (req, res) => {
    const { userId, address, city, state, zipCode, country, status } = req.body;
    try {
        const newAddress = await prisma.userAddress.create({
            data: { userId, address, city, state, zipCode, country, status },
        });
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateAddress = async (req, res) => {
    const { id } = req.params;
    const { address, city, state, zipCode, country, status } = req.body;
    try {
        const updated = await prisma.userAddress.update({
            where: { id: Number(id) },
            data: { address, city, state, zipCode, country, status },
        });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAddress = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.userAddress.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Address deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getUsers, addUser, getUserById,getUserByEmail, updateUser,createAddress,updateAddress, deleteAddress };