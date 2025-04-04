import React, { useState } from "react";
import { useGetCollectionDetail } from "../../Store/API/Collection.API.js";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CollectionDetail = () => {
  const { data: collectionDetail, isLoading, error } = useGetCollectionDetail();

  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load collection.</p>;

  const images = collectionDetail?.img || [];
  if (!images.length) return <p className="text-center text-gray-500">No images available.</p>;

  const prevSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }
  };

  const nextSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }
  };

  return (
    <motion.section 
      className="relative w-full max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Carousel */}
      <div className="relative mt-12 lg:mt-18 lg:rounded-2xl md:mt-18 w-full h-[80vh] md:h-[90vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentIndex]} 
            src={images[currentIndex]}
            alt={collectionDetail.name} 
            className="w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Navigation Buttons (Fixed) */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/10 hover:bg-black/30 text-white p-3 rounded-full transition z-10"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/10 hover:bg-black/30 text-white p-3 rounded-full transition z-10"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Collection Info */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-20 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-widest text-white uppercase"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease:"easeOut" }}
        >
          {collectionDetail.name}
        </motion.h1>

        <motion.p 
          className="mt-4 text-lg md:text-xl max-w-2xl text-white bg-white/10 p-4 rounded-md backdrop-blur-sm"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease:"easeOut" }}
        >
          {collectionDetail.description}
        </motion.p>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <div 
            key={index} 
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition cursor-pointer ${
              index === currentIndex ? "bg-white scale-125" : "bg-gray-400/50"
            }`}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default CollectionDetail;
