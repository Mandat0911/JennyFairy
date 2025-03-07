import React, { useState } from 'react'
import { useGetAllOrder } from '../../Store/API/Order.API.js';
import { motion } from 'framer-motion';
import { Trash, Star, Edit, Loader, X } from "lucide-react";

const OrderList = () => {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    
    const { data: orders } = useGetAllOrder(currentPage, limit);
    const totalPages = orders?.totalPages || 1;
    console.log(orders)
  return (
  <motion.div
            className="bg-white shadow-xl rounded-lg overflow-hidden max-w-5xl mx-auto p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="overflow-x-auto">
            <select
                    value={limit}
                    onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1); }}
                    className="border px-2 py-1 rounded-md text-sm"
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment method</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Delivery Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders?.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition duration-200">
                                <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                                    {/* <img className="h-12 w-12 rounded-lg object-cover" src={order.img[0]} alt={order.name} /> */}
                                    <span className="text-sm font-medium text-gray-900">{order.name}</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
                                    </span>
                                </td>
                                
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.quantity ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                        {order.quantity ? "In Stock" : "Out of Stock"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.quantity ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                        {order.quantity ? "In Stock" : "Out of Stock"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <button
                                        // onClick={() => toggleFeaturedProduct.mutate(product._id)}
                                        // className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition duration-200 ${
                                        //     product.isFeatured ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                        // }`}
                                    >
                                        <Star className="h-4 w-4" />
                                        {/* {product.isFeatured ? "Featured" : "Set Featured"} */}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        // onClick={() => {
                                        //     setDeletingProductId(product._id);
                                        //     deleteMutation(product._id, {
                                        //         onSettled: () => setDeletingProductId(null),
                                        //     });
                                        // }}
                                        className="text-red-500 hover:text-red-400"
                                        // disabled={deletingProductId === product._id}
                                    >
                                        {/* {deletingProductId === product._id ? (
                                            <Loader className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <Trash className="h-5 w-5" />
                                        )} */}
                                    </button>
                                    <button
                                        // onClick={() => setEditProductData(product)}
                                        className="text-green-400 hover:text-green-300 px-2"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {/* Pagination Controls */}
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
            
        </motion.div>
    );
}

export default OrderList