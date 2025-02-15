import Product from "../../Product/model/product.models.js";

export const getCartProducts = async(req, res) => {

    try {
        const user = req.user;
        // Find all product id match user's cartItems array
        const products = await Product.find({ _id: { $in: req.user.cartItems.map((item)  => item.product) } });
        console.log({"products: ": products});

        // Add quantity for each product
        const cartItems = products.map((product) => {
            // Find the product in cartItems that matches the current product
            const item = req.user.cartItems.find((cartItem) => cartItem.product.toString() === product.id.toString());

            //Return the product details along with its quantity
            return {...product.toJSON(), quantity: item.quantity};
        });

        res.json({cartItems})
    } catch (error) {
        console.error("Error in getCartProducts controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const addToCart = async(req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
        console.log(existingItem) 
        if(existingItem) {
            existingItem.quantity += 1;
        }else{
            user.cartItems.push({ 
            product: productId, // Push product as an ObjectId
        });
        }

        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.error("Error in addToCart controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const removeCartItem = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;

        // Find the index pf the product in the cart
        const itemIndex = user.cartItems.findIndex((item) => item.product.toString() === productId);
        console.log(itemIndex)

        if (itemIndex !== -1) {
            if(user.cartItems[itemIndex].quantity > 1){
                user.cartItems[itemIndex].quantity -= 1;
            }else{
                user.cartItems.splice(itemIndex, 1);
            }

            await user.save();
            return res.json({success: true, cartItems: user.cartItems});
        }else{
            return res.status(404).json({error: "Item not found in cart!"})
        }
    } catch (error) {
        console.error("Error in removeCartItem controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const removeAllItem = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;

        // Find the index pf the product in the cart
        const itemIndex = user.cartItems.findIndex((item) => item.product.toString() === productId);
        console.log(itemIndex)

        if (itemIndex !== -1) {
            user.cartItems.splice(itemIndex, 1);
            await user.save();
            return res.json({success: true, message: "Product removed from cart!", cartItems: user.cartItems});
        }

        return res.status(404).json({error: "Item not found in cart!"})
        
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

        const itemIndex = user.cartItems.findIndex((item) => item.product.toString === productId);
        if (itemIndex !== -1) {
            if (quantity === 0) {
                user.cartItems.splice(itemIndex, 1);
            }else{
                user.cartItems[itemIndex].quantity = quantity;
            }
            await user.save();
            return res.json(user.cartItems);
        }
    } catch (error) {
        console.error("Error in updateQuantity controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

