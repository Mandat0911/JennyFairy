import cloudinary from "../../../backend/lib/cloudinary/cloudinary.js";
import Order from "../model/order.model.js"
export const getAllOrder = async(req, res) => {
    try {
        const orders = await Order.find({});
        res.json({orders})
    } catch (error) {
        console.error("Error in getAllOrder controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}


export const editOrder = async(req, res) => {
    try {
        const { id: orderId } = req.params;
        
        const { shippingDetails } = req.body;

        if (!shippingDetails) {
            return res.status(400).json({ error: "Shipping details are required." });
        }

        const { fullName, phone, address, city, postalCode, country, deliveryStatus } = shippingDetails;

        if (!fullName && !phone && !address && !city && !postalCode && !country && !deliveryStatus) {
            return res.status(400).json({ error: "At least one field must be updated." });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            $set: {
                "shippingDetails.fullName": fullName || undefined,  
                "shippingDetails.phone": phone || undefined, 
                "shippingDetails.address": address || undefined, 
                "shippingDetails.city": city || undefined, 
                "shippingDetails.postalCode": postalCode || undefined, 
                "shippingDetails.country": country || undefined, 
                "shippingDetails.deliveryStatus": deliveryStatus || undefined, 
                }
        }, {
            new: true,
            runValidators: true
        })

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found." });
        }

        res.status(201).json(updatedOrder);

    } catch (error) {
        console.error("Error in editOrder controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}



export const deleteOrder = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found!" });
        }

        // Delete Order from database
        await order.deleteOne();

        res.json({ message: "Order deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteOrder controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

