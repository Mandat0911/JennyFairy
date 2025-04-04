import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import Input from "../../Components/Other/Input.jsx";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../Components/Other/PasswordStrengthMeter.jsx";
import { useAuthStore } from "../../Store/Zustand/authStore.js";

const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signUp, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password, fullName);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3,  ease: "easeOut"  }}
      style={{ willChange: "transform, opacity" }}
        className="w-full max-w-sm mt-10 sm:max-w-md md:max-w-lg bg-white border border-gray-200 shadow-xl rounded-xl mx-4 px-6 py-8 sm:px-10 sm:mx-auto"
        >
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900">
            Create an Account
          </h2>
          <p className="text-sm sm:text-base text-gray-500 text-center mt-2">
            Join us and explore the latest trends
          </p>

          {/* Form */}
          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            <Input
              icon={User}
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              icon={Mail}
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <PasswordStrengthMeter password={password} />

            {/* Sign Up Button */}
            <motion.button
              className="w-full mt-4 py-3 bg-gray-900 text-white font-medium text-lg rounded-lg shadow-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-gray-900 font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
      </motion.div>
  );
};

export default SignUpPage;
