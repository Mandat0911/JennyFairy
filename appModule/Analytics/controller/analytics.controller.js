export const viewAnalyticsData = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Error in viewAnalyticsData controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}