import Product from "../../Product/model/product.models.js";
import { cartProductDTO } from "../dto/cart.dto.js";

export const getCartProductsService = async (user) => {
    try {
        // Find all product IDs in user's cart
        const products = await Product.find({ _id: { $in: user.cartItems.map(item => item.product)}});
        // Map cart items to DTO format
        const cartItems = user.cartItems.map((cartItem) => {
            const product = products.find((p) => p._id.toString() === cartItem.product.toString());
            return cartProductDTO(cartItem, product);
        });
        return cartItems;
    } catch (error) {
        console.error("Error in getCartProductsService:", error.message);
        throw error; 
    }
};

export const removeAllItemService = async (user) => {
    try {
        if(!user) {
            throw { status: 404, message: "User not found!" };
        }
        if(user.cartItems.length < 0) {
            throw { status: 200, message: "Cart is empty!" };
        }
        user.cartItems = [];
        await user.save();

        return [];
    } catch (error) {
        console.error("Error in removeAllItemService:", error.message);
        throw error;
    }
};

export const updateQuantityService = async (user, quantity, productId) => {
    try {
        if(!user) {
            throw { status: 404, message: "User not found!" };
        }
        if(quantity < 0) {
            throw { status: 404, message: "Quantity must be at least 0." };

        }
        if (!productId) {
            throw { status: 400, message: "Product ID is required!" };

        }
        const product = await Product.findById(productId);
        if (!product) {
            throw { status: 400, message: "Product not found!" };

        }
        const productPrice = product.price;

        const itemIndex = user.cartItems.findIndex((item) => item.product.toString() === String(productId));
        
        if (itemIndex !== -1) {
            if (quantity === 0) {
                user.cartItems.splice(itemIndex, 1);
            }else{
                user.cartItems[itemIndex].quantity = quantity;
                user.cartItems[itemIndex].totalPrice = productPrice * quantity;
            }

            await user.save();
            console.log(product)
            // Format cart items using DTO before returning
            const updatedCartItems = user.cartItems.map((cartItem) =>
                cartProductDTO(cartItem, product._id.toString() === cartItem.product.toString() ? product : cartItem.product)
            );
            return updatedCartItems;
        }else {
            throw { status: 404, message: "Product not found in cart!" };
        }
    } catch (error) {
        console.error("Error in updateQuantityService:", error.message);
        throw error;
    }
};


