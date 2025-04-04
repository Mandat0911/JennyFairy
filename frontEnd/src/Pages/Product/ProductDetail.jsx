import React, { useState } from "react";
import { useGetProductDetail } from "../../Store/API/Product.API.js";
import LoadingSpinner from "../../Components/Other/LoadingSpinner.jsx";
import { useAuthStore } from "../../Store/Zustand/authStore.js";
import toast from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAddItemToCart } from "../../Store/API/Cart.API.js";

const ProductDetail = () => {
    const { isAuthenticated, isCheckingAuth } = useAuthStore();
    const [selectedSize, setSelectedSize] = useState(null);
    const { data: productDetail, isLoading, error } = useGetProductDetail();
    const [selectedImage, setSelectedImage] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [sizeError, setSizeError] = useState(false);
    const {mutate: addToCart} = useAddItemToCart();

    const hasDiscount = productDetail?.discountPrice > 0 && productDetail?.discountPrice < productDetail?.price;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };


    const handleAddToCart = () => {
        if(!selectedSize){
            setSizeError(true);
            return;
        }
        if (!isAuthenticated && !isCheckingAuth) {
            toast.error("Please login to add product to cart", { id: "login" });
            console.log(isCheckingAuth)
            return;
        } else {
            // add to cart
            addToCart(
                {
                    productId : productDetail._id,
                    quantity: quantity,
                    size: selectedSize
                }, {
                    onSuccess: () =>{},
                    onError: () =>{},
                });
        }
    };

    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    // Decrease quantity function (minimum 1)
    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleSwipe = (direction) => {
        setSwipeDirection(direction);
        setSelectedImage((prev) => {
            if (direction === "left") {
                return (prev + 1) % productDetail.img.length;
            } else {
                return (prev - 1 + productDetail.img.length) % productDetail.img.length;
            }
        });
    };

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
            <div>
                <div {...handlers} className="w-full mt-4 h-96 md:h-[550px] bg-gray-100 rounded-lg overflow-hidden shadow-lg relative">
                    <AnimatePresence mode="wait" custom={swipeDirection}>
                        <motion.img
                            key={selectedImage}
                            src={productDetail.img[selectedImage]}
                            alt="Main Product"
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    </AnimatePresence>
                    <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black transition hidden md:block" onClick={() => handleSwipe("right")}>
                    <ChevronLeft className="w-7 h-7" />
                    </button>
                    <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black transition hidden md:block" onClick={() => handleSwipe("left")}>
                    <ChevronRight className="w-7 h-7" />
                    </button>
                </div>
                
                {productDetail.img?.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto md:justify-center">

                        {productDetail.img.map((image, index) => (
                            <button
                                key={index}
                                className={`w-20 md:w-24 h-20 md:h-24 rounded-md overflow-hidden border-2 ${selectedImage === index ? "border-black" : "border-gray-300"} transition duration-300`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between pb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">{productDetail.name}</h1>
                    {hasDiscount ? (
                        <div className="mt-2 flex items-center space-x-3">
                            
                            <span className="text-3xl md:text-4xl font-extrabold text-red-600">
                                {formatPrice(productDetail.discountPrice)}
                            </span>

                            <span className="text-lg md:text-xl text-gray-400 line-through">
                                {formatPrice(productDetail.price)}
                            </span>

                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
                                SALE
                            </span>
                        </div>
                    ) : (
                        <p className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                            {formatPrice(productDetail.price)}
                        </p>
                    )}
                    
                    <div className="mt-4 flex items-center gap-2">
                       {Array.isArray(productDetail.category) &&
                            productDetail.category.map((cat, index) => (
                                <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">
                                    {cat}
                                </span>
                        ))}
                    
                    </div>
                    {productDetail.sizes && productDetail.sizes.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-gray-700 text-base md:text-lg font-medium">Select Size:</h3>
                            <div className="flex gap-2 mt-2">
                                {productDetail.sizes.map((size, index) => (
                                    <button
                                        required
                                        key={index}
                                        className={`px-4 py-2 border rounded-md text-sm md:text-base transition ${selectedSize === size ? "border-black bg-gray-200" : "border-gray-400 hover:bg-gray-200"}`}
                                        onClick={() =>{
                                            setSelectedSize(size);
                                            setSizeError(false);
                                            }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {sizeError && <p className="text-red-500 text-sm mt-1">Please select a size before adding to cart.</p>}
                        </div>
                    )}
                    <div className="mt-4 mb-4 border-t border-gray-300 pt-6 max-w-3xl">
                        <h3 className="text-gray-800 text-lg md:text-xl font-semibold tracking-wide uppercase">Product Details</h3>
                        <p className="mt-3 text-gray-600 text-[15px] md:text-lg leading-relaxed md:leading-loose tracking-wide">
                            {productDetail.description}
                        </p>
                    </div>
                </div>
                {/* Quantity Selector */}
                <div className="mt-6 flex items-center space-x-4">
                        <button
                            className="px-3 py-2 text-lg font-semibold bg-gray-200 rounded-md hover:bg-gray-300 transition"
                            onClick={decreaseQuantity}
                        >
                            -
                        </button>
                        <span className="text-xl font-semibold">{quantity}</span>
                        <button
                            className="px-3 py-2 text-lg font-semibold bg-gray-200 rounded-md hover:bg-gray-300 transition"
                            onClick={increaseQuantity}
                        >
                            +
                        </button>
                    </div>

                {/* Floating Add to Cart Button (Only on Mobile) */}
                <div className="fixed bottom-0 left-0 right-0 p-4 border-gray-300 shadow-md md:static md:shadow-none md:border-0">
                    <button
                        className="w-full py-3 text-lg font-semibold text-white bg-black rounded-md 
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
