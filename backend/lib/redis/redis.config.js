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

export const updateFeaturedProductCache = async () => {
    try {
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        if(!featuredProducts.length){
            return;
        }
        await redis.set("featured_products", JSON.stringify(featuredProducts), "EX", 3600);
    } catch (error) {
        console.error("Error in updateFeaturedProductCache controller: ", error.message);
    }
};
