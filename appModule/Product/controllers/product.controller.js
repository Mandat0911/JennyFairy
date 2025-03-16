import { createProductService, deleteProductService, editProductService, getAllProductervice, getFeaturedProductService, getProductDetailService, getProductsByCategoryService, getRecommendedProductService, toggleFeaturedProductService } from "../service/product.service.js";

export const getAllProduct = async(req, res) => {
    try {
        const {page = 1, limit = 20} = req.query;
        const response = await getAllProductervice(page, limit);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getAllProduct controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const getProductDetail = async(req, res) => {
    try {
        const {id: productId} = req.params;
        const response = await getProductDetailService(productId);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getProductDetail controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const getFeaturedProducts = async(req, res) => {
    try {
        const response = await getFeaturedProductService();
        console.log(response);
        res.status(200).json(response);

    } catch (error) {
        console.error("Error in getFeaturedProduct controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const createProduct = async (req, res) => {
    try {
        const { newProduct } = req.body;

        const response = await createProductService(newProduct);
        res.status(200).json(response);
    
    } catch (error) {
        console.error("Error in createProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const editProduct = async(req, res) => {
    try {
        const {id: productId} = req.params;
        const { newProduct } = req.body;

        const response = await editProductService(productId, newProduct);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in editProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id: productId } = req.params;
        
        const response = await deleteProductService(productId);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in deleteProduct controller:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const getRecommendedProduct = async(req, res) => {
    try {
        const response = await getRecommendedProductService();

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getRecommendedProduct controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const getProductsByCategory = async(req, res) => {
    try {
        const {category} = req.params;
        const response = await getProductsByCategoryService(category);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getProductsByCategory controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const { id: productId } = req.params;
        
        const response = await toggleFeaturedProductService(productId);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in toggleFeaturedProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};
