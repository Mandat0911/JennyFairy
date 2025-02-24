import React from "react";

const ProductCard = ({ product }) => {
    const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(price);
	};
	return (
		<div className="relative group w-full bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105">
			{/* Product Image */}
			<div className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden">
				<img
					src={product.img}
					alt={product.name}
					className="object-cover w-full h-full group-hover:opacity-80 transition"
				/>
			</div>

			{/* Product Details */}
			<div className="p-4 text-center">
				<h3 className="text-lg sm:text-xl font-medium text-gray-900 tracking-wide truncate">
					{product.name}
				</h3>
				<p className="text-md sm:text-lg text-gray-500 mt-1">{formatPrice(product.price)}</p>

				{/* Add to Cart Button */}
				<button
					className="w-full mt-4 px-4 py-2 bg-gray-900 text-white font-medium text-sm sm:text-base rounded-md transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
