import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

import { category } from '../Utils/Category.js';
import { sizes } from '../Utils/Size.js';
import useProductStore from '../Store/productStore.js';
import { useCreateProduct, useEditProduct } from '../Store/API/Product.API.js';


const CreateProductForm = ({ initialProduct }) => {
    const [selectedSizes, setSelectedSizes] = useState(initialProduct?.sizes || []);
    const [selectedCategory, setSelectedCategory] = useState(initialProduct?.category || []);
    const [imagePreviews, setImagePreviews] = useState(initialProduct?.img || []);
    const { product, setProduct, isLoading, setLoading } = useProductStore();

    const isEditing = Boolean(initialProduct);

    const { mutate: createProduct } = useCreateProduct();
    const { mutate: editProduct } = useEditProduct();

    // When `initialProduct` changes, update form fields
    useEffect(() => {
        if (initialProduct) {
            setProduct({
                name: initialProduct.name || "",
                description: initialProduct.description || "",
                price: initialProduct.price || "",
                category: initialProduct.category || [],
                sizes: initialProduct.sizes || [],
                img: initialProduct.img || [],
                quantity: initialProduct.quantity || false,
            });

            setSelectedCategory(initialProduct.category || []);
            setSelectedSizes(initialProduct.sizes || []);
            setImagePreviews(initialProduct.img || []);

            setProduct((prev) => ({
                ...prev,
                ...initialProduct, // Populate the store with initial values
            }));
        }
    }, [initialProduct, setProduct]);

    useEffect(() => {
        if (selectedCategory.length > 0 || selectedSizes.length > 0) {
            setProduct((prev) => ({
                ...prev,
                category: selectedCategory.length > 0 ? selectedCategory : prev.category,
                sizes: selectedSizes.length > 0 ? selectedSizes : prev.sizes,
            }));
        }
    }, [selectedCategory, selectedSizes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (isEditing) {
            editProduct(
                { 
                    productId: initialProduct._id, 
                    newProduct: product // Ensure you're passing the updated product data 
                },
                {
                    onSuccess: () => {
                        setSelectedCategory([]);
                        setSelectedSizes([]);
                        setImagePreviews([]);
                        setLoading(false);
                    },
                    onError: () => {
                        setLoading(false);
                    }
                }
            );
        } else {
            createProduct(product, {
                onSuccess: () => {
                    setSelectedCategory([]);
                    setSelectedSizes([]);
                    setImagePreviews([]);
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                }
            });
        }
    };

    const handleCategoryChange = (e, cat) => {
        const { product, setProduct } = useProductStore.getState(); // Directly access state
        
        const isChecked = e.target.checked;
        const updatedCategories = isChecked
            ? [...product.category, cat] // Add new category
            : product.category.filter((c) => c !== cat); // Remove category
    
        setProduct({ category: updatedCategories }); // Update Zustand store properly
    };

    const handleSizeChange = (e, size) => {
        const { product, setProduct } = useProductStore.getState();
        const isChecked = e.target.checked;

        const updatedSizes = isChecked
            ? [...product.sizes, size] // Add new size
            : product.sizes.filter((s) => s !== size); // Remove size
    
        setProduct({ sizes: updatedSizes }); // Update Zustand store properly
    };

    const handleImageChange = (e) => {
        const { product, setProduct } = useProductStore.getState(); // Get Zustand state
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            toast.error("You can only upload 5 images at a time!");
            return; // Stop further execution if limit exceeds
        }

        const readFilesAsBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };

        Promise.all(files.map(readFilesAsBase64))
            .then((base64Images) => {
                const updatedImages = [...(product.img || []), ...base64Images];
                setProduct({ img: updatedImages }); // Update Zustand store properly
                setImagePreviews((prev) => [...prev, ...base64Images]);
            })
            .catch((error) => {
                console.error('Error converting images:', error);
            });
    };

    const handleRemoveImage = (index) => {
        const updatedImages = product.img.filter((_, i) => i !== index);
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

        setProduct({ img: updatedImages });
        setImagePreviews(updatedPreviews);
    };

    return (
        <motion.div
            className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
                {isEditing ? "Edit Product" : "Create New Product"}
            </h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={(e) => setProduct({ name: e.target.value })}
                        placeholder="Name"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>
    
                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={(e) => setProduct({ description: e.target.value })}
                        rows="3"
                        placeholder="Description"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>
    
                {/* Price & Quantity in the same row */}
                <div className="flex space-x-4">
                    {/* Price */}
                    <div className="w-1/2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={(e) => setProduct({ price: e.target.value })}
                            step="1000"
                            placeholder="Price"
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>

                    {/* Quantity */}
                    <div className="w-1/2">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">
                            Quantity
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={product.quantity}
                            onChange={(e) => setProduct({ quantity: e.target.value })}
                            step="1"
                            placeholder="Quantity"
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                </div>
    
                {/* Category Selection */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                    <label className="block text-lg font-semibold text-emerald-400 mb-2">Select Category</label>
                    <div className="grid grid-cols-3 gap-3">
                        {category.map((cat) => (
                            <label
                                key={cat}
                                className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg cursor-pointer transition duration-300 hover:bg-emerald-500 hover:text-white"
                            >
                                <input
                                    type="checkbox"
                                    value={cat}
                                    checked={Array.isArray(product.category) && product.category.includes(cat)}
                                    onChange={(e) => handleCategoryChange(e, cat)}
                                    className="w-5 h-5 text-emerald-500 bg-gray-900 border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-400"
                                />
                                <span className="text-white">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>
    
                {/* Size Selection */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                    <label className="block text-lg font-semibold text-emerald-400 mb-2">Select Size</label>
                    <div className="grid grid-cols-3 gap-3">
                        {sizes.map((size) => (
                            <label
                                key={size}
                                className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg cursor-pointer transition duration-300 hover:bg-emerald-500 hover:text-white"
                            >
                                <input
                                    type="checkbox"
                                    value={product.size}
                                    checked={Array.isArray(product.sizes) && product.sizes.includes(size)}
                                    onChange={(e) => handleSizeChange(e, size)}
                                    className="w-5 h-5 text-emerald-500 bg-gray-900 border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-400"
                                />
                                <span className="text-white">{size}</span>
                            </label>
                        ))}
                    </div>
                </div>
    
                {/* Image Upload */}
                <div className="w-full">
                    <input type="file" id="img" className="sr-only" accept="image/*" multiple onChange={handleImageChange} />
                    <label
                        htmlFor="img"
                        className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <Upload className="h-5 w-5 inline-block mr-2" /> Upload Images
                    </label>
                    <p className="text-xs text-gray-400 mt-2 opacity-75 italic">Only 5 images at a time</p>
                    <div className="mt-2 overflow-hidden max-h-[120px] w-full bg-gray-800 p-2 rounded-md">
                        <div className="grid grid-cols-5 gap-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img src={preview} alt={`Preview ${index}`} className="w-20 h-20 rounded-md shadow-md object-cover" />
                                    <span
                                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded cursor-pointer"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        ✕
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
    
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
                    {isLoading ? "Loading..." : isEditing ? "Update Product" : "Create Product"}
                </button>
            </form>
        </motion.div>
    );
};
    
export default CreateProductForm;