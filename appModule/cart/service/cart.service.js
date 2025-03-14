import Product from "../../Product/model/product.models.js";
import User from "../../User/models/user.models.js";
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

export const addToCartService = async (user, productId, quantity, size) => {
    try {
        if (!user) {
            throw { status: 404, message: "User not found!" };
        }
        if (!size) {
            throw { status: 400, message: "Size is required!" };
        }
                
        if (!productId) {
            throw { status: 400, message: "Product ID is required!" };
        }
        // Store total Price
        const product = await Product.findById(productId);
        if (!product) {
            throw { status: 400, message: "Product not found!" };
        }
        const productPrice = product.price;
        const totalPrice = productPrice * quantity;

        const existingItem = user.cartItems.find(
            (item) => item.product._id.toString() === String(productId) && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cartItems.push({
                product: productId,
                size: size,
                quantity,
                totalPrice,
            });
        }

        await user.save();

        // Fetch and populate the updated user
        const updatedUser = await User.findById(user._id).populate({
            path: "cartItems.product",
            select: "name price image"
        });

        const updatedCartItems = updatedUser.cartItems.map((cartItem) =>
            cartProductDTO(cartItem, product._id.toString() === cartItem.product.toString() ? product : cartItem.product)
        );
        return updatedCartItems;

        
    } catch (error) {
        console.error("Error in addToCartService:", error.message);
        throw error; 
    }
};

export const removeCartItemService = async (user, productId, size) => {
    try {
        if (!user) {
            throw { status: 404, message: "User not found!" };
        }
        if (!size) {
            throw { status: 400, message: "Size is required to remove an item!" };
        }   
        if (!productId) {
            throw { status: 400, message: "Product ID is required!" };
        }
        const product = await Product.findById(productId);
        if (!product) {
            throw { status: 400, message: "Product not found!" };
        }

        // Check if the product with the matching size exists in the user's cart
        const existingItem = user.cartItems.find(
            (item) => item.product.toString() === String(productId) && item.size === size
        );

        if (!existingItem) {
            throw { status: 404, message: "Product with specified size not found in cart!" };
        }

        // Remove only the item that matches the given productId and size
        user.cartItems = user.cartItems.filter(
            (item) => !(item.product.toString() === String(productId) && item.size === size)
        );

        await user.save();

        const removeCartItems = user.cartItems.map((cartItem) =>
            cartProductDTO(cartItem, product._id.toString() === cartItem.product.toString() ? product : cartItem.product)
        );
        return removeCartItems;
    } catch (error) {
        console.error("Error in removeCartItemService:", error.message);
        throw error; 
    }
};

