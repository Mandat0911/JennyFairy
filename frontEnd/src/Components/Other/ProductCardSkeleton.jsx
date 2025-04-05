import React from 'react'

const ProductCardSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-60 sm:h-72 md:h-96 bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-3 sm:p-4 text-center space-y-2">
        {/* Title */}
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mx-auto" />

        {/* Price */}
        <div className="flex justify-center gap-2 mt-2">
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton