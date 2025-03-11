import React, { useState } from "react";
import ProductCard from "../../Components/Product/ProductCard.jsx";
import { useGetAllProduct } from "../../Store/API/Product.API.js";
import { motion } from "framer-motion";
import { category } from "../../Utils/Category.js";

const ProductPage = () => {
    const { data} = useGetAllProduct();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const products = data?.products || [];

    // Filter products based on search and category
    const filteredProducts = products?.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || product.category.includes(selectedCategory))
    );

    return (
        <div className="min-h-screen bg-gray-50 mt-4">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
                {/* Page Title */}
                <motion.h1
                    className="text-center text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-gray-900 uppercase mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Our Collection
                </motion.h1>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-1/2 p-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />

                    {/* Category Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-1/3 p-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        <option value="All">All Categories</option>
                        {category.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Grid */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {filteredProducts?.length === 0 ? (
                        <div className="col-span-full w-full flex justify-center items-center">
                            <h2 className="text-xl sm:text-2xl font-light text-gray-500 text-center">
                                No products found                             
                            </h2>
                        </div>
                    ) : (
                        filteredProducts?.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProductPage;
