import { motion } from "framer-motion";
import {  useState } from "react";
import { TicketPercent } from "lucide-react";
import { useValidateCoupon } from "../../Store/API/Coupon.API.js";
import useCouponStore from "../../Store/Zustand/coupon.js";
import toast from "react-hot-toast";
import useCartStore from "../../Store/Zustand/cartStore.js";


const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const {calculateTotals, setIsCouponApplied} = useCartStore();
	const { isLoading, setLoading, coupon, setCoupon } = useCouponStore();
    const {mutate: applyCoupon} = useValidateCoupon();

	const handleApplyCoupon = () => {
		if (!userInputCode.trim()) {
			toast.error("Please enter a valid coupon code!");
			return;
		}
	
		// Check if the coupon is already applied
		if (coupon.code === userInputCode.trim()) {
			toast.error(`Coupon "${coupon.code}" is already applied!`, { id: "applied" });
			setUserInputCode("");
			return;
		}
	
		setLoading(true);
		
		applyCoupon(
			{ code: userInputCode },
			{
				onSuccess: (data) => {
					setCoupon({
						code: data.code,
						discountPercentage: data.discountPercentage,
						expirationDate: data.expirationDate
					});
					setUserInputCode("");
					setIsCouponApplied(true)
					toast.success(`Coupon "${data.code}" applied successfully!`);
	
					setTimeout(() => {
						calculateTotals();
					}, 0);
				},
				onError: () => {
					setLoading(false);
					setUserInputCode("");
				}
			}
		);
	};
	
	


	return (
		<motion.div
			className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-md sm:p-6"
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
					 onClick={handleApplyCoupon}
				>
					{isLoading ? "Loading..." : "Apply"}
				</motion.button>
			</div>
		</motion.div>
	);
};

export default GiftCouponCard;
