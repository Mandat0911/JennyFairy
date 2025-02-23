import { redis } from "./redis.js";
import Product from "../../../appModule/Product/model/product.models.js";

const CACHE_EXPIRATION = 60 * 60; // 1 hour

export const getCachedRecommendedProducts = async () => {
    try {
        const cachedProductData = await redis.get("recommended_products");
        return cachedProductData ? JSON.parse(cachedProductData): null;
    } catch (error) {
        console.error("Error in getCachedRecommendedProducts: ", error.message);
        return null;
    }
};

export const updateCachedRecommendedProducts = async (products) => {
    try {
        await redis.set("recommended_products", JSON.stringify(products), "EX", CACHE_EXPIRATION);
    } catch (error) {
        console.error("Error in setCachedRecommendedProducts: ", error.message);
    }
};

export const updateFeaturedProductCache = async (product, isAdding) => {
    try {
        const cachedProducts = await redis.get("featured_products");
        let featuredProducts = cachedProducts ? JSON.parse(cachedProducts) : [];

        if (isAdding) {
            // Add product if it's not already in cache
            if (!featuredProducts.some(p => p._id === product._id.toString())) {
                featuredProducts.push(product);
            }
        } else {
            // Remove product from cache
            featuredProducts = featuredProducts.filter(p => p._id !== product._id.toString());
        }

        // Update Redis cache
        await redis.set("featured_products", JSON.stringify(featuredProducts), "EX", 3600);
    } catch (error) {
        console.error("Error in updateFeaturedProductCache: ", error.message);
    }
};