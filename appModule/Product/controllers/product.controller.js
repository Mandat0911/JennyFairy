import { createProductService, deleteProductService, editProductService, getAllProductService, getFeaturedProductService, getProductDetailService, getProductsByCategoryService, getRecommendedProductService, toggleFeaturedProductService } from "../service/product.service.js";

export const getAllProduct = async(req, res) => {
    try {
        const {page = 1, limit = 20} = req.query;
        res.status(200).json(await getAllProductService(page, limit));
    } catch (error) {
        console.error("Error in getAllProduct controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const getProductDetail = async(req, res) => {
    try {
        const {id: productId} = req.params;
        res.status(200).json(await getProductDetailService(productId));
    } catch (error) {
        console.error("Error in getProductDetail controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const getFeaturedProducts = async(req, res) => {
    try {
        console.log(await getFeaturedProductService());
        res.status(200).json(response);

    } catch (error) {
        console.error("Error in getFeaturedProduct controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const createProduct = async (req, res) => {
    try {
        const { newProduct } = req.body;
        res.status(200).json( await createProductService(newProduct));
    } catch (error) {
        console.error("Error in createProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const editProduct = async(req, res) => {
    try {
        const {id: productId} = req.params;
        const { newProduct } = req.body;
        res.status(200).json(await editProductService(productId, newProduct));
    } catch (error) {
        console.error("Error in editProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id: productId } = req.params;
        res.status(200).json(await deleteProductService(productId));
    } catch (error) {
        console.error("Error in deleteProduct controller:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const getRecommendedProduct = async(req, res) => {
    try {
        res.status(200).json(await getRecommendedProductService());
    } catch (error) {
        console.error("Error in getRecommendedProduct controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const getProductsByCategory = async(req, res) => {
    try {
        const {category} = req.params;
        res.status(200).json(await getProductsByCategoryService(category));
    } catch (error) {
        console.error("Error in getProductsByCategory controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const { id: productId } = req.params;
        res.status(200).json(await toggleFeaturedProductService(productId));
    } catch (error) {
        console.error("Error in toggleFeaturedProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};
