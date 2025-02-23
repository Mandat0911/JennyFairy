import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader } from 'lucide-react';
import Input from '../../Components/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../Store/authStore';

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
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md md:max-w-lg bg-pink-400/30 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden mx-4 sm:mx-auto"
    >
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-pink-600 to-rose-800 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <Input
            icon={Mail}
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <div className="flex justify-end text-sm">
            <Link to="/forgot-password" className="text-pink-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          {error && <p className="text-red-500 font-semibold">{error}</p>}
          <motion.button
            className="mt-3 w-full py-3 px-4 text-sm sm:text-base bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold rounded-lg shadow-lg hover:from-pink-500 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
          </motion.button>
        </form>
      </div>
      <div className="px-6 py-4 bg-gray-900/50 text-center">
        <p className="text-gray-300 text-sm">
          Don't have an account?{" "}
          <Link to="/signUp" className="text-pink-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
