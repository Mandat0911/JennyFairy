import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

import { useEffect } from "react";
import useCouponStore from "../../Store/Zustand/coupon";
import useCartStore from "../../Store/Zustand/cartStore";
import { useGetCartItems } from "../../Store/API/Cart.API";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "../lib/axios";

// const stripePromise = loadStripe(
// 	"pk_test_51KZYccCoOZF2UhtOwdXQl3vcizup20zqKqT9hVUIsVzsdBrhqbUI2fE0ZdEVLdZfeHjeyFXtqaNsyCJCmZWnjNZa00PzMAjlcL"
// );

const OrderSummary = () => {
	const { total, subtotal,  isCouponApplied, calculateTotals  } = useCartStore();

	const { data: cart} = useGetCartItems();


	
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

	// const handlePayment = async () => {
	// 	const stripe = await stripePromise;
	// 	const res = await axios.post("/payments/create-checkout-session", {
	// 		products: cart,
	// 		couponCode: coupon ? coupon.code : null,
	// 	});

	// 	const session = res.data;
	// 	const result = await stripe.redirectToCheckout({
	// 		sessionId: session.id,
	// 	});

	// 	if (result.error) {
	// 		console.error("Error:", result.error);
	// 	}
	// };

	
	
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
						<dd className="text-base font-medium text-gray-900">{formattedSubtotal}</dd>
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
						<dl className="flex items-center justify-between">
							<dt className="text-sm text-gray-500">Coupon ({coupon.code})</dt>
							<dd className="text-base font-medium text-emerald-500">-{coupon.discountPercentage}%</dd>
						</dl>
					)}
	
					{/* Divider */}
					<div className="border-t border-gray-300 pt-3"></div>
	
					{/* Total */}
					<dl className="flex items-center justify-between text-gray-900">
						<dt className="text-base font-semibold">Total</dt>
						<dd className="text-lg font-bold text-gray-900">{formattedTotal}</dd>
					</dl>
	
					{/* Checkout Button */}
					<motion.button
						className="w-full rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white tracking-wide hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-700"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
					>
						Proceed to Checkout
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
				</div>
			</motion.div>
		);
	};
	
	export default OrderSummary;
	