import React from 'react'
import useOrderStore from '../../Store/Zustand/orderStore.js';
import { PlusCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const EditOrderForm = ({initialOrder}) => {
  const { order, setOrder, isLoading, setLoading } = useOrderStore();
  return (
    <motion.div
        className="bg-white shadow-xl rounded-lg p-6 mb-8 max-w-lg mx-auto border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center uppercase tracking-wide">
            Edit Order
        </h2>

        <form 
        // onSubmit={handleSubmit} 
        className="space-y-5">
            {/* Product Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Order Id</label>
                <input
                    value={initialOrder._id}
                    placeholder="Order id"
                    className="block w-full  text-gray-800 focus:outline-none cursor-default"
                    readOnly
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Payment Id</label>
                <input
                    value={initialOrder.paymentId._id}
                    placeholder="Payment id"
                    className="block w-full text-gray-800 focus:outline-none cursor-default"
                    readOnly
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    // value={product.description}
                    // onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    rows="3"
                    placeholder="Product description"
                    className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                    required
                />
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <input
                        type="number"
                        value={initialOrder.totalAmount}
                        onChange={(e) => set({ ...product, price: e.target.value })}
                        step="1000"
                        placeholder="Price"
                        className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        // value={product.quantity}
                        // onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                        step="1"
                        placeholder="Quantity"
                        className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        required
                    />
                </div>
            </div>

            {/* Category Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                {/* <div className="grid grid-cols-3 gap-2">
                    {category.map((cat) => (
                        <label key={cat} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md cursor-pointer transition duration-300 hover:bg-gray-200">
                            <input
                                type="checkbox"
                                checked={product.category?.includes(cat)}
                                onChange={(e) => handleCategoryChange(e, cat)}
                                className="w-5 h-5 text-gray-800 border-gray-300 rounded focus:ring-2 focus:ring-gray-800"
                            />
                            <span className="text-gray-800">{cat}</span>
                        </label>
                    ))}
                </div> */}
            </div>

            

           

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
                {isLoading ? "Loading..." : "Update Product"}
            </button>
        </form>
    </motion.div>
);
}

export default EditOrderForm

