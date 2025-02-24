import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center">
      <motion.div
        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-4 sm:border-6 border-t-4 sm:border-t-6 
                   border-gray-400 border-t-gray-900 rounded-full shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;
