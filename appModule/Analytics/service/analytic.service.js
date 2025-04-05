import Order from "../../Order/model/order.model.js";
import Product from "../../Product/model/product.models.js";
import User from "../../User/models/user.models.js";

export const getAnalyticDataService = async () => {
    try {
        const totalUsers = await User.countDocuments(),
              totalProducts = await Product.countDocuments(),
              salesData = await Order.aggregate([{ $group: { _id: null, totalSales: { $sum: 1 }, totalRevenue: { $sum: "$totalAmount" } } }]),
              { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

        return { users: totalUsers, products: totalProducts, totalSales, totalRevenue };
    } catch (error) {
        console.error("Error in getAnalyticDataService:", error.message);
        throw new Error("Internal Server Error!");
    }
};


export const getDailySalesDataService = async (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      //Add 1 day to include the "next" day in result
      const adjustedEnd = new Date(end);
      adjustedEnd.setDate(adjustedEnd.getDate() + 1);
      adjustedEnd.setHours(0, 0, 0, 0); // Optional: set to midnight
  
      const dailySalesData = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lt: adjustedEnd, // Use $lt for exclusive upper bound (next day start)
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            sales: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      // Also include the extended end date in range
      const rangeEnd = new Date(endDate);
      rangeEnd.setDate(rangeEnd.getDate() + 1);
  
      return getDatesInRange(startDate, rangeEnd.toISOString().split("T")[0]).map(date => {
        const foundData = dailySalesData.find(item => item._id === date);
        return { date, sales: foundData?.sales || 0, revenue: foundData?.revenue || 0 };
      });
    } catch (error) {
      console.error("Error in getDailySalesDataService:", error.message);
      throw new Error("Internal Server Error!");
    }
  };
  

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dates.push(currentDate.toISOString().split("T")[0]); 
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}
