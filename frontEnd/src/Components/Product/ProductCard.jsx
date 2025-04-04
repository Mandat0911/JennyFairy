import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

    return (
        <Link to={`/product/${product._id}`}>
            <div className="relative group w-full bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105">
                {/* Product Image */}
                <div className="relative w-full h-60 sm:h-72 md:h-96 overflow-hidden">
                    <img
                        src={product.img[0]}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:opacity-80 transition"
                        loading="lazy"
                    />

                    {/* Sale Badge */}
                    {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            Sale
                        </span>
                    )}
                </div>

                {/* Product Details */}
                <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-md sm:text-lg font-medium text-gray-900 tracking-wide truncate">
                        {product.name}
                    </h3>

                    {/* Pricing Section */}
                    <div className="flex items-center justify-center gap-2 mt-1">
                        {hasDiscount ? (
                            <>
                                <span className="text-lg sm:text-xl font-semibold text-red-600">
                                    {formatPrice(product.discountPrice)}
                                </span>
                                <span className="text-sm sm:text-md text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-sm sm:text-md text-gray-500">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
