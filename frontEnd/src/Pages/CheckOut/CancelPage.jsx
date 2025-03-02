import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import toast from "react-hot-toast";

const CancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Payment was not completed. Please try again.");
    
    // Auto-redirect to homepage after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md bg-white p-8 shadow-lg rounded-lg text-center border border-gray-200">
        <XCircle className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
        <h2 className="text-2xl font-semibold text-gray-900 mt-4">Payment Canceled</h2>
        <p className="text-gray-600 mt-2 text-sm">
        Your payment was not completed. If this was an error, please try again 
        or contact customer support.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="block w-full py-3 text-sm font-medium uppercase tracking-wide text-white bg-black rounded-md hover:bg-gray-900 transition"
          >
            Back to Shop
          </Link>
          <p className="text-gray-400 text-sm mt-3">
         Redirecting to homepage in 5 seconds...
       </p>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
