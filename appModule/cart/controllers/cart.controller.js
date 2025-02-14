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