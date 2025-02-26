import React from 'react'
import { Link } from 'react-router-dom'

const CollectionCard = ({collection}) => {
  return (
    <div className="relative overflow-hidden w-full rounded-lg group h-48 sm:h-56 md:h-84 lg:h-96" // Adjust height dynamically
    >
        <Link to={`/collection/${collection._id}`}>
            <div className="w-full h-full cursor-pointer">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-600 opacity-50 z-10" />

                {/* Image */}
                <img
                    src={collection.img[0]}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    loading="lazy"
                />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-white text-2xl font-bold mb-2">{collection.name}</h3>
                    <p className="text-gray-200 text-sm">Explore {collection.name}</p>
                </div>
            </div>
        </Link>
    </div>
);
}

export default CollectionCard
