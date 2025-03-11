import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { useGetAnalytic } from '../../Store/API/Analytic.API.js';

const AnalyticsView = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);
  const { data: analyticData } = useGetAnalytic();

  useEffect(() => {
    if (analyticData) {
      setAnalyticsData(analyticData.analyticsData);
      setDailySalesData(analyticData.dailySalesData);
      setIsLoading(false);
    }
  }, [analyticData]);

  if (isLoading) {
    return <div className="text-center text-gray-500 text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <AnalyticsCard title="Total Users" value={analyticsData.users.toLocaleString()} icon={Users} />
        <AnalyticsCard title="Total Products" value={analyticsData.products.toLocaleString()} icon={Package} />
        <AnalyticsCard title="Total Sales" value={analyticsData.totalSales.toLocaleString()} icon={ShoppingCart} />
        <AnalyticsCard title="Total Revenue" value={`$${analyticsData.totalRevenue.toLocaleString()}`} icon={DollarSign} />
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* BAR CHART */}
        <motion.div className="bg-black rounded-xl p-6 shadow-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h3 className="text-white text-2xl font-semibold mb-4">Sales & Revenue</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis yAxisId="left" stroke="#fff" />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", borderRadius: "8px" }} />
              <Legend />

              <Bar yAxisId="right" dataKey="sales" fill="#10B981" name="Sales" />
              <Bar yAxisId="left" dataKey="revenue" fill="#fff" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AREA CHART */}
        <motion.div className="bg-black rounded-xl p-6 shadow-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
          <h3 className="text-white text-2xl font-semibold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={dailySalesData}>
              <defs>
                <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis yAxisId="left" stroke="#fff" />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" />

              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", borderRadius: "8px" }} />
              <Legend />

              <Area yAxisId="right" type="monotone" dataKey="sales" stroke="#10B981" fill="url(#salesColor)" name="Sales" />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#ffffff" fill="url(#revenueColor)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsView;

// 🖤 **ANALYTICS CARD COMPONENT**
const AnalyticsCard = ({ title, value, icon: Icon }) => (
  <motion.div
    className="bg-black text-white rounded-xl p-6 shadow-lg flex items-center justify-between transition-transform duration-300 hover:scale-105"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <h3 className="text-white text-3xl font-bold">{value}</h3>
    </div>
    <Icon className="text-gray-500 h-10 w-10" />
  </motion.div>
);
