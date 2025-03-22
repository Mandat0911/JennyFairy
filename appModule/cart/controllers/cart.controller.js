import {addToCartService, getCartProductsService, removeAllItemService, removeCartItemService, updateQuantityService} from "../service/cart.service.js";

export const getCartProducts = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(await getCartProductsService(user));
    } catch (error) {
        console.error("Error in getCartProducts controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, size } = req.body;
        const user = req.user
        return res.status(200).json(await addToCartService(user, productId, quantity, size));
    } catch (error) {
        console.error("Error in addToCart controller: ", error);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { size } = req.body; 
        const user = req.user;
        return res.status(200).json(await removeCartItemService(user, productId, size));
    } catch (error) {
        console.error("Error in removeCartItem controller:", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const removeAllItem = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(await removeAllItemService(user));
    } catch (error) {
        console.error("Error in removeAllItem controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const {id: productId} = req.params;
        const {quantity, size} = req.body;
        const user = req.user;
        return res.status(200).json(await updateQuantityService(user, quantity, size, productId));
    } catch (error) {
        console.error("Error in updateQuantity controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
}

