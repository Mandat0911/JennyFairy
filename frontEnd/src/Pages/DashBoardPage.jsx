// import React, {useEffect} from "react";
import { CategoryItem } from "../Components/CategoryItem.jsx";
import {categories} from "../Utils/Category.js";
const DashboardPage = () => {

	return (
		<div className='mt-4 relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our New Collections
				</h1>
				<p className='text-center text-xl text-white mb-5'>
					Discover the latest trends
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{/* {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />} */}
			</div>
		</div>
	);
};
export default DashboardPage;