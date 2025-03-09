import React, { useEffect } from 'react'
import useOrderStore from '../../Store/Zustand/orderStore.js';
import { PlusCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const EditOrderForm = ({initialOrder}) => {
  const { order, setOrder, isLoading, setLoading } = useOrderStore();
  console.log(order.Code)

      // When `initialProduct` changes, update form fields
      useEffect(() => {
          if (initialOrder) {
                setOrder({
                user: initialOrder.user || '',
                paymentId: initialOrder.paymentId?._id || '',
                Code: initialOrder.Code || '',
                name: initialOrder.user?.name || '',
                email: initialOrder.user?.email || '',
                products: initialOrder.products || [],
                totalAmount: initialOrder.totalAmount || '',
                shippingDetails: {
                    fullName: initialOrder.shippingDetails?.fullName || '',
                    phone: initialOrder.shippingDetails?.phone || '',
                    address: initialOrder.shippingDetails?.address || '',
                    city: initialOrder.shippingDetails?.city || '',
                    postalCode: initialOrder.shippingDetails?.postalCode || '',
                    country: initialOrder.shippingDetails?.country || '',
                    deliveryStatus: initialOrder.shippingDetails?.deliveryStatus || 'pending',
                },
            });
  
            //   setSelectedCategory(initialProduct.category || []);
            //   setSelectedSizes(initialProduct.sizes || []);
            //   setImagePreviews(initialProduct.img || []);
  
              setOrder((prev) => ({
                  ...prev,
                  ...initialOrder, // Populate the store with initial values
              }));
          }
      }, [initialOrder, setOrder]);
  return (
    <motion.div
        className="max-w-lg mx-auto"
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
            <div className='grid grid-cols-2 gap-4'>
            <div>
                <label className="block text-sm font-medium text-gray-700">Order Id</label>
                <input
                    value={initialOrder._id}
                    placeholder="Order id"
                    className="block w-full text-gray-800 focus:outline-none cursor-default"
                    readOnly
                />
            </div>

            <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <input
                        type="text"
                        value={order.Code}
                        placeholder="Code"
                        className="block w-full text-gray-800 focus:outline-none cursor-default"
                        readOnly
                    />
                </div>
            </div>



            <div className='grid grid-cols-2 gap-4'>
            <div>
                <label className="block text-sm font-medium text-gray-700">Payment Id</label>
                <input
                    value={initialOrder.paymentId._id}
                    placeholder="Payment id"
                    className="block w-full text-gray-800 focus:outline-none cursor-default"
                    readOnly
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    value={order.user.email}
                    placeholder="Payment id"
                    className="block w-full text-gray-800 focus:outline-none cursor-default"
                    readOnly
                />
            </div>
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

            
            {/* Price & Code */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <input
                        type="number"
                        value={order.totalAmount}
                        onChange={(e) => setOrder({ ...order, totalAmount: e.target.value })}
                        step="1000"
                        placeholder="Price"
                        className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        required
                    />
                </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <input
                        type="text"
                        value={order.Code}
                        placeholder="Code"
                        className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        readOnly
                    />
                </div>
                
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

