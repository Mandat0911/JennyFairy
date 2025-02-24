import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ icon: Icon, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative mb-5">
      {/* Left Icon */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Icon className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" />
      </div>

      {/* Input Field */}
      <input
        {...props}
        type={isPassword && showPassword ? 'text' : type}
        className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 bg-gray-50
          focus:border-gray-900 focus:ring-2 focus:ring-gray-900 
          text-gray-900 placeholder-gray-500 transition duration-200
          sm:py-4 sm:text-lg sm:pl-14"
      />

      {/* Password Toggle Button */}
      {isPassword && (
        <button
          type="button"
          className="absolute inset-y-0 right-4 flex items-center text-gray-400 sm:right-5"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye className="w-5 h-5 sm:w-6 sm:h-6" /> : <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
      )}
    </div>
  );
}

export default Input;
