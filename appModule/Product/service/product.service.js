import cloudinary from "../../../backend/lib/cloudinary/cloudinary.js";
import { getCachedFeaturedProducts, getCachedRecommendedProducts, updateCachedFeaturedProducts, updateCachedRecommendedProducts, updateFeaturedProductCache } from "../../../backend/lib/redis/redis.config.js";
import { productDTO } from "../dto/product.dto.js";
import Product from "../model/product.models.js";

export const getAllProductService = async (page, limit) => {
    try {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const products = await Product.find({}).sort({createdAt: -1}).skip((pageNumber - 1) * limitNumber).limit(limitNumber);

        const totalProducts = await Product.countDocuments();
        
        return {
            products: products.map(productDTO),  // Convert orders to DTO format
            totalPages: Math.ceil(totalProducts / limitNumber),
            currentPage: pageNumber,
            totalProducts
        };
    } catch (error) {
        console.error("Error in getAllProductervice:", error.message);
        throw error; 
    }
};

export const createProductService = async (newProduct) => {
    try {
        let imageUrls = [];

        const { name, description, price, img, category, sizes, quantity } = newProduct;

        if (!img || !Array.isArray(img) || img.length === 0) {throw { status: 404, message: "No valid images provided!"}}

        if(!sizes || sizes.length === 0 || !Array.isArray(sizes)){throw { status: 404, message: "Sizes field must be an array with at least one value!"}}

        const uploadResults = await Promise.allSettled(
            img.map(async (image) => {
                try {
                    const response = await cloudinary.uploader.upload(image, {
                        folder: "products",
                        quality: "auto", 
                        fetch_format: "webp", 
                        width: 800, 
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
        const product = await Product.create({name, description, price, quantity, img: imageUrls, category, sizes});

        return productDTO(product);
    } catch (error) {
        console.error("Error in editProductService:", error.message);
        throw error; 
    }
};

export const editProductService = async (productId, newProduct) => {
    try {
        let product = await Product.findById(productId);
        let imageUrls = [];
        if(!product){throw { status: 404, message: "Product not found!"}};
        const { name, description, price, img, category, sizes, quantity } = newProduct;

        // Keep existing img if no new img prodvide
        let updatedImages = product.img;

        if(img && Array.isArray(img) && img.length > 0){
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

            if (imageUrls.length > 0) {
                updatedImages = imageUrls; // Replace with new images
            }
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.img = updatedImages
        product.category = category || product.category;
        product.sizes = sizes || product.sizes;
        product.quantity = quantity || product.quantity;

        await product.save();

        return productDTO(product);
    } catch (error) {
        console.error("Error in editProductService:", error.message);
        throw error; 
    }
};

export const deleteProductService = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if(!product){throw { status: 404, message: "Product not found!"}};
        // Store the isFeatured flag before deleting the product
        const wasFeatured = product.isFeatured;

        // If product has images, delete them from Cloudinary
        if (product.img && product.img.length > 0) {
            try {
                for (const imgUrl of product.img) {
                    const publicId = imgUrl.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                }
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }
        await product.deleteOne();

        // Refresh featured products cache if this product was featured
        if (wasFeatured) {  // Use the stored flag
            console.log("Refreshing featured products cache...");
            const newFeaturedProducts = await Product.find({ isFeatured: true }).limit(10); // Fetch new featured products
            await redis.set("featured_products", JSON.stringify(newFeaturedProducts)); // Update cache
        }
    } catch (error) {
        console.error("Error in deleteProductService:", error.message);
        throw error; 
    }
};

export const getRecommendedProductService = async () => {
    try {
        // check redis first
        const cachedProduct = await getCachedRecommendedProducts();
        if(cachedProduct){ return cachedProduct}

        const products = await Product.find().limit(3).sort({ createdAt: -1 }).select("_id name description price img");

        // convet to DTO format
        const recommendedProducts = products.map((product) => productDTO(product));

        //Store and get in redis cache
        await updateCachedRecommendedProducts(recommendedProducts);

        return recommendedProducts;
    } catch (error) {
        console.error("Error in getRecommendedProductService:", error.message);
        throw error; 
    }
};

export const getFeaturedProductService = async () => {
    try {
        // check redis first
        const cachedProduct = await getCachedFeaturedProducts();
        if(cachedProduct){return cachedProduct}

        const products = await Product.find({isFeatured: true}).lean();

        if(!products.length){throw { status: 404, message: "No featured product"}}

        // convet to DTO format
        const featuredProducts = products.map((product) => productDTO(product));

        //Store and get in redis cache
        await updateCachedFeaturedProducts(featuredProducts);
        console.log(featuredProducts)

        return featuredProducts;
    } catch (error) {
        console.error("Error in getFeaturedProductService:", error.message);
        throw error; 
    }
};

export const getProductDetailService = async (productId) => {
    try {
        const product = await Product.findById(productId);

        if(!product){throw { status: 404, message: "Product not found!"}}

        return productDTO(product);
    } catch (error) {
        console.error("Error in getProductDetailService:", error.message);
        throw error; 
    }
};

export const getProductsByCategoryService = async (category) => {
    try {
        const products = await Product.find({category});

        if(!products){throw { status: 404, message: "Product not found!"}}

        const formattedProducts = products.map((product) => productDTO(product));

        return formattedProducts;
    } catch (error) {
        console.error("Error in getProductsByCategoryService:", error.message);
        throw error; 
    }
};

export const toggleFeaturedProductService = async (productId) => {
    try {
        const product = await Product.findById(productId).lean();

        if(!product){
            throw { status: 404, message: "Product not found!"};
        } else {
            product.isFeatured = !product.isFeatured;
            await Product.findByIdAndUpdate(productId, { isFeatured: product.isFeatured });

            //  update in redis
            await updateFeaturedProductCache(product, product.isFeatured);
        }

        return { message: "Product updated successfully!" };
    } catch (error) {
        console.error("Error in toggleFeaturedProductService:", error.message);
        throw error; 
    }
};

