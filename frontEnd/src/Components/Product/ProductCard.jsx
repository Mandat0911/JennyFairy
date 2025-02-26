import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(price);
	};
	return (
		<Link to={`/product/${product._id}`}>
		<div className="relative group w-full bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105">
			{/* Product Image */}
			<div className="relative w-full h-60 sm:h-72 md:h-96 overflow-hidden">
				<img
					src={product.img[0]}
					alt={product.name}
					className="object-cover w-full h-full group-hover:opacity-80 transition"
					loading="lazy"
				/>
			</div>
	
			{/* Product Details */}
			<div className="p-3 sm:p-4 text-center">
				<h3 className="text-md sm:text-lg font-medium text-gray-900 tracking-wide truncate">
					{product.name}
				</h3>
				<p className="text-sm sm:text-md text-gray-500 mt-1">{formatPrice(product.price)}</p>
			</div>
		</div>
		</Link>
	);	
};

export default ProductCard;
