const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const getProducts = async (req, res) => {

    console.log(prisma)

    try {
        const products = await prisma.product.findMany({

        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products." });
    }
};


const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
                images: true,
                variants: true,
                reviews: true,
                cartItems: true,
                wishlistItems: true,
                orderItems: true
            }
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product." });
    }
};


const addProduct = async (req, res) => {
    const { name, description, categoryId, discountPrice } = req.body;

    if (!name || !description || !categoryId) {
        return res.status(400).json({ error: "Name, description, and categoryId are required." });
    }

    const category = await prisma.product.findUnique({
        where: {
            id: parseInt(categoryId)
        }
    })

    if (!category) {
        res.status(500).send("category not found")
    }

    try {

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                categoryId: parseInt(categoryId),
                discountPrice: parseFloat(discountPrice)
            }

        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product." });
    }
};


const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, categoryId, discountPrice } = req.body;

    try {
        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found." });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name: name ?? existingProduct.name,
                description: description ?? existingProduct.description,
                categoryId: categoryId ? parseInt(categoryId) : existingProduct.categoryId,
                discountPrice: discountPrice ? parseFloat(discountPrice) : existingProduct.discountPrice
            }
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("❌ Error updating product:", error);
        res.status(500).json({ error: "Failed to update product." });
    }
};

// ✅ Delete product

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        console.log(`Deleting product with ID: ${id}`);

        // Delete related images first (to avoid foreign key error)
        await prisma.productImage.deleteMany({
            where: { productId: parseInt(id) }
        });

        // Delete product
        const deletedProduct = await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        console.log("Deleted product:", deletedProduct);

        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("❌ Error deleting product:", error); // 👈 Log full error
        res.status(500).json({ error: "Failed to delete product." });
    }
};


// ✅ Add images to an existing product
const addProductImages = async (req, res) => {
    const productId = parseInt(req.params.productId)
    const imageUrl = req.file.filename;

    console.log(productId)

    try {
        const addImage = await prisma.productImage.create({
            data: {
                productId,
                imageUrl
            }
        })

        res.send(addImage)

    } catch (error) {
        console.error("Error adding product image:", error);
        res.status(500).send("Error")
    }
};


const deleteProductImage = async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    try {
        const deletedImage = await prisma.productImage.delete({
            where: { id: imageId }
        });
        res.status(200).json({ message: "Product image deleted successfully.", deletedImage });
    } catch (error) {
        console.error("Error deleting product image:", error);
        res.status(500).json({ error: "Failed to delete product image." });
    }
};

const updateProductImage = async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    const imageUrl = req.file?.filename || req.body.imageUrl;
    try {
        const updatedImage = await prisma.productImage.update({
            where: { id: imageId },
            data: { imageUrl }
        });
        res.status(200).json({ message: "Product image updated successfully.", updatedImage });
    } catch (error) {
        console.error("Error updating product image:", error);
        res.status(500).json({ error: "Failed to update product image." });
    }
};

// VARIANT CRUD
const addVariant = async (req, res) => {
    const { productId, color, size, price } = req.body;
    try {
        const variant = await prisma.variant.create({
            data: {
                productId: parseInt(productId),
                color,
                size,
                price: parseFloat(price)
            }
        });
        res.status(201).json(variant);
    } catch (error) {
        console.error("Error adding variant:", error);
        res.status(500).json({ error: "Failed to add variant." });
    }
};

const getVariants = async (req, res) => {
    const productId = parseInt(req.params.productId);
    try {
        const variants = await prisma.variant.findMany({
            where: { productId }
        });
        res.status(200).json(variants);
    } catch (error) {
        console.error("Error fetching variants:", error);
        res.status(500).json({ error: "Failed to fetch variants." });
    }
};

const updateVariant = async (req, res) => {
    const variantId = parseInt(req.params.variantId);
    const { color, size, price } = req.body;
    try {
        const updatedVariant = await prisma.variant.update({
            where: { id: variantId },
            data: {
                color,
                size,
                price: price ? parseFloat(price) : undefined
            }
        });
        res.status(200).json(updatedVariant);
    } catch (error) {
        console.error("Error updating variant:", error);
        res.status(500).json({ error: "Failed to update variant." });
    }
};

const deleteVariant = async (req, res) => {
    const variantId = parseInt(req.params.variantId);
    try {
        const deletedVariant = await prisma.variant.delete({
            where: { id: variantId }
        });
        res.status(200).json({ message: "Variant deleted successfully.", deletedVariant });
    } catch (error) {
        console.error("Error deleting variant:", error);
        res.status(500).json({ error: "Failed to delete variant." });
    }
};

const addProductReview = async (req, res) => {
    const { productId, userId, rating, comment, status } = req.body;
    try {
        const review = await prisma.productReview.create({
            data: {
                productId: parseInt(productId),
                userId: parseInt(userId),
                rating: parseFloat(rating),
                comment,
                status: status || "active"
            }
        });
        res.status(201).json(review);
    } catch (error) {
        console.error("Error adding product review:", error);
        res.status(500).json({ error: "Failed to add product review." });
    }
};

const getProductReviews = async (req, res) => {
    const productId = parseInt(req.params.productId);
    try {
        const reviews = await prisma.productReview.findMany({
            where: { productId }
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching product reviews:", error);
        res.status(500).json({ error: "Failed to fetch product reviews." });
    }
};

const updateProductReview = async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const { rating, comment, status } = req.body;
    try {
        const updatedReview = await prisma.productReview.update({
            where: { id: reviewId },
            data: {
                rating: rating ? parseFloat(rating) : undefined,
                comment,
                status
            }
        });
        res.status(200).json(updatedReview);
    } catch (error) {
        console.error("Error updating product review:", error);
        res.status(500).json({ error: "Failed to update product review." });
    }
};

const deleteProductReview = async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    try {
        const deletedReview = await prisma.productReview.delete({
            where: { id: reviewId }
        });
        res.status(200).json({ message: "Product review deleted successfully.", deletedReview });
    } catch (error) {
        console.error("Error deleting product review:", error);
        res.status(500).json({ error: "Failed to delete product review." });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductImages,
    deleteProductImage,
    updateProductImage,
    addVariant,
    getVariants,
    updateVariant,
    deleteVariant,
    addProductReview,
    getProductReviews,
    updateProductReview,
    deleteProductReview
};



