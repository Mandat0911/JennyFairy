import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../Components/Other/Input.jsx";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../Store/Zustand/authStore.js";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		try {
			await resetPassword(token, password);

			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white border border-gray-200 shadow-xl rounded-xl mx-4 px-6 py-8 sm:px-10 sm:mx-auto"
			>

				{/* Header */}
				<h2 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-6">
					Reset Your Password
				</h2>

				{/* Error / Success Messages */}
				{error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
				{message && <p className="text-green-500 text-sm text-center mb-4">{message}</p>}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						icon={Lock}
						type="password"
						placeholder="New Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<Input
						icon={Lock}
						type="password"
						placeholder="Confirm New Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>

					{/* Submit Button */}
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="w-full py-3 px-4 bg-gray-900 text-white font-semibold text-lg rounded-lg
						shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500
						transition duration-200"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? "Resetting..." : "Set New Password"}
					</motion.button>
				</form>

				{/* Back to Login */}
				<p className="text-gray-500 text-sm text-center mt-4">
					Remembered your password?{" "}
					<span
						onClick={() => navigate("/login")}
						className="text-gray-800 font-semibold cursor-pointer hover:underline"
					>
						Log in
					</span>
				</p>
		</motion.div>
	);
};

export default ResetPasswordPage;
