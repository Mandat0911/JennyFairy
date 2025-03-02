import React, { useState } from "react";
import toast from "react-hot-toast";

const COD = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const handleConfirmOrder = () => {
        if (!name || !address || !phone) {
            toast.error("Please fill in all required fields.", {id: "COD"});
            return;
        }
        alert(`Order placed successfully! Pay cash on delivery.\n\nName: ${name}\nAddress: ${address}\nPhone: ${phone}`);
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-wide">Cash on Delivery</h3>
            
            <p className="text-gray-600 text-sm mb-6">
                Enter your details to proceed with Cash on Delivery.
            </p>

            {/* Input Fields */}
            <div className="space-y-4">
                <input 
                    required
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input 
                    required
                    type="text"
                    placeholder="Delivery Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input 
                    required
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            {/* Confirm Order Button */}
            <button 
                onClick={handleConfirmOrder}
                className="mt-6 w-full bg-black text-white py-3 rounded-md text-sm font-medium uppercase tracking-wider transition duration-300 hover:bg-gray-900"
            >
                Confirm Order
            </button>
        </div>
    );
};

export default COD;
