import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';

const Input = ({icon:Icon, type,...props}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className='relative mb-6'>
      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'> 
        <Icon className="size-5 text-pink-200"/>
      </div>
      <input 
        {...props}
        type={isPassword && showPassword ? 'text' : type}
        className='w-full pl-10 pr-3 py-2 bg-pink-600 bg-opacity-50 rounded-lg border border-pink-700 focus:border-pink-500 focus:ring-2
         focus:ring-pink-500 text-white placeholder-pink-100 transition duration-200'
      />
       {isPassword && (
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-pink-200"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" /> }
        </button>
      )}
    </div>
  )
  
  
}

export default Input