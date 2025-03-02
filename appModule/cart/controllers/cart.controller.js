import Product from "../../Product/model/product.models.js";
import User from "../../User/models/user.models.js";
export const getCartProducts = async (req, res) => {
    try {
        const user = req.user;

        // Find all product IDs in user's cart
        const products = await Product.find({ _id: { $in: user.cartItems.map((item) => item.product) } });

        // Create a cart summary grouped by cartItemId
        const cartItems = user.cartItems.map((cartItem) => {
            // Find the matching product details
            const product = products.find((p) => p._id.toString() === cartItem.product.toString());

            return {
                cartItemId: cartItem._id,  // Unique cart item ID (useful for deletion)
                productId: product._id,
                name: product.name,
                img: product.img,
                price: product.price,
                size: cartItem.size, // Ensure different sizes appear separately
                quantity: cartItem.quantity, // Keep track of quantity
                totalPrice: cartItem.totalPrice, // Include total price
            };
        });

        res.json(cartItems);
    } catch (error) {
        console.error("Error in getCartProducts controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};


export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, size } = req.body;
        const user = req.user
        // const user = await User.findById(req.user._id).populate('cartItems.product');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!size) {
                    return res.status(400).json({ error: "Size is required!" });
                }
                
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required!" });
        }

        // Store total Price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ error: "Product not found!" });
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

        res.status(200).json({
            message: "Product added to cart successfully!",
            cartItems: updatedUser.cartItems,
        });

    } catch (error) {
        console.error("Error in addToCart controller: ", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { id: productId } = req.params; // Get productId from request parameters
        const { size } = req.body; // Get size from request body
        const user = req.user;

        if (!size) {
            return res.status(400).json({ error: "Size is required to remove an item!" });
        }

        // Check if the product with the matching size exists in the user's cart
        const existingItem = user.cartItems.find(
            (item) => item.product.toString() === String(productId) && item.size === size
        );

        if (!existingItem) {
            return res.status(404).json({ error: "Product with specified size not found in cart!" });
        }

        // Remove only the item that matches the given productId and size
        user.cartItems = user.cartItems.filter(
            (item) => !(item.product.toString() === String(productId) && item.size === size)
        );

        await user.save();
        return res.json({ success: true, cartItems: user.cartItems });
    } catch (error) {
        console.error("Error in removeCartItem controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};


export const removeAllItem = async (req, res) => {
    try {
        const user = req.user;

        if(!user) {
            return res.status(404).json({ error: "User not found !" });
        }

        if(user.cartItems.length < 0) {
            return res.status(200).json({message: "Cart is empty!"});
        }

        user.cartItems = [];
        await user.save();

        return res.json({success: true, cartItems: []});
        
    } catch (error) {
        console.error("Error in removeAllItem controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const {id: productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;

        // Validate quantity must be positive
        if(quantity < 0) {
            return res.status(404).json({error: "Quantity must be at least 0."});
        }

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required!" });
        }

        // Store total Price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ error: "Product not found!" });
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
            return res.json(user.cartItems);
        }
    } catch (error) {
        console.error("Error in updateQuantity controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

