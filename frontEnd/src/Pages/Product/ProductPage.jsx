import React from "react";
import ProductCard from "../../Components/ProductCard.jsx";
import { useGetAllProduct } from "../../Store/API/Product.API.js";
import { motion } from "framer-motion";

const ProductPage = () => {
	const { data: products } = useGetAllProduct();

	return (
		<div className="min-h-screen bg-gray-50 mt-4">
			<div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
				{/* Page Title */}
				<motion.h1
					className="text-center text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-gray-900 uppercase mb-12"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Our Collection
				</motion.h1>

				{/* Product Grid - Responsive */}
				<motion.div
					className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{/* No Products Found */}
					{products?.length === 0 && (
						<h2 className="text-xl sm:text-2xl font-light text-gray-500 text-center col-span-full">
							No products available
						</h2>
					)}

					{/* Product Cards */}
					{products?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>

			</div>
		</div>
	);
};

export default ProductPage;
