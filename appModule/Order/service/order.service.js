import Payment from "../../Payment/model/payment.models.js";
import { orderDTO } from "../dto/order.dto.js";
import Order from "../model/order.model.js";

export const getAllOrderService = async (page = 1, limit = 10) => {
    try {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const orders = await Order.find({})
            .sort({createdAt: -1})
            .populate({
                path: "paymentId",
                select: "paymentMethod paymentStatus couponCode couponDiscountPercentage"
            })
            .populate({
                path: "user",
                select: "name email"
            })
            .populate({
                path: "products.product",
                select: "name"
            })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)

        const totalOrders = await Order.countDocuments();
        return {
            orders: orders.map(orderDTO),  // Convert orders to DTO format
            totalPages: Math.ceil(totalOrders / limitNumber),
            currentPage: pageNumber,
            totalOrders
        };
    } catch (error) {
        console.error("Error in getAllOrderService:", error.message);
        throw error; 
    }
};


export const editOrderService = async (orderId, order) => {
    try {

		if (!order || !order.shippingDetails) {
            throw { status: 404, message: "Shipping details are required." };
		}

        const { fullName, phone, address, city, postalCode, country, deliveryStatus } = order.shippingDetails;

        if (!fullName && !phone && !address && !city && !postalCode && !country && !deliveryStatus) {
            throw { status: 400, message: "At least one field must be updated." };
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
        }).populate("user paymentId products.product");

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
            })

            if (!updatedPayment) {
                throw { status: 404, message: "Payment record not found.." };
            }
        }

        return {
            updatedOrder: orderDTO(updatedOrder),
            updatedPayment
        }
        
    } catch (error) {
        console.error("Error in deleteOrderService:", error.message);
        throw error; 
    }
};

export const deleteOrderService = async (orderId) => {
    try {
        const order = await Order.findById(orderId);

		if (!order) {
            throw { status: 404, message: "Order not found" };
		}
        // Delete Order from database
        await order.deleteOne();
        
    } catch (error) {
        console.error("Error in deleteOrderService:", error.message);
        throw error; 
    }
};
