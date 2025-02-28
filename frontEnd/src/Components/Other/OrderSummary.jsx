import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

import { useEffect } from "react";
import useCouponStore from "../../Store/Zustand/coupon";
import useCartStore from "../../Store/Zustand/cartStore";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "../lib/axios";

// const stripePromise = loadStripe(
// 	"pk_test_51KZYccCoOZF2UhtOwdXQl3vcizup20zqKqT9hVUIsVzsdBrhqbUI2fE0ZdEVLdZfeHjeyFXtqaNsyCJCmZWnjNZa00PzMAjlcL"
// );

const OrderSummary = () => {
	const { total, subtotal,  isCouponApplied, cart, calculateTotals  } = useCartStore();
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
        className="space-y-6 rounded-lg border border-gray-300 bg-white p-6 shadow-lg sm:p-8"
        initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<h2 className="text-lg font-semibold tracking-wide text-gray-900">Order Summary</h2>

			<div className="space-y-4">
				<div className="space-y-2 text-gray-700">
					<dl className="flex items-center justify-between">
						<dt className="text-sm">Subtotal</dt>
						<dd className='text-base font-medium text-gray-900'>{formattedSubtotal}</dd>
					</dl>

					{savings < 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
						</dl>
					)}

{coupon && isCouponApplied && (
    <dl className='flex items-center justify-between gap-4'>
        <dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
        <dd className='text-base font-medium text-emerald-400'>-{coupon.discount}%</dd>
    </dl>
)}
<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
    <dt className='text-base font-bold text-gray-900'>Total</dt>
    <dd className='text-base font-bold text-emerald-400'>{formattedTotal}</dd>
</dl>

				</div>

				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					// onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
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