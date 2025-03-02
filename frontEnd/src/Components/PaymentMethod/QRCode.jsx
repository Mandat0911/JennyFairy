import React, { useState, useEffect } from "react";
import useCartStore from "../../Store/Zustand/cartStore";
import { useAuthStore } from "../../Store/Zustand/authStore";

const QRCode = () => {
    
    const [amount] = useState("");
    const [reference, setReference] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [copied, setCopied] = useState(false); // Track copy status
    const {total} = useCartStore();
    const {user} = useAuthStore();
    const [name, setName] = useState(user.name);

    const qrCodeImage = "/path-to-your-bank-qrcode.png"; // Replace with your actual QR code image URL

    // Function to generate a random 6-character alphanumeric code
    const generateSubjectCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    };

    // Generate subject code on component mount
    useEffect(() => {
        setSubjectCode(generateSubjectCode());
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(subjectCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Revert to "Copy" after 2 seconds
    };

    const handleConfirmPayment = () => {
        if (!name) {
            alert("Please fill in all required fields.");
            return;
        }
        alert(`Payment Details:\n\nName: ${name}\nAmount: ${amount}\nReference: ${reference}\nSubject Code: ${subjectCode}\n\nScan the QR code and enter the Subject Code in your banking transaction for confirmation.`);
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-wide uppercase">Scan to Pay</h3>
            
            <p className="text-gray-600 text-sm mb-4">
                Scan the QR code with your banking app to complete your payment.
            </p>

            {/* QR Code Image */}
            <div className="flex justify-center mb-6">
                <img src={qrCodeImage} alt="QR Code" className="w-40 h-40 border rounded-lg shadow-md" />
            </div>

            {/* Input Fields */}
            <div className="space-y-4 text-left">
                <input 
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input 
                    type="number"
                    placeholder="Payment Amount"
                    value={total}
                    readOnly  // Prevents user input
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800 cursor-not-allowed focus:outline-none"
                />


                <input 
                    type="text"
                    placeholder="Reference Note (Optional)"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />

                {/* Subject Code Field */}
                <div className="relative">
                    <input 
                        type="text"
                        value={subjectCode}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800 cursor-default"
                    />
                    <button 
                        className={`absolute right-3 top-2 text-sm font-medium transition ${
                            copied ? "text-green-600" : "text-gray-500 hover:text-black"
                        }`}
                        onClick={handleCopy}
                    >
                        {copied ? "✅ Copied!" : "📋 Copy"}
                    </button>
                </div>
                <p className="text-xs text-gray-500">Use this code in your bank transaction description for confirmation.</p>
            </div>

            {/* Confirm Payment Button */}
            <button 
                onClick={handleConfirmPayment}
                className="mt-6 w-full bg-black text-white py-3 rounded-md text-sm font-medium uppercase tracking-wider transition duration-300 hover:bg-gray-900"
            >
                Confirm Payment
            </button>
        </div>
    );
};

export default QRCode;
