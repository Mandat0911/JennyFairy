import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Loader } from 'lucide-react';
import useCouponStore from '../../Store/Zustand/coupon.js';
import { useCreateCoupon, useGetAllCoupon } from '../../Store/API/Coupon.API.js';
import toast from 'react-hot-toast';
import CouponList from './CouponList.jsx';

const CreateCouponForm = () => {
    const { coupon, setCoupon, isLoading, setLoading } = useCouponStore();
    const { mutate: createCoupon } = useCreateCoupon();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        createCoupon(coupon, {
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    };

    return (
        <div>
            <motion.div
                className="bg-white shadow-xl rounded-lg p-6 mb-8 max-w-lg mx-auto border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center uppercase tracking-wide">
                    New Coupon
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Coupon Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Coupon Name</label>
                        <input
                            type="text"
                            value={coupon.code}
                            onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
                            placeholder="Enter discount name"
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            required
                        />
                    </div>

                    {/* Coupon Discount % */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Coupon Discount %</label>
                        <input
                            type="Number"
                            value={coupon.discountPercentage}
                            onChange={(e) => setCoupon({ discountPercentage: e.target.value })}
                            placeholder="Enter discount %"
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            required
                        />
                        {coupon.discountPercentage > 20 && (
                            <p className="mt-1 text-sm text-yellow-500">
                                Your Discount percentage exceeds 20%.
                            </p>
                        )}
                    </div>

                    {/* Expiration Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
                        <input
                            type="Date"
                            value={coupon.expirationDate}
                            onChange={(e) => setCoupon({ ...coupon, expirationDate: e.target.value })}
                            placeholder="Enter collection name"
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <PlusCircle className="mr-2 h-5 w-5" />
                        )}
                        {isLoading ? "Loading..." : "Create Coupon"}
                    </button>
                </form>
            </motion.div>
            <CouponList />
        </div>
    );
};

export default CreateCouponForm;
