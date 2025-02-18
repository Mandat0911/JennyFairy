import Order from "../../Order/model/order.model.js";
import Product from "../../Product/model/product.models.js";
import User from "../../User/models/user.models.js"

export const getAnalyticData = async () => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        
    ])
}