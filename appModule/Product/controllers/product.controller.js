import cloudinary from "../../../backend/lib/cloudinary/cloudinary.js";
import { getCachedRecommendedProducts, updateCachedRecommendedProducts, updateFeaturedProductCache } from "../../../backend/lib/redis/redis.config.js";
import { redis } from "../../../backend/lib/redis/redis.js";
import sharp from "sharp";
import fs from "fs"
import path from "path";
import {v4 as uuidv4} from "uuid"
import Product from "../model/product.models.js";

export const getAllProduct = async(req, res) => {
    try {
        const userRole = req.account?.userType;
    
        if(userRole !== "ADMIN"){
            console.log(userRole);
            return res.status(403).json({message: "Access denied - Admin only"})
        }

        const products = await Product.find({});
        res.json({products})
    } catch (error) {
        console.error("Error in getAllProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const getFeaturedProduct = async(req, res) => {
    try {
        // Check redis cache first
        let featuredProducts = await redis.get("featured_products");
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts));
        }

        // If featured products not in redis, fetch from MongoDB
        featuredProducts = await Product.find({isFeatured: true}).lean();

        if(!featuredProducts.length){
            return res.status(404).json({message: "No featured product"})
        }

        // if have featured product then store in redis for quick access
        await redis.set("feature_products", JSON.stringify(featuredProducts), "EX", 3600);

        return res.json(featuredProducts);

    } catch (error) {
        console.error("Error in getFeaturedProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, img, category } = req.body;
        let imageUrls = [];

        if (!img || !Array.isArray(img) || img.length === 0) {
            return res.status(400).json({ error: "No valid images provided!" });
        }

        const uploadResults = await Promise.allSettled(
            img.map(async (image) => {
                try {
                    const response = await cloudinary.uploader.upload(image, {
                        folder: "products",
                        quality: "auto", // Automatically adjusts compression
                        fetch_format: "webp", // Converts to optimal format (WebP, etc.)
                        width: 800, // Resize to limit large uploads
                        height: 800,
                        crop: "limit",
                    });
                    return { status: "fulfilled", url: response.secure_url };
                } catch (error) {
                    console.error("Upload error:", error.message);
                    return { status: "rejected", reason: error.message };
                }
            })
        );

        imageUrls = uploadResults
            .filter(result => result.status === "fulfilled")
            .map(result => result.value.url);

        if (imageUrls.length === 0) {
            return res.status(400).json({ error: "No images uploaded successfully!" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            img: imageUrls,
            category,
        });

        res.status(201).json(product);
        
    } catch (error) {
        console.error("Error in createProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id: productId } = req.params;
        
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }

        // Store the isFeatured flag before deleting the product
        const wasFeatured = product.isFeatured;

        // If product has images, delete them from Cloudinary
        if (product.img && product.img.length > 0) {
            try {
                for (const imgUrl of product.img) {
                    const publicId = imgUrl.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }

        // Delete product from database
        await product.deleteOne();

        // Refresh featured products cache if this product was featured
        if (wasFeatured) {  // Use the stored flag
            console.log("Refreshing featured products cache...");
            const newFeaturedProducts = await Product.find({ isFeatured: true }).limit(10); // Fetch new featured products
            await redis.set("featured_products", JSON.stringify(newFeaturedProducts)); // Update cache
        }

        res.json({ message: "Product deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteProduct controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const getRecommendedProduct = async(req, res) => {
    try {
        //Check redis cache first
        const cachedProduct = await getCachedRecommendedProducts();
        if(cachedProduct){
            return res.json(cachedProduct);
        }

        const recommendedProducts = await Product.find()
            .limit(5)
            .sort({ createdAt: -1 })
            .select("_id name description price img")

           //Store in redis cache
        await updateCachedRecommendedProducts(recommendedProducts);
        res.json({recommendedProducts});

    } catch (error) {
        console.error("Error in getRecommendedProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const getProductsByCategory = async(req, res) => {
    try {
        const {category} = req.params;

        const products = await Product.find({category});
        res.json({products});
    } catch (error) {
        console.error("Error in getProductsByCategory controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const toggleFeaturedProduct = async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);

        if  (product) {
            product.isFeatured = !product.isFeatured;
            await product.save();

            // Clear the redis cache
            await updateFeaturedProductCache();

            return res.json({message: "Product updated successfully!"});
        }
    } catch (error) {
        console.error("Error in toggleFeaturedProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}
