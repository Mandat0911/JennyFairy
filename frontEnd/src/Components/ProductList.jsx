import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash, Star, Edit, Loader, X } from "lucide-react";
import { useDeleteProduct, useGetAllProduct, useToggleFeatureProduct } from '../Store/API/Product.API.js';
import CreateProductForm from './CreateProductForm.jsx';

const ProductList = () => {
    const { data: products } = useGetAllProduct();
    const { mutate: deleteMutation, isPending: isDeleting } = useDeleteProduct();
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [editProductData, setEditProductData] = useState(null);
    const toggleFeaturedProduct = useToggleFeatureProduct();

    return (
        <motion.div
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">InStock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {products?.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.img[0]} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-block px-3 py-1 text-sm font-semibold text-green-800 bg-green-200 rounded-full">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(product.category) &&
                                            product.category.map((cat, index) => (
                                                <span key={index} className="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                                                    {cat}
                                                </span>
                                            ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${product.quantity ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                        {product.quantity ? "In Stock" : "Out of Stock"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleFeaturedProduct.mutate(product._id)}
                                        className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                                            product.isFeatured ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
                                        className="text-red-400 hover:text-red-300"
                                        disabled={deletingProductId === product._id || isDeleting}
                                    >
                                        {deletingProductId === product._id || isDeleting ? (
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
            {editProductData && (
                <div
                    className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30 z-50"
                    onClick={() => setEditProductData(null)}
                >
                    <div
                        className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setEditProductData(null)}
                            className="sticky top-0 text-gray-400 hover:text-gray-200 justify-end"
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
