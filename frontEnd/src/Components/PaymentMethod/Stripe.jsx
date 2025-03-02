import React, { useState } from "react";
import {loadStripe} from "@stripe/stripe-js"
import useCartStore from "../../Store/Zustand/cartStore.js";
import toast from "react-hot-toast";
import { useCreateSessionCheckoutStripe } from "../../Store/API/Payment.API";
import useCouponStore from "../../Store/Zustand/coupon.js";
import { useValidateCoupon } from "../../Store/API/Coupon.API.js";

const stripePromise = loadStripe ("pk_test_51Qt5G8RwMpBGl8YKTW579QWkTxTSkX1P89HWG4EokOnsdp4Qine0kT6ynH2PQ3MsiL6e8cmsSgTWfdjeHS8vAyGf00RPGVFO05")

const Stripe = () => {
  const [loading, setLoading] = useState(false);
  const {cart , isCouponApplied } = useCartStore();
  const {coupon, setCoupon} = useCouponStore();
  const {mutate: createCheckoutSession} = useCreateSessionCheckoutStripe();


  const handleConfirmPayment = async () => {
       
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
  
    setLoading(true);

  
    createCheckoutSession(
      { products: cart, couponCode: coupon?.code || null },
      {
        onSuccess: async (data) => {
          if (!data.sessionId) {
            toast.error("Failed to get Stripe session ID");
            setLoading(false);
            return;
          }
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
    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-wide">Pay with Card</h3>

      {/* Coupon Input */}
      {isCouponApplied ? (

        <p className="text-green-600 text-sm font-medium">
          ✅ Coupon is already applied!
        </p>

      ): ( 
        <input
        type="text"
        placeholder="Enter Coupon Code (Optional)"
        // value={coupon.code}
        // onChange={(e) => setCoupon({code: e.target.value})}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
      )}
      

      {/* Pay Now Button */}
      <button
        onClick={handleConfirmPayment}
        className="mt-4 w-full bg-black text-white py-3 rounded-md text-sm font-medium uppercase tracking-wider transition duration-300 hover:bg-gray-900 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Stripe;
