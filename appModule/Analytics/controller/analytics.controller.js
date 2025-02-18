import { getAnalyticData, getDailySalesData } from "../service/analytic.service.js";

export const viewAnalyticsData = async (req, res) => {
    try {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        let analyticsData = {};
        let dailySalesData = [];

        try {
            analyticsData = await getAnalyticData();
        } catch (error) {
            console.error("Error fetching analytics data:", error.message);
        }

        try {
            dailySalesData = await getDailySalesData(startDate, endDate);
        } catch (error) {
            console.error("Error fetching daily sales data:", error.message);
        }

        res.json({
            status: "success",
            analyticsData,
            dailySalesData,
        });

    } catch (error) {
        console.error("Error in viewAnalyticsData controller:", error.message);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error!",
        });
    }
};
