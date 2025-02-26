import React, { useState } from "react";
import { useGetCollectionDetail } from "../../Store/API/Collection.API.js";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CollectionDetail = () => {
  const { data: collectionDetail, isLoading, error } = useGetCollectionDetail();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load collection.</p>;
  if (!collectionDetail?.img?.length) return <p className="text-center text-gray-500">No images available.</p>;

  const images = collectionDetail.img;

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  return (
    <motion.section 
      className="relative w-full max-w-6xl mx-auto bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Image Carousel */}
      <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentIndex]} 
            src={images[currentIndex]}
            alt={collectionDetail.name} 
            className="w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/10 hover:bg-black/30 text-white p-3 rounded-full transition"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/10 hover:bg-black/30 text-white p-3 rounded-full transition"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Collection Info */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-20 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-light tracking-widest text-white uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {collectionDetail.name}
        </motion.h1>

        <motion.p 
          className="mt-4 text-lg md:text-xl max-w-2xl text-white bg-white/10 p-4 rounded-md backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
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
            className={`w-3 h-3 rounded-full transition ${index === currentIndex ? "bg-white" : "bg-gray-400/50"}`}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default CollectionDetail;

// import React, { useState } from "react";
// import { useGetCollectionDetail } from "../../Store/API/Collection.API.js";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const CollectionDetail = () => {
//   const { data: collectionDetail, isLoading, error } = useGetCollectionDetail();
//   const [currentIndex, setCurrentIndex] = useState(0);

//   if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">Failed to load collection.</p>;
//   if (!collectionDetail?.img?.length) return <p className="text-center text-gray-500">No images available.</p>;

//   const images = collectionDetail.img;

//   // Navigation Handlers (Fix: Correctly loop through images)
//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
//   };

//   return (
//     <motion.div
//       className="relative w-full max-w-7xl mx-auto overflow-hidden bg-white text-gray-900"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//     >
//       {/* Fullscreen Image Gallery */}
//       <div className="relative w-full h-[80vh] flex items-center justify-center bg-gray-100">
//         <AnimatePresence mode="wait">
//           <motion.img
//             key={images[currentIndex]}
//             src={images[currentIndex]}
//             alt={collectionDetail.name}
//             className="w-auto h-[80vh] object-cover"
//             initial={{ opacity: 0, scale: 1.05 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             transition={{ duration: 0.8 }}
//           />
//         </AnimatePresence>

//         {/* Left Navigation Button (Fix: Ensure event handler works) */}
//         <button 
//           onClick={prevSlide}
//           className="absolute left-6 bg-white p-3 rounded-full shadow-md hover:scale-105 transition flex items-center"
//         >
//           <ChevronLeft className="w-6 h-6 text-gray-800" />
//         </button>

//         {/* Right Navigation Button (Fix: Ensure event handler works) */}
//         <button 
//           onClick={nextSlide}
//           className="absolute right-6 bg-white p-3 rounded-full shadow-md hover:scale-105 transition flex items-center"
//         >
//           <ChevronRight className="w-6 h-6 text-gray-800" />
//         </button>
//       </div>

//       {/* Collection Info */}
//       <div className="text-center py-12 px-6 md:px-12">
//         <motion.h1
//           className="text-4xl md:text-5xl font-medium uppercase tracking-wide"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//         >
//           {collectionDetail.name}
//         </motion.h1>

//         <motion.p
//           className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-600 leading-relaxed"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.6 }}
//         >
//           {collectionDetail.description}
//         </motion.p>
//       </div>

//       {/* Thumbnails */}
//       <div className="flex justify-center gap-4 py-6">
//         {images.map((img, index) => (
//           <motion.img
//             key={index}
//             src={img}
//             alt="Collection Thumbnail"
//             className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition ${
//               index === currentIndex ? "border-black scale-105" : "border-gray-300 opacity-70 hover:opacity-100"
//             }`}
//             onClick={() => setCurrentIndex(index)}
//             whileHover={{ scale: 1.1 }}
//           />
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// export default CollectionDetail;

