const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();


const getProducts = (req, res) => {
    prisma.product.findMany()
        .then(products => {
            res.status(200).json(products);
        })
        .catch(error => {
            res.status(500).json({ error: "An error occurred while fetching products." });
        });
};

const addProducts = async (req, res) => {
    const { name, description, price, stock } = req.body;
    const file = req.file;

    if (!name || !description || !price || !stock) {
        return res.status(400).json({ error: "name,description, price, and stock are required." });
    }

    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
            }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "An error occurred while creating the product." });
    }
};

const getProductById = (req, res) => {
    const productId = parseInt(req.params.id);
    prisma.product.findUnique({
        where: {
            id: productId,
        },
        include: {
            productReviews: true,
            productOrders: true,
            productImages: true,
            productCategory: true,

        }
    }).then(product => {
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: "Product not found." });
        }
    }).catch(error => {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "An error occurred while fetching the product." });
    });

}


module.exports = { getProducts, addProducts, getProductById };




