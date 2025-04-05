import React from "react";

const ProductCardSkeleton = () => {
    return (
        <div className="relative w-full bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
            {/* Image Skeleton */}
            <div className="relative w-full h-60 sm:h-72 md:h-96 bg-gray-200" />

            {/* Text Skeletons */}
            <div className="p-3 sm:p-4 text-center">
                {/* Name placeholder */}
                <div className="h-4 sm:h-5 w-3/4 bg-gray-200 mx-auto rounded mb-3" />

                {/* Price placeholders */}
                <div className="flex items-center justify-center gap-2 mt-1">
                    <div className="h-4 sm:h-5 w-1/4 bg-gray-200 rounded" />
                    <div className="h-4 sm:h-5 w-1/4 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
