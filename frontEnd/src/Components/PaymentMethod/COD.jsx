import React, { useState } from "react";
import toast from "react-hot-toast";
import useCartStore from "../../Store/Zustand/cartStore.js";
import useCouponStore from "../../Store/Zustand/coupon.js";
import { useCreateSessionCheckoutCod } from "../../Store/API/Payment.API.js";
import { useNavigate } from "react-router-dom";
import { useAppliedCoupon } from "../../Store/API/Coupon.API.js";

const COD = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {cart, total, isCouponApplied } = useCartStore();
    const {coupon, setCoupon} = useCouponStore();
    const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

    const { mutate: createCheckoutSession } = useCreateSessionCheckoutCod();
    const { mutateAsync: appliedCoupon } = useAppliedCoupon();
  

  const handleConfirmPayment = async () => {
       
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.address) {
      toast.error("Please fill in all required shipping details!");
      return;
    }
    setLoading(true);
    try {
      if (coupon?.code) {
        await appliedCoupon({ code: coupon.code }); // Ensure coupon is applied first
    }
      createCheckoutSession(
        { products: cart, couponCode: coupon?.code || null, shippingDetails, totalAmount: total, couponDiscountPercentage: coupon?.discountPercentage },
        {
          onSuccess: () => {
            setLoading(false);
            navigate(`/products`); // Navigate to success page
          },
          onError: (error) => {
            setLoading(false);
            toast.error(error.message || "Something went wrong!");
          }
        }
      );
    } catch (error) {
      setLoading(false);
        console.error("Error in handleConfirmPayment:", error.message);
    }

      
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 uppercase tracking-wider text-center">
                Cash on Delivery</h3>
            
            <p className="text-gray-600 text-sm mb-6">
                Enter your details to proceed with Cash on Delivery.
            </p>

            {/* Input Fields */}
            <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Enter your full name"
            value={shippingDetails.fullName}
            onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="Number"
            required
            placeholder="Enter your phone number"
            value={shippingDetails.phone}
            onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Street address"
            value={shippingDetails.address}
            onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              placeholder="City"
              value={shippingDetails.city}
              onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              placeholder="Postal Code"
              value={shippingDetails.postalCode}
              onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            placeholder="Country"
            value={shippingDetails.country}
            onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        </div>

        {isCouponApplied ? (
          <p className="text-green-600 text-sm font-medium text-center">✅ Coupon Applied Successfully!</p>
        ) : (
          <input
            readOnly
            placeholder="Coupon Code (Optional)"
            value={coupon.code}
            onChange={(e) => setCoupon({ code: e.target.value })}
            className="w-full px-4 py-3 border bg-gray-100 border-gray-300 text-gray-800 cursor-default rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        <span className="font-semibold">Notice:</span> If you are outside of Vietnam, please ensure all
        fields are correctly filled.
      </p>

      <button
        onClick={handleConfirmPayment}
        className="mt-6 w-full bg-black text-white py-3 rounded-md text-sm font-medium uppercase tracking-wider transition duration-300 hover:bg-gray-900 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default COD;
