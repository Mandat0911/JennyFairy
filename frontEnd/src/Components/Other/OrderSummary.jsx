import { motion } from "framer-motion";

import { Link, useLocation } from "react-router-dom";
import { MoveRight, X } from "lucide-react";

import { useEffect } from "react";
import useCouponStore from "../../Store/Zustand/coupon.js";
import useCartStore from "../../Store/Zustand/cartStore.js";
import { useGetCartItems } from "../../Store/API/Cart.API";

const OrderSummary = () => {
	const { total, subtotal,  isCouponApplied, calculateTotals, setIsCouponApplied  } = useCartStore();

	const { data: cart} = useGetCartItems();

	const {resetCoupon} = useCouponStore();

	const location = useLocation(); // Get current page URL
	const isCheckoutPage = location.pathname === "/checkout"; // Check if on checkout page
	
	const { coupon } = useCouponStore();
	const savings = subtotal - total;
	
	const formatCurrency = (amount) => 
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount); 

	const formattedSubtotal = formatCurrency(subtotal);
	const formattedTotal = formatCurrency(total);
	const formattedSavings = formatCurrency(savings);

      useEffect(() => {
        calculateTotals();
    }, [cart, coupon]);

	const handleRemoveCoupon = (e) => {
		e.preventDefault();

		resetCoupon();
		setIsCouponApplied(false)
	}
	
	
		return (
			<motion.div
				className="rounded-lg border border-gray-200 bg-white p-6 shadow-md sm:p-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				{/* Title */}
				<h2 className="text-lg font-semibold text-gray-900 tracking-tight">Order Summary</h2>
	
				<div className="space-y-5 mt-4">
					{/* Subtotal */}
					<dl className="flex items-center justify-between text-gray-700">
						<dt className="text-sm">Subtotal</dt>
						<dd className="text-base font-light text-gray-900">{formattedSubtotal}</dd>
					</dl>
	
					{/* Savings */}
					{savings > 0 && (
						<dl className="flex items-center justify-between">
							<dt className="text-sm text-gray-500">Savings</dt>
							<dd className="text-base font-medium text-emerald-500">{formattedSavings}</dd>
						</dl>
					)}
	
					{/* Coupon Discount */}
					{coupon && isCouponApplied && (
  <div className="flex items-center justify-between">
    {/* Coupon Label */}
    <dt className="text-sm text-gray-500">Coupon (<span className="font-bold">{coupon.code}</span>)</dt>

    {/* Discount and Remove Button Wrapper */}
    <div className="flex items-center gap-2">
      <dd className="text-base font-medium text-emerald-500">-{coupon.discountPercentage}%</dd>
      <button 
        onClick={handleRemoveCoupon} 
        className="text-black-500 hover:text-red-700 transition-all"
      >
        <X size={16} />
      </button>
    </div>
  </div>
)}

	
					{/* Divider */}
					<div className="border-t border-gray-300 pt-3"></div>
	
					{/* Total */}
					<dl className="flex items-center justify-between text-gray-900">
						<dt className="text-base font-semibold">Total</dt>
						<dd className="text-lg font-bold text-gray-900">{formattedTotal}</dd>
					</dl>
	
					{/* Checkout Button */}
					{!isCheckoutPage && (
          <>
            {/* Checkout Button */}
            <motion.button
              className="w-full rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white tracking-wide hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/checkout"
                className="inline-flex items-center gap-1 text-white hover:text-gray-300 transition-all"
              >
                Proceed to Checkout
              </Link>
            </motion.button>

            {/* Continue Shopping */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
              <span>or</span>
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-gray-800 hover:text-gray-600 transition-all"
              >
                Continue Shopping
                <MoveRight size={16} />
              </Link>
            </div>
          </>
        )}
				</div>
			</motion.div>
		);
	};
	
	export default OrderSummary;
	