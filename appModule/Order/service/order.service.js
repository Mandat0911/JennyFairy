import { orderDTO } from "../dto/order.dto.js";
import Order from "../model/order.model.js";


export const getAllOrderService = async (page = 1, limit = 10) => {
    try {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const orders = await Order.find({})
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
            .limit(limitNumber);

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


export const deleteOrderService = async (orderId) => {
    try {
        const order = await Order.findById(orderId);

		if (!order) {
            throw { status: 404, message: "Order coupons found" };
		}
        // Delete Order from database
        await order.deleteOne();
        
    } catch (error) {
        console.error("Error in deleteOrderService:", error.message);
        throw error; 
    }
};
