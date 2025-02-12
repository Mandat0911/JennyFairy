import cloudinary from "../../../backend/lib/cloudinary/cloudinary.js";
import { redis } from "../../../backend/lib/redis/redis.js";
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

export const createProduct = async(req, res) => {
    try {
        const {name, description, price, img, category} = req.body;

        let cloudinaryResponse = null;

        if(img) {
            cloudinaryResponse = await cloudinary.uploader.upload(img, {folder: "products"});
        }

        const product = await Product.create({
            name,
            description,
            price, 
            img: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        })

        res.status(201).json(product);
        
    } catch (error) {
        console.error("Error in createProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const deleteProduct = async(req, res) => {
    try {
        const productId = req.params;

        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({message: "Product not found!"});
        }

        if(product.img){
            const publicId = product.img.split("/").pop().split(".")[0];
            try{
                await cloudinary.uploader.destroy(`product/${publicId}`);

            }catch(error){
                console.log("Error deleting image from cloudinary", error);
            }
        }

        await Product.findByIdAndDelete(productId);

        res.json({message: "Product deleted successfully!"});
    } catch (error) {
        console.error("Error in deleteProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}
