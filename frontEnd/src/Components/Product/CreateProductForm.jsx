import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

import { category } from '../../Utils/Category.js';
import { sizes } from '../../Utils/Size.js';
import useProductStore from '../../Store/Zustand/productStore.js';
import { useCreateProduct, useEditProduct } from '../../Store/API/Product.API.js';


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
                discountPrice: initialProduct.discountPrice || "",
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
                    newProduct:{
                        newProduct: product
                    } // Ensure you're passing the updated product data 
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
            createProduct(
                {
                newProduct: {
                    newProduct: product
                }
            }, {
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
            className="bg-white shadow-xl rounded-lg p-6 mb-8 max-w-lg mx-auto border border-gray-200"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut"  }}    
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center uppercase tracking-wide">
                {isEditing ? "Edit Product" : "New Product"}
            </h2>
    
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        placeholder="Enter product name"
                        className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        required
                    />
                </div>
    
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        rows="3"
                        placeholder="Product description"
                        className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        required
                    />
                </div>
    
                {/* Price & Quantity */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            step="1"
                            min={0}
                            placeholder="Price"
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Price</label>
                        <input
                            type="number"
                            value={product.discountPrice}
                            onChange={(e) => setProduct({ ...product, discountPrice: e.target.value })}
                            step="1"
                            min={0}
                            placeholder="Discount Price"
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                            step="1"
                            placeholder="Quantity"
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            required
                        />
                    </div>
                </div>
    
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                        {category.map((cat) => (
                            <label key={cat} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md cursor-pointer transition duration-300 hover:bg-gray-200">
                                <input
                                    type="checkbox"
                                    checked={product.category?.includes(cat)}
                                    onChange={(e) => handleCategoryChange(e, cat)}
                                    className="w-5 h-5 text-gray-800 border-gray-300 rounded focus:ring-2 focus:ring-gray-800"
                                />
                                <span className="text-gray-800">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>
    
                {/* Size Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <div className="grid grid-cols-3 gap-2">
                        {sizes.map((size) => (
                            <label key={size} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md cursor-pointer transition duration-300 hover:bg-gray-200">
                                <input
                                    type="checkbox"
                                    checked={product.sizes?.includes(size)}
                                    onChange={(e) => handleSizeChange(e, size)}
                                    className="w-5 h-5 text-gray-800 border-gray-300 rounded focus:ring-2 focus:ring-gray-800"
                                />
                                <span className="text-gray-800">{size}</span>
                            </label>
                        ))}
                    </div>
                </div>
    
                {/* Image Upload */}
                <div>
                    <input type="file" id="img" className="sr-only" accept="image/*" multiple onChange={handleImageChange} />
                    <label htmlFor="img" className="block cursor-pointer bg-gray-100 py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
                        <Upload className="h-5 w-5 inline-block mr-2" /> Upload Images
                    </label>
                    <p className="text-xs text-gray-500 mt-2 italic">Max 5 images</p>
                    <div className="mt-2 grid grid-cols-5 gap-2">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img src={preview} alt="Preview" className="w-20 h-20 rounded-md object-cover border border-gray-300" />
                                <button
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
    
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
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