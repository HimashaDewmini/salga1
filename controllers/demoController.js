const { PrismaClient } = require('../generated/prisma'); // Adjust the path as necessary
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

}

const getUserById = (req, res) => {
    const userId = parseInt(req.params.id);

    prisma.user.findUnique({
        where: { 
            id: userId,
        },
        include: {
            userOrders: true, // Include related orders if needed
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

const addUser = async (req, res) => {
    const { name, email, password } = req.body;
    const file = req.file;

    let profile = ''; 

    if (file) {
        profile = '/uploads/' + file.filename;
    }

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
    }

    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            profile
        }
    }).then(user => {
        res.status(201).json(user);
    }).catch(error => {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "An error occurred while creating the user." });
    });
};




module.exports = { getUsers, getUserById, addUser }