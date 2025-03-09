import Order from "../model/order.model.js"
export const getAllOrder = async(req, res) => {
    try {
        const { page = 1, limit = 10,  searchTerm = "" } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        
        const orders = await Order.find({}).populate(
            {
                path: "paymentId",
                select: "paymentMethod paymentStatus"
            })
            .populate({
                path: "user",
                select: "name email"
            })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

            const totalOrders = await Order.countDocuments();

        res.status(200).json({orders,
            totalPages: Math.ceil(totalOrders / limitNumber),
            currentPage: pageNumber,
            totalOrders
        })
    } catch (error) {
        console.error("Error in getAllOrder controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}


export const editOrder = async(req, res) => {
    try {
        const { id: orderId } = req.params;
        
        const { order } = req.body;

        if (!order.shippingDetails) {
            return res.status(400).json({ error: "Shipping details are required." });
        }

        const { fullName, phone, address, city, postalCode, country, deliveryStatus } = order.shippingDetails;

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

