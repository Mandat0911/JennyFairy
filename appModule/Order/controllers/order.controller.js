import { cancelOrderUserService, deleteOrderService, editOrderService, getAllOrderService } from "../service/order.service.js";
export const getAllOrder = async(req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        res.status(200).json(await getAllOrderService(page, limit));
    } catch (error) {
        console.error("Error in getAllOrder controller: ", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const editOrder = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        const { order } = req.body;
        res.status(200).json(await editOrderService(orderId, order));
    } catch (error) {
        console.error("Error in editOrder controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        res.status(200).json(await deleteOrderService(orderId));
    } catch (error) {
        console.error("Error in deleteOrder controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const cancelOrderUser = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        res.status(200).json(await cancelOrderUserService(orderId));
    } catch (error) {
        console.error("Error in deleteOrder controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

