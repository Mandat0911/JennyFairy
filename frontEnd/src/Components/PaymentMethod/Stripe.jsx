import React, { useState } from "react";
import {loadStripe} from "@stripe/stripe-js"
import useCartStore from "../../Store/Zustand/cartStore.js";
import toast from "react-hot-toast";
import { useCreateSessionCheckoutStripe } from "../../Store/API/Payment.API";
import useCouponStore from "../../Store/Zustand/coupon.js";

const stripePromise = loadStripe ("pk_test_51Qt5G8RwMpBGl8YKTW579QWkTxTSkX1P89HWG4EokOnsdp4Qine0kT6ynH2PQ3MsiL6e8cmsSgTWfdjeHS8vAyGf00RPGVFO05")

const Stripe = () => {
  const [loading, setLoading] = useState(false);
  const {cart , isCouponApplied } = useCartStore();
  const {coupon, setCoupon} = useCouponStore();
  const {mutate: createCheckoutSession} = useCreateSessionCheckoutStripe();
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });


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

  
    createCheckoutSession(
      { products: cart, couponCode: coupon?.code || null, shippingDetails },
      {
        onSuccess: async (data) => {
          // Ensure Stripe is loaded before proceeding
          const stripe = await stripePromise;
          if (!stripe) {
            toast.error("Stripe failed to load");
            setLoading(false);
            return;
          }
          // Redirect to Stripe Checkout
          const result = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
            
          });
          
          if (result.error) {
            toast.error(`Error: ${result.error.message}`);
          }
          
        },
        onError: () => {
          setLoading(false);
        }
      }
    );
  };
  


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 uppercase tracking-wider text-center">
        Secure Payment
      </h3>

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
            type="text"
            placeholder="Enter Coupon Code (Optional)"
            value={coupon.code}
            onChange={(e) => setCoupon({ code: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        <span className="font-semibold">📢 Notice:</span> If you are outside of Vietnam, please ensure all required
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
  export default Stripe;
  