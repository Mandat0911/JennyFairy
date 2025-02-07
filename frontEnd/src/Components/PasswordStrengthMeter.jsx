import { Check, X } from 'lucide-react'
import React from 'react'

const PasswordCriteria = ({password}) => {
    const criteria = [
        {label: "At least 8 characters", passed: password.length >= 6},
        {label: "At least one uppercase letter", passed: /[A-Z]/.test(password)},
        {label: "At least one lowercase letter", passed: /[a-z]/.test(password)},
        {label: "At least one number", passed: /\d/.test(password)},
        {label: "At least one special character", passed: /[^A-Za-z0-9]/.test(password)}
    ]
    return (
        <div className='mt-2 space-y-1'>
            {criteria.map((criterion, idx) => (
                <div key={idx} className='flex items-center'>
                    {criterion.passed ? (<Check className='size-4 text-green-500 mr-2' />) : (<X className='size-4 text-gray-500 mr-2' />)}
                    
                    <span className={criterion.passed ? 'text-green-500' : "text-gray-400"}>{criterion.label}</span>
                </div>
            ))}

        </div>
        )
}


const PasswordStrengthMeter = ({ password }) => {
	const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 6) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};
	const strength = getStrength(password);

    const getColor = (strength) => {
        switch (strength) {
            case 1:
                return "bg-yellow-500";
            case 2:
                return "bg-blue-500";
            case 3:
                return "bg-green-500";
            case 4:
                return "bg-green-500";
            default:
                return "bg-gray-300";
        }
    }

    const getStrengthText = (strength) => {
        switch (strength) {
            case 0:
                return "Very Weak";
            case 1:
                return "Weak";
            case 2:
                return "Fair";
            case 3:
                return "Good";
            case 4:
                return "Very Good";
            default:
                return "Very Weak";
        }
    }
  return (
    <div className='mt-2'>
        <div className='flex justify-between items-center mb-1'>
				<span className='text-xs text-gray-400'>Password strength</span>
				<span className='text-xs text-gray-400'>{getStrengthText(strength)}</span>
			</div>

        <div className='flex space-x-1'>
            {[...Array(5)].map((_, idx) => (
                <div key={idx} className={`h-1 w-1/4 rounded-full transition duration-300 ${idx <= strength ? getColor(strength) : 'bg-gray-300'}`}></div>
            ))}
        </div>
        <PasswordCriteria password={password}/>
    </div>
  )
}

export default PasswordStrengthMeter