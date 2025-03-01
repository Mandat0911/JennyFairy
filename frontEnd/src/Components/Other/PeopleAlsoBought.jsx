import React, { useEffect, useState } from 'react'
import ProductCard from "../Product/ProductCard.jsx"
import { useGetRecommendedProduct } from '../../Store/API/Product.API.js';

const PeopleAlsoBought = () => {
	const { data: recommendations, isLoading, isError } = useGetRecommendedProduct();


	if (isLoading) return <p>Loading recommendations...</p>;
	if (isError) return <p>Failed to load recommendations</p>;

  return (
	<div className="mt-16 px-4 lg:px-0">
	<h3 className="text-lg lg:text-xl font-light tracking-wide uppercase text-gray-900 text-center border-b pb-2">
		People also bought
	</h3>
	<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
	{recommendations.length > 0 ? (
					recommendations.map((product) => (
						
						<ProductCard key={product._id} product={product} />
					))
				) : (
					<p className="text-gray-500">No recommendations available.</p>
				)}
			</div>
		</div>
	);
}

export default PeopleAlsoBought
