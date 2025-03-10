import React, { useEffect, useState } from 'react';
import useOrderStore from '../../Store/Zustand/orderStore.js';
import { PlusCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { deliveryStatus } from '../../Utils/Category.js';

const EditOrderForm = ({ initialOrder }) => {
  const { order, setOrder, isLoading, setLoading } = useOrderStore();
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(initialOrder?.shippingDetails?.deliveryStatus || 'pending');
  
  const isQrCodeMethod = initialOrder?.paymentId?.paymentMethod === "QR code";
  const isCoupon = initialOrder?.paymentId?.couponCode !== "";
  

  useEffect(() => {
    if (initialOrder) {
      setOrder({
        user: initialOrder?.user || '',
        paymentId: initialOrder.paymentId?._id || '',
        couponCode: initialOrder?.paymentId?.couponCode ||'',
        discountPercent: initialOrder?.paymentId?.couponDiscountPercentage ||'',
        Code: initialOrder?.Code || '',
        name: initialOrder.user?.name || '',
        email: initialOrder.user?.email || '',
        products: initialOrder?.products || [],
        totalAmount: initialOrder?.totalAmount || '',
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
      setSelectedDeliveryStatus(initialOrder?.shippingDetails?.deliveryStatus || []);

      setOrder((prev) => ({
        ...prev,
        ...initialOrder, // Populate the store with initial values
    }));
    }
  }, [initialOrder, setOrder]);
  

  const handleStatusChange = (status) => {
    const {order, setOrder } = useOrderStore.getState(); // Directly access state

        setOrder({
            ...order,
            shippingDetails: {
                deliveryStatus: status, // Update delivery status
            },
        });
        console.log(status)
};


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
      
      <form className="space-y-5">
        {/* Order Information */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Order Information</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order Id</label>
              <input value={initialOrder?._id || ''} className="block w-full text-gray-800 text-[12px] focus:outline-none cursor-default" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Id</label>
              <input value={initialOrder.paymentId?._id || ''} className="block w-full text-gray-800 text-[12px] focus:outline-none cursor-default" readOnly />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 mt-4'>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Email</label>
              <input value={order.user?.email || ''} className="block w-full text-gray-800 text-[12px] focus:outline-none cursor-default" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input value={initialOrder.user?.name || ''} className="block w-full text-gray-800 text-[12px] focus:outline-none cursor-default" readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
          {isCoupon && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Coupon</label>
                <p className="text-gray-800 text-sm"><strong>{order?.couponCode} </strong>"{order?.discountPercent}%"</p>
              </div>
            )}
            {isQrCodeMethod && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Code</label>
                <input type="text" value={order?.Code || ''} className="block w-full text-gray-800 text-[12px] focus:outline-none cursor-default" readOnly />
              </div>
            )}
          </div>

          <div className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Details</label>
  {order.products?.map((product, index) => (
    <div key={index} className="p-2 border rounded-md bg-gray-100 mb-2">
      <p className="text-gray-800 text-sm"><strong>Name:</strong> {product.product.name}</p>
      <p className="text-gray-800 text-sm"><strong>Price:</strong> {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}</p>
      <p className="text-gray-800 text-sm"><strong>Size:</strong> {product.size}</p>
      <p className="text-gray-800 text-sm"><strong>Quantity:</strong> {product.quantity}</p>
    </div>
  ))}
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input type="number" value={order?.totalAmount || ''} onChange={(e) => setOrder({ ...order, totalAmount: e.target.value })} step="1000" className="block w-full bg-gray-100 border rounded-md py-2 px-3 text-gray-800" required />
            </div>
        </div>

        {/* Shipping Details */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Shipping Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" value={order?.shippingDetails?.fullName} onChange={(e) => setOrder({ ...order, shippingDetails: { ...order.shippingDetails, fullName: e.target.value } })} className="block w-full bg-gray-100 border rounded-md py-2 px-3 text-gray-800" required />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" value={order?.shippingDetails?.phone} onChange={(e) => setOrder({ ...order, shippingDetails: { ...order.shippingDetails, phone: e.target.value } })} className="block w-full bg-gray-100 border rounded-md py-2 px-3 text-gray-800" required />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" value={order?.shippingDetails?.address} onChange={(e) => setOrder({ ...order, shippingDetails: { ...order.shippingDetails, address: e.target.value } })} className="block w-full bg-gray-100 border rounded-md py-2 px-3 text-gray-800" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input type="text" value={order?.shippingDetails?.postalCode} onChange={(e) => setOrder({ ...order, shippingDetails: { ...order.shippingDetails, postalCode: e.target.value } })} className="block w-full bg-gray-100 border rounded-md py-2 px-3 text-gray-800" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" value={order?.shippingDetails?.city} onChange={(e) => setOrder({ ...order, shippingDetails: { ...order.shippingDetails, city: e.target.value } })} className="block w-full bg-gray-100 border rounded-md py-2 px-3 text-gray-800" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input type="text" value={order?.shippingDetails?.country} onChange={(e) => setOrder({ ...order, shippingDetails: { ...order.shippingDetails, country: e.target.value } })} className="block w-full bg-gray-100 border rounded-md py-2 px-3 text-gray-800" required />
            </div>
          </div>
        </div>

                {/* Shipping Details */}
                <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-1 text-gray-800">Delivery Status</h3>
          <div>
                               <div className="grid grid-cols-4 gap-2">
                                  {deliveryStatus?.map((status) => (
                                      <label key={status} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md cursor-pointer transition duration-300 hover:bg-gray-200">
                                          <input
                                              type="radio"
                                              checked={order?.shippingDetails?.deliveryStatus?.includes(status) || ''}
                                              onChange={(e) => handleStatusChange(status)}
                                              className="w-5 h-5 text-gray-800 border-gray-300 rounded focus:ring-2 focus:ring-gray-800"
                                          />
                                          <span className="text-gray-800">{status}</span>
                                      </label>
                                  ))}
                              </div>
                          </div>
          </div>
        

        {/* Submit Button */}
        <button type="submit" className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none disabled:opacity-50" disabled={isLoading}>
          {isLoading ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
          {isLoading ? "Loading..." : "Update Order"}
        </button>
      </form>
    </motion.div>
  );
};

export default EditOrderForm;
