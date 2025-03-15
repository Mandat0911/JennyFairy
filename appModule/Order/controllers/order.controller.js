import Payment from "../../Payment/model/payment.models.js";
import Order from "../model/order.model.js"
import { deleteOrderService, getAllOrderService } from "../service/order.service.js";
export const getAllOrder = async(req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const response = await getAllOrderService(page, limit);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getAllOrder controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const editOrder = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        const { order } = req.body;

        // Ensure order exists before accessing properties
        if (!order) {
            return res.status(400).json({ error: "Order data is required." });
        }
        if (!order.shippingDetails) {
            return res.status(400).json({ error: "Shipping details are required." });
        }

        const { fullName, phone, address, city, postalCode, country, deliveryStatus } = order.shippingDetails;

        if (!fullName && !phone && !address && !city && !postalCode && !country && !deliveryStatus) {
            return res.status(400).json({ error: "At least one field must be updated." });
        }

        // Update Order shipping details
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
        });

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found." });
        }

        // Update Payment status if `paymentId` exists
        let updatedPayment = null;
        if (order.paymentId) {
            updatedPayment = await Payment.findByIdAndUpdate(order.paymentId, {
                $set: {
                    "paymentStatus": order.paymentStatus || undefined,  
                }
            }, {
                new: true,
                runValidators: true
            });

            if (!updatedPayment) {
                return res.status(404).json({ error: "Payment record not found." });
            }
        }

        res.status(200).json({
            message: "Order updated successfully",
            updatedOrder,
            updatedPayment,
        });

    } catch (error) {
        console.error("Error in editOrder controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};



export const deleteOrder = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        
        await deleteOrderService(orderId);
    
        res.status(200).json({ message: "Order deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteOrder controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

