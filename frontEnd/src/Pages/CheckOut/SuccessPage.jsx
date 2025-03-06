import React, { useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { CheckCircleIcon } from "lucide-react";

import toast from "react-hot-toast";
import { useCheckSuccessStripe } from "../../Store/API/Payment.API";

const SuccessPage = () => {
  const {mutate: handleCheckoutSuccess} = useCheckSuccessStripe();
  const navigate = useNavigate();
  
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
        handleCheckoutSuccess(sessionId, {  
            onSuccess: () => {

                toast.success("Payment successful! Your cart has been cleared.");
            },
        });
    }

    setTimeout(() => {
        navigate('/products');
    }, 5000);
}, [navigate, handleCheckoutSuccess]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md bg-white p-8 shadow-lg rounded-lg text-center border border-gray-200">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
        <h2 className="text-2xl font-semibold text-gray-900 mt-4">Payment Successful</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Thank you for your order! You will receive a confirmation email shortly.
        </p>
        <div className="mt-6">
          <Link
            to="/products"
            className="block w-full py-3 text-sm font-medium uppercase tracking-wide text-white bg-black rounded-md hover:bg-gray-900 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
