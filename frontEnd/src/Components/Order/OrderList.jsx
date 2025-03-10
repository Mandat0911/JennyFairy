import React, { useState } from 'react'
import { useDeleteOrder, useGetAllOrder } from '../../Store/API/Order.API.js';
import { motion } from 'framer-motion';
import { Trash, Edit, Loader, X } from "lucide-react";
import EditOrderForm from './EditOrderForm.jsx';

const OrderList = () => {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [editOrderData, setEditOrderData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
 
    const [limit, setLimit] = useState(10);
    const { data } = useGetAllOrder(currentPage, limit);
    const orders = data?.orders || [];
    const totalPages = data?.totalPages || 1;
    console.log(orders);
    const { mutate: deleteOrder } = useDeleteOrder();
    const [deletingOrderId, setDeletingOrderId] = useState(null);
    
    
    const filteredOrders = orders.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.totalAmount.toString().includes(searchTerm) ||
        order.paymentId.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingDetails.deliveryStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentId.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
  <motion.div
            className="bg-white shadow-xl rounded-lg overflow-hidden max-w-5xl mx-auto p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="justify-between items-center mb-4 ">
            <input
                        type="text"
                        placeholder="Search product name..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setLimit(20);
                        }}
                        className="border px-2 py-1 rounded-md text-sm w-1/3"
                        />

            <select
                    value={limit}
                    onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1); }}
                    className="border mb-4 px-2 py-1 rounded-md text-sm"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order id</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Delivery Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment method</th>
                            
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.length > 0 ? (
                        filteredOrders?.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition duration-200">
                                <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-900">{order._id}</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
                                    </span>
                                </td>
                                
                                <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                                        ${order.paymentId.paymentStatus === "pending" ? "bg-yellow-500 text-white" : 
                                        order.paymentId.paymentStatus === "completed" ? "bg-green-500 text-white" : 
                                        order.paymentId.paymentStatus === "failed" ? "bg-red-500 text-white" : 
                                        "bg-gray-500 text-white"}`}
                                >
                                    {order.paymentId.paymentStatus}
                                </span>
                                </td>
                                
                                <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                                        ${order.shippingDetails.deliveryStatus === "pending" ? "bg-yellow-500 text-white" : 
                                        order.shippingDetails.deliveryStatus === "delivered" ? "bg-green-500 text-white" : 
                                        order.shippingDetails.deliveryStatus === "canceled" ? "bg-gray-500 text-white" : 
                                        order.shippingDetails.deliveryStatus === "shipped" ? "bg-blue-500 text-white" : 
                                        "bg-gray-500 text-white"}`}
                                >
                                    {order.shippingDetails.deliveryStatus}
                                </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                                        ${order.paymentId.paymentMethod === "QR code" ? "bg-cyan-500 text-white" : 
                                        order.paymentId.paymentMethod === "Stripe" ? "bg-blue-500 text-white" : 
                                        order.paymentId.paymentMethod === "Cash on Delivery" ? "bg-red-500 text-white" : 
                                        "bg-gray-500 text-white"}`}
                                >
                                    {order.paymentId.paymentMethod}
                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setDeletingOrderId(order._id);
                                            deleteOrder(order._id, {
                                                onSettled: () => setDeletingOrderId(null),
                                            });
                                        }}
                                        className="text-red-500 hover:text-red-400"
                                        disabled={deletingOrderId === order._id}
                                    >
                                        {deletingOrderId === order._id ? (
                                            <Loader className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <Trash className="h-5 w-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setEditOrderData(order)}
                                        className="text-green-400 hover:text-green-300 px-2"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                                No orders found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                    Previous
                </button>
                <span className="text-sm font-semibold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                    Next
                </button>
            </div>
            {editOrderData && (
                <div
                    className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50"
                    onClick={() => setEditOrderData(null)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setEditOrderData(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <EditOrderForm initialOrder={editOrderData} />
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default OrderList