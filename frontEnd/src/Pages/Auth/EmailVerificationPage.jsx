import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../../Store/authStore.js";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const [resendDisabled, setResendDisabled] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);

	const navigate = useNavigate();

    const{verifyEmail, checkAuth, resendVerificationEmail, error} = useAuthStore()
	const { user } = useAuthStore.getState(); // Get user email if stored

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		setIsVerifying(true);
	
		try {
			await verifyEmail(verificationCode);
			await checkAuth(); // Refresh authentication state
	
			// Get updated authentication state
			const { isAuthenticated, account } = useAuthStore.getState();
	
			if (isAuthenticated && account?.isVerified) {
				toast.success("Email verified successfully");
				setTimeout(() => navigate("/"), 100);
			} else {
				toast.error("Verification successful, but account status not updated. Try reloading.");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Error verifying email");
		}finally {
			setIsVerifying(false);
		}
	};

	const handleResendCode = async () => {
		if (!user?.email) {
			toast.error("No email found. Please sign up again.");
			return;
		}
	
		try {
			setIsResending(true); // Set separate loading state
			await resendVerificationEmail(user.email);
			toast.success("Verification code resent!");
			setResendDisabled(true);
			setTimeout(() => setResendDisabled(false), 30000);
		} catch (error) {
			toast.error(error.response?.data?.message || "Error resending code");
		} finally {
			setIsResending(false); // Reset loading state
		}
	};
	
	

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

	return (
		<div className='max-w-md w-full bg-pink-400/30 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-pink-400/30 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
			>
      			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 to-rose-800 bg-clip-text text-transparent'>
					Verify Your Email
				</h2>
				<p className='text-center text-white mb-6'>Enter the 6-digit code sent to your email address.</p>

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='flex justify-between'>
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => (inputRefs.current[index] = el)}
								type='text'
								maxLength='6'
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className='w-12 h-12 text-center text-2xl font-bold bg-rose-200 text-white border-2 border-pink-600 rounded-lg focus:border-rose-300 focus:outline-none'
							/>
						))}
					</div>
				
					{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
					
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type='submit'
						disabled={isVerifying || code.some((digit) => !digit)}
						className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-pink-300 to-rose-400 text-white font-bold rounded-lg
								shadow-lg hover:from-pink-500 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
								focus:ring-offset-gray-500 transition duration-200'
					>
						{isVerifying ? "Verifying..." : "Verify Email"}
					</motion.button>

					{/* Resend verification email button */}
					<motion.button
						whileHover={{ scale: resendDisabled || isResending ? 1.0 : 1.05 }}
						whileTap={{ scale: 0.95 }}
						type="button"
						onClick={handleResendCode}
						disabled={resendDisabled || isResending}
						className={`mt-3 w-full py-3 px-4 text-white font-bold rounded-lg shadow-lg transition duration-200 ${
							resendDisabled || isResending
								? "bg-gray-400 cursor-not-allowed"
								: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:ring-2 focus:ring-pink-500"
						}`}
					>
						{isResending ? "Resending..." : resendDisabled ? "Resend in 30s..." : "Resend Code"}
					</motion.button>
				</form>
			</motion.div>
		</div>
	);
};
export default EmailVerificationPage;