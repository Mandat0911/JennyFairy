import { Check, X } from "lucide-react";
import React from "react";

const PasswordCriteria = ({ password }) => {
	const criteria = [
		{ label: "At least 8 characters", passed: password.length >= 8 },
		{ label: "At least one uppercase letter", passed: /[A-Z]/.test(password) },
		{ label: "At least one lowercase letter", passed: /[a-z]/.test(password) },
		{ label: "At least one number", passed: /\d/.test(password) },
		{ label: "At least one special character", passed: /[^A-Za-z0-9]/.test(password) },
	];

	return (
		<div className="mt-3 space-y-2">
			{criteria.map((criterion, idx) => (
				<div key={idx} className="flex items-center space-x-2">
					{criterion.passed ? (
						<Check className="size-4 text-green-600" />
					) : (
						<X className="size-4 text-gray-400" />
					)}

					<span className={`text-sm font-medium ${criterion.passed ? "text-green-600" : "text-gray-500"}`}>
						{criterion.label}
					</span>
				</div>
			))}
		</div>
	);
};

const PasswordStrengthMeter = ({ password }) => {
	const getStrength = (password) => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
		if (password.match(/\d/)) strength++;
		if (password.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};

	const strength = getStrength(password);

	const getColor = (strength) => {
		switch (strength) {
			case 1:
				return "bg-red-500";
			case 2:
				return "bg-yellow-500";
			case 3:
				return "bg-green-500";
			case 4:
				return "bg-green-700";
			default:
				return "bg-gray-300";
		}
	};

	const getStrengthText = (strength) => {
		switch (strength) {
			case 1:
				return "Weak";
			case 2:
				return "Fair";
			case 3:
				return "Good";
			case 4:
				return "Strong";
			default:
				return "Very Weak";
		}
	};

	return (
		<div className="mt-4">
			{/* Strength Text */}
			<div className="flex justify-between items-center mb-2">
				<span className="text-sm font-medium text-gray-700">Password Strength</span>
				<span className={`text-sm font-semibold ${strength >= 3 ? "text-green-600" : "text-red-500"}`}>
					{getStrengthText(strength)}
				</span>
			</div>

			{/* Strength Bar */}
			<div className="flex space-x-1">
				{[...Array(4)].map((_, idx) => (
					<div
						key={idx}
						className={`h-1 w-1/4 rounded-full transition-all duration-300 ${
							idx < strength ? getColor(strength) : "bg-gray-300"
						}`}
					></div>
				))}
			</div>

			{/* Criteria */}
			<PasswordCriteria password={password} />
		</div>
	);
};

export default PasswordStrengthMeter;
