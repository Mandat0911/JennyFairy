import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash, Loader, } from "lucide-react";
import { useDeleteCoupon, useGetAllCoupon } from '../../Store/API/Coupon.API.js';
import { formatDate } from '../../Utils/Date.js';

const CouponList = () => {
    const {data: allCoupons} = useGetAllCoupon();
    const {mutate: deleteCoupon} = useDeleteCoupon();
    const [deletingCouponId, setDeletingCouponId] = useState(null);
    
  return (
<motion.div
            className="bg-white shadow-xl rounded-lg overflow-hidden max-w-5xl mx-auto p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Code</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Discount%</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Create Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expire Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {allCoupons?.length > 0 ? (
                            allCoupons?.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50 transition duration-200">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{coupon.code}</span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell ">
                                        <div className="flex flex-wrap gap-1">
                                                    <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">
                                                    {coupon.discountPercentage}
                                                    </span>   
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${new Date(coupon.expirationDate).getTime() > new Date(coupon.createdAt).getTime() ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                            {new Date(coupon.expirationDate).getTime() > new Date(coupon.createdAt).getTime() ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                                    <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">
                                                    {formatDate(coupon.createdAt)}
                                                    </span>   
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                                    <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">
                                                    {formatDate(coupon.expirationDate)}
                                                    </span>   
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setDeletingCouponId(coupon._id);
                                                deleteCoupon(coupon._id, {
                                                    onSettled: () => setDeletingCouponId(null),
                                                });
                                            }}
                                            className="text-red-500 hover:text-red-400"
                                            disabled={deletingCouponId === coupon._id}
                                        >
                                            {deletingCouponId === coupon._id ? (
                                                <Loader className="mr-2 h-5 w-5 animate-spin" />
                                            ) : (
                                                <Trash className="h-5 w-5" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No coupons found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
  )
}

export default CouponList
