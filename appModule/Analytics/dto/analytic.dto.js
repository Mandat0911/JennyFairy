export const analyticDto = (analyticsData) => ({
    users: analyticsData?.users,
    products: analyticsData?.products,
    totalSales: analyticsData?.totalSales,
    totalRevenue: analyticsData?.totalRevenue,
});

export const dailySalesDTO  = (dailySalesData) => ({
    salesData: dailySalesData.map((data) => ({
        date: data?.date,
        sales: data?.sales,
        revenue: data?.revenue
    }))
})