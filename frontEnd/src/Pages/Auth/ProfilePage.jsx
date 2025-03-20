import React, { useState } from "react";
import { User, Mail, ShoppingBag, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { useGetUserProfile } from "../../Store/API/Auth.API";
import { formatDate } from "../../Utils/Date";
import { useAuthStore } from "../../Store/Zustand/authStore";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { data: userData } = useGetUserProfile();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { deleteAccount } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);


  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(price);
	};

  return (
    <div className="min-h-screen max-w-3xl mx-auto py-10 px-6 md:px-10 lg:px-16">
      {/* Profile Section */}
      <div className="mt-15 bg-gray-100 p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6">
        <User className="w-12 h-12 text-gray-700" />
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold uppercase tracking-wide">{userData?.user.name}</h2>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Mail className="w-5 h-5" /> {userData?.user.email}
          </p>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" /> Order History
        </h3>
        <ul className="bg-white p-4 rounded-xl shadow-md divide-y">
          {userData?.orders.map((order) => (
            <li key={order.id} className="py-4">
              {/* Order Header (Expandable) */}
              <div
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <span className="text-sm md:text-base font-semibold">
                  Order #{order.id} - {formatDate(order.createdAt)}
                </span>
                {expandedOrder === order.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {/* Order Details (Collapsible) */}
              {expandedOrder === order.id && (
                <div className="mt-3 p-3 border-t">
                  <span className={`text-gray-600 text-xs md:text-base px-2 py-1 font-semibold rounded-full 
                  ${order.shippingDetails.deliveryStatus === "pending" ? "bg-yellow-500 text-white" : 
                    order.shippingDetails.deliveryStatus === "delivered" ? "bg-green-500 text-white" : 
                    order.shippingDetails.deliveryStatus === "canceled" ? "bg-gray-500 text-white" : 
                    order.shippingDetails.deliveryStatus === "shipped" ? "bg-blue-500 text-white" : 
                    "bg-gray-500 text-white"}`
                    
                  }
                  >
                    {order.shippingDetails.deliveryStatus}
                  </span>
                  <span className="font-semibold"> - {formatPrice(order.totalAmount)}</span>
                  {/* Order Products */}
                  <div className="space-y-3 mt-3">
                    {order?.products.map((product) => (
                      <div key={product._id} className="flex items-center gap-4">
                        {/* Product Image */}
                        <img 
                          src={product?.product?.img[0]} 
                          alt={product?.product?.name} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        {/* Product Details */}
                        <div>
                          <p className="text-sm md:text-base font-medium">{product?.product?.name}</p>
                          <p className="text-gray-600 text-sm">Quantity: {product.quantity}</p>
                          <p className="text-gray-600 text-sm">Size: {product.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Account Settings */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
      {/* Delete Account Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center gap-2 px-5 py-3 w-full md:w-auto bg-black text-white rounded-lg hover:bg-gray-700 transition text-sm md:text-base cursor-pointer"
      >
        <Trash className="w-5 h-5" /> Delete Account
      </button>

      {/* Animated Modal with Blur Effect */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-white/10 z-50 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white p-6 w-full max-w-sm rounded-xl shadow-xl text-center"
          >
            <h2 className="text-lg font-semibold text-gray-900">Delete Account</h2>
            <p className="text-gray-600 text-sm mt-2">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAccount();
                  setIsModalOpen(false);
                }}
                className="w-full md:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition text-sm"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProfilePage;
