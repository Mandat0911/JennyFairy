import React, { useState } from "react";
import { useGetProductDetail } from "../../Store/API/Product.API.js";
import LoadingSpinner from "../../Components/LoadingSpinner.jsx";
import { useAuthStore } from "../../Store/authStore.js";
import toast from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";


const ProductDetail = () => {
    const { isAuthenticated } = useAuthStore();
    const {selectedSize, setSelectedSize} = useState();
    const { data: productDetail, isLoading, error } = useGetProductDetail();
    const [selectedImage, setSelectedImage] = useState(0); // Track selected image
    const [swipeDirection, setSwipeDirection] = useState(null); // Track swipe direction

    const handleAddToCart = () => {
        if  (!isAuthenticated) {
            toast.error("Please login to add product to cart", {id: "login"});
            return;
        }else {
            // add to cart
            // addToCart(productDetail);
        }
    }

    const handleSwipe = (direction) => {
        // Set the correct swipe direction BEFORE updating the image index
        setSwipeDirection(direction);
        
        setSelectedImage((prev) => {
            if (direction === "left") {
                return (prev + 1) % productDetail.img.length;
            } else {
                return (prev - 1 + productDetail.img.length) % productDetail.img.length;
            }
        });
    };

    // Handle Swipe Gestures
    const handlers = useSwipeable({
        onSwipedLeft: () => handleSwipe("left"),
        onSwipedRight: () => handleSwipe("right"),
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    if (isLoading) return <LoadingSpinner />;
    if (error) return <p className="text-center text-red-500">{error.message}</p>;
    if (!productDetail) return <p className="text-center text-gray-500">Product not found.</p>;

    
    return (
        <div className="max-w-screen-xl mx-auto px-6 py-12 md:py-16 pt-20 grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            {/* Left: Image Gallery */}
            <div>
                {/* Main Image */}
                <div
                    {...handlers}
                    className="w-full h-96 md:h-[550px] bg-gray-100 rounded-lg overflow-hidden shadow-lg relative"
                >
                    <AnimatePresence mode="wait" custom={swipeDirection}>
                        <motion.img
                            key={selectedImage}
                            src={productDetail.img[selectedImage]}
                            alt="Main Product"
                            className="w-full h-full object-cover"
                            initial={{ x: swipeDirection === "left" ? "100%" : "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: swipeDirection === "left" ? "-100%" : "100%", opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    </AnimatePresence>

                    {/* Navigation Arrows (Visible on Desktop) */}
                    <button
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full 
                        hover:bg-black transition hidden md:block"
                        onClick={() => handleSwipe("right")}
                    >
                        ❮
                    </button>
                    <button
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full 
                        hover:bg-black transition hidden md:block"
                        onClick={() => handleSwipe("left")}
                    >
                        ❯
                    </button>
                </div>

                {/* Thumbnail List */}
                {productDetail.img?.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto md:justify-center">
                        {productDetail.img.map((image, index) => (
                            <button
                                key={index}
                                className={`w-20 md:w-24 h-20 md:h-24 rounded-md overflow-hidden border-2 ${
                                    selectedImage === index ? "border-black" : "border-gray-300"
                                } transition duration-300`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                        {productDetail.name}
                    </h1>
                    <p className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
    <span className="bg-gradient-to-r from-black-400 to-black-600 text-black px-3 py-1 rounded-md shadow-md">
        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(productDetail.price)}
    </span>
</p>


                    

                    {/* Category */}
        <p className="mt-2 text-gray-500 text-sm md:text-base">
            Category: <span className="text-gray-900 font-medium">{productDetail.category}</span>
        </p>
        {/* Sizes (if available) */}
        {productDetail.sizes && productDetail.sizes.length > 0 && (
            <div className="mt-4">
                <h3 className="text-gray-700 text-base md:text-lg font-medium">Select Size:</h3>
                <div className="flex gap-2 mt-2">
                    {productDetail.sizes.map((size, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 border rounded-md text-sm md:text-base transition 
                                ${selectedSize === size ? "border-black bg-gray-200" : "border-gray-400 hover:bg-gray-200"}`}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        )}
        {/* Description */}
        <p className="mt-4 mb-4 text-gray-700 text-base md:text-lg leading-relaxed">
                        {productDetail.description}
                    </p>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-auto">
            <button
                className="w-full md:w-64 py-3 text-lg font-semibold text-white bg-black rounded-md 
                        transition-all duration-300 hover:bg-gray-800 active:scale-95 focus:outline-none 
                        focus:ring-2 focus:ring-gray-600 tracking-wide"
                onClick={handleAddToCart}
            >
                ADD TO CART
            </button>
        </div>
            </div>
        </div>
    );
};

export default ProductDetail;
