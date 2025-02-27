import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../../Store/Zustand/cartStore.js";
import { TicketPercent, XCircle } from "lucide-react";
import { useValidateCoupon } from "../../Store/API/Coupon.API.js";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied, getMyCoupon, removeCoupon } = useCartStore();
    const {mutate: applyCoupon} = useValidateCoupon();

	// useEffect(() => {
	// 	getMyCoupon();
	// }, [getMyCoupon]);

	// useEffect(() => {
	// 	if (coupon) setUserInputCode(coupon.code);
	// }, [coupon]);

	// const handleApplyCoupon = () => {
	// 	if (!userInputCode) return;
	// 	applyCoupon(userInputCode);
	// };

	// const handleRemoveCoupon = async () => {
	// 	await removeCoupon();
	// 	setUserInputCode("");
	// };

	return (
		<motion.div
			className="space-y-4 rounded-lg border border-gray-300 bg-white p-5 shadow-md sm:p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			{/* Coupon Input */}
			<div className="space-y-4">
				<div>
					<label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-800">
						Have a Gift Card or Promo Code?
					</label>
					<div className="relative">
						<input
							type="text"
							id="voucher"
							className="block w-full rounded-md border border-gray-300 bg-gray-100 
							p-2.5 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black"
							placeholder="Enter code here"
							value={userInputCode}
							onChange={(e) => setUserInputCode(e.target.value)}
							required
						/>
						<TicketPercent size={18} className="absolute left-3 top-3 text-gray-500" />
					</div>
				</div>

				{/* Apply Button */}
				<motion.button
					type="button"
					className="flex w-full items-center justify-center rounded-md bg-black px-5 py-2.5 
					text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					 onClick={applyCoupon}
				>
					Apply Code
				</motion.button>
			</div>

			{/* Applied Coupon */}
			{isCouponApplied && coupon && (
				<div className="mt-4 border-t pt-4">
					<h3 className="text-md font-medium text-gray-800">Applied Coupon</h3>

					<div className="mt-2 flex items-center justify-between bg-gray-100 rounded-md p-3">
						<p className="text-sm text-gray-700">
							{coupon.code} - {coupon.discountPercentage}% off
						</p>

						{/* Remove Coupon Button */}
						<motion.button
							type="button"
							className="text-red-500 hover:text-red-700"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							// onClick={handleRemoveCoupon}
						>
							<XCircle size={18} />
						</motion.button>
					</div>
				</div>
			)}

			{/* Available Coupon */}
			{coupon && !isCouponApplied && (
				<div className="mt-4 border-t pt-4">
					<h3 className="text-md font-medium text-gray-800">Available Coupon</h3>
					<p className="mt-2 text-sm text-gray-700">
						{coupon.code} - {coupon.discountPercentage}% off
					</p>
				</div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;
