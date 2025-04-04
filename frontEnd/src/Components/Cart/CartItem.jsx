import { X, ChevronUp, ChevronDown } from "lucide-react";
import { useDeleteCartItem, useUpdateQuantityCartItem } from "../../Store/API/Cart.API.js";
import { useState } from "react";
import useCartStore from "../../Store/Zustand/cartStore.js";

const CartItem = ({ item }) => {
	const { mutate: removeItem } = useDeleteCartItem();
	const [quantity, setQuantity] = useState(item.quantity);
	const {removeFromCart, updateQuantity } = useCartStore();
	const {mutate: updateQuantityAPI} = useUpdateQuantityCartItem();

	const hasDiscount = item?.discountPrice > 0 && item?.discountPrice < item?.price;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

	const handleQuantityChange = (newQuantity) => {
		if (newQuantity < 1) return; // Prevent invalid quantity

		setQuantity(newQuantity);
		updateQuantityAPI({
			productId: item.productId,
			size: item.size,
			quantity: newQuantity,
		}, {
			onSuccess: () => {
				updateQuantity(item.productId, item.size, newQuantity);
			}
		});
	};

	const handleRemove = () => {
		removeItem({ productId: item.productId, size: item.size });
		removeFromCart(item.productId, item.size);
		
	};

	return (
		<div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-300 py-4 sm:py-6">
		  {/* Product Image & Details */}
		  <div className="flex items-center gap-3 w-full">
			<img
			  src={item.img[0]}
			  alt={item.name}
			  className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover shadow-md"
			/>
			<div className="flex flex-col flex-grow">
			  <h3 className="text-sm sm:text-lg font-medium text-gray-900 leading-tight">{item.name}</h3>
			  <p className="text-xs sm:text-sm text-gray-500 mt-1">Size: {item.size}</p>
			</div>
		  </div>
	  
		  {/* Quantity & Price - Stacked on Mobile */}
		  <div className="flex sm:flex-row flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
			{/* Quantity Controls */}
			<div className="flex items-center border border-gray-300 rounded-md px-2 py-1 bg-gray-100">
			  <button
				className="p-2 sm:p-1 hover:text-gray-700 transition"
				onClick={() => handleQuantityChange(quantity - 1)}
			  >
				<ChevronDown size={18} />
			  </button>
			  <span className="px-3 text-md font-medium">{item.quantity}</span>
			  <button
				className="p-2 sm:p-1 hover:text-gray-700 transition"
				onClick={() => handleQuantityChange(quantity + 1)}
			  >
				<ChevronUp size={18} />
			  </button>
			</div>
	  
			{/* Price */}
			{hasDiscount ? (
			<p className="text-md sm:text-lg font-semibold text-gray-900">
			{formatPrice(item.discountPrice)}
		  </p>
		):(
			<p className="text-md sm:text-lg font-semibold text-gray-900">
			{formatPrice(item.price)}
		  </p>
	
		)}

			{/* Remove Button */}
			<button
			  className="p-2 rounded-full hover:bg-gray-200 transition sm:ml-2"
			  onClick={handleRemove}
			>
			  <X size={20} />
			</button>
		  </div>
		</div>
	  );
	  
};

export default CartItem;
