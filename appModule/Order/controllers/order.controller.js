import { deleteOrderService, editOrderService, getAllOrderService } from "../service/order.service.js";
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
        const response = await editOrderService(orderId, order);
        res.status(200).json(response);

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

