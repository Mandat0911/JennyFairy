import { motion } from "framer-motion";
import React, { useState } from "react";
import Input from "../../Components/Input";
import { ArrowLeft, Loader, Mail, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden mx-4 sm:mx-auto"
		>
			<div className="p-6 sm:p-10">
				<h2 className="text-3xl font-semibold text-center text-gray-900">
					Reset Password
				</h2>
				<p className="text-gray-500 text-center mt-2">
					Enter your email and we’ll send you a reset link.
				</p>

				{!isSubmitted ? (
					<form onSubmit={handleSubmit} className="mt-6 space-y-4">
						<Input
							icon={Mail}
							type="email"
							placeholder="Email Address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-lg
										shadow-md hover:bg-gray-800 transition duration-200"
							type="submit"
						>
							{isLoading ? <Loader className="size-6 animate-spin mx-auto" /> : "Send Reset Link"}
						</motion.button>
					</form>
				) : (
					<div className="text-center mt-6">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto"
						>
							<CheckCircle className="h-8 w-8 text-white" />
						</motion.div>
						<p className="text-gray-700 mt-4">
							If an account exists for <strong>{email}</strong>, you will receive a reset link shortly.
						</p>
					</div>
				)}
			</div>

			<div className="  py-4 flex justify-center">
				<Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm flex items-center">
					<ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
				</Link>
			</div>
		</motion.div>
	);
};

export default ForgotPasswordPage;
