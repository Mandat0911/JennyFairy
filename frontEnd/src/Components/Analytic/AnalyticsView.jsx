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
		return <div>Loading...</div>;
	}

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      {/* KPI CARDS */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <AnalyticsCard title='Total Users' value={analyticsData.users.toLocaleString()} icon={Users} color='from-gray-900 to-black' />
        <AnalyticsCard title='Total Products' value={analyticsData.products.toLocaleString()} icon={Package} color='from-gray-900 to-black' />
        <AnalyticsCard title='Total Sales' value={analyticsData.totalSales.toLocaleString()} icon={ShoppingCart} color='from-gray-900 to-black' />
        <AnalyticsCard title='Total Revenue' value={`$${analyticsData.totalRevenue.toLocaleString()}`} icon={DollarSign} color='from-gray-900 to-black' />
      </div>

      {/* COMBINED CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BAR CHART */}
        <motion.div className='bg-gray-900 rounded-lg p-6 shadow-lg' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h3 className="text-white text-xl font-semibold mb-4">Sales & Revenue Comparison</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#10B981" name="Sales" />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AREA CHART */}
        <motion.div className='bg-gray-900 rounded-lg p-6 shadow-lg' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
          <h3 className="text-white text-xl font-semibold mb-4">Sales Trend Over Time</h3>
          <ResponsiveContainer width='100%' height={300}>
            <AreaChart data={dailySalesData}>
              <defs>
                <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="sales" stroke="#10B981" fill="url(#salesColor)" name="Sales" />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="url(#revenueColor)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

      </div>

    </div>
  );
}

export default AnalyticsView;

// STYLIZED ANALYTICS CARD COMPONENT
const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className={`bg-gray-900 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div>
				<p className='text-gray-400 text-sm mb-1 font-semibold'>{title}</p>
				<h3 className='text-white text-3xl font-bold'>{value}</h3>
			</div>
		</div>
		<div className='absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-30' />
		<div className='absolute -bottom-4 -right-4 text-gray-600 opacity-50'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);
