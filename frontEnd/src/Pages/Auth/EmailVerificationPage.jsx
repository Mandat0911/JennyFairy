import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../../Store/Zustand/authStore.js";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const [resendDisabled, setResendDisabled] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);

	const navigate = useNavigate();
	const { verifyEmail, checkAuth, isCheckingAuth, resendVerificationEmail, error } = useAuthStore();
	const user = useAuthStore((state) => state.user); // ✅ Reactively updates when Zustand state changes

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
			await checkAuth();
			const { isAuthenticated, account } = useAuthStore.getState();
			if (isAuthenticated && account?.isVerified) {
				toast.success("Email verified successfully");
				setTimeout(() => navigate("/"), 100);
			} else {
				toast.error("Verification successful, but account status not updated. Try reloading.");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Error verifying email");
		} finally {
			setIsVerifying(false);
		}
	};

	const handleResendCode = async () => {
		if (!user?.email) {
			toast.error("If no email found. Please reload page.");
			return;
		}

		console.log(user.email || null)

		try {
			setIsResending(true);
			await resendVerificationEmail(user?.email);
			toast.success("Verification code resent!");
			setResendDisabled(true);
			setTimeout(() => setResendDisabled(false), 30000);
		} catch (error) {
			toast.error(error.response?.data?.message || "Error resending code");
		} finally {
			setIsResending(false);
		}
	};

	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

	return (
		<div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md md:max-w-lg bg-white shadow-lg rounded-xl p-6 sm:p-8"
			>
				<h2 className="text-2xl font-semibold text-center text-gray-800">
					Email Verification
				</h2>
				<p className="text-center text-gray-600 mt-2">
					Enter the 6-digit code sent to your email.
				</p>

				<form onSubmit={handleSubmit} className="mt-6">
					<div className="flex justify-center gap-2 sm:gap-4">
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => (inputRefs.current[index] = el)}
								type="text"
								maxLength="6"
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
							/>
						))}
					</div>

					{error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						type="submit"
						disabled={isVerifying || code.some((digit) => !digit)}
						className="w-full mt-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
					>
						{isVerifying ? "Verifying..." : "Verify Email"}
					</motion.button>

					{/* Resend verification email button */}
					<motion.button
						whileHover={{ scale: resendDisabled || isResending ? 1.0 : 1.03 }}
						whileTap={{ scale: 0.97 }}
						type="button"
						onClick={handleResendCode}
						disabled={resendDisabled || isResending}
						className={`w-full mt-4 py-3 text-black font-semibold rounded-lg shadow-md transition ${
							resendDisabled || isResending
								? "bg-gray-300 cursor-not-allowed"
								: "border border-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-700"
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
