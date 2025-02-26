import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader } from 'lucide-react';
import Input from '../../Components/Other/Input.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../Store/Zustand/authStore.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white border border-gray-200 shadow-xl rounded-xl mx-4 px-6 py-8 sm:px-10 sm:mx-auto"
    >
      {/* Title */}
      <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6 sm:mb-8">
        Welcome Back
      </h2>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
        <Input
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <Input
          icon={Lock}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-gray-600 text-sm hover:text-gray-900">
            Forgot password?
          </Link>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <motion.button
          className="w-full py-3 px-4 text-lg bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 transition duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
        </motion.button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center mt-6 text-gray-600 text-sm">
        Don't have an account?{" "}
        <Link to="/signUp" className="text-gray-900 font-semibold hover:underline">
          Sign Up
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginPage;
