import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash, Star, Edit, Loader, X } from "lucide-react";
import { useDeleteProduct, useGetAllProduct, useToggleFeatureProduct } from '../../Store/API/Product.API.js';
import CreateProductForm from './CreateProductForm.jsx';

const ProductList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const { mutate: deleteMutation } = useDeleteProduct();
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [editProductData, setEditProductData] = useState(null);
    const toggleFeaturedProduct = useToggleFeatureProduct();
    
    const [limit, setLimit] = useState(10);
    const { data } = useGetAllProduct(currentPage, limit);
    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;
    const filteredProducts = products.filter(product => 
        product._id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name?.toString().toLowerCase().includes(searchTerm) ||
        product.price?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(product.category)
    ? product.category.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    : false)
    );

    return (
        <motion.div
            className="bg-white shadow-xl rounded-lg overflow-hidden max-w-5xl mx-auto p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="justify-between items-center mb-4 ">
            <input
                        type="text"
                        placeholder="Search product name..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setLimit(20);
                        }}
                        className="border px-2 py-1 rounded-md text-sm w-1/3"
                        />

                <select
                    value={limit}
                    onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1); }}
                    className="border mx-2 mb-4 px-2 py-1 rounded-md text-sm"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Stock</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Featured</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts?.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition duration-200">
                                <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                                    <img className="h-12 w-12 rounded-lg object-cover" src={product.img[0]} alt={product.name} />
                                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {Array.isArray(product.category) &&
                                            product.category.map((cat, index) => (
                                                <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">
                                                    {cat}
                                                </span>
                                            ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.quantity ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                        {product.quantity ? "In Stock" : "Out of Stock"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleFeaturedProduct.mutate(product._id)}
                                        className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition duration-200 ${
                                            product.isFeatured ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                        }`}
                                    >
                                        <Star className="h-4 w-4" />
                                        {product.isFeatured ? "Featured" : "Set Featured"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setDeletingProductId(product._id);
                                            deleteMutation(product._id, {
                                                onSettled: () => setDeletingProductId(null),
                                            });
                                        }}
                                        className="text-red-500 hover:text-red-400"
                                        disabled={deletingProductId === product._id}
                                    >
                                        {deletingProductId === product._id ? (
                                            <Loader className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <Trash className="h-5 w-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setEditProductData(product)}
                                        className="text-green-400 hover:text-green-300 px-2"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>


            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                    Previous
                </button>
                <span className="text-sm font-semibold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                    Next
                </button>
            </div>
            {editProductData && (
                <div
                    className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50"
                    onClick={() => setEditProductData(null)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setEditProductData(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <CreateProductForm initialProduct={editProductData} />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ProductList;
