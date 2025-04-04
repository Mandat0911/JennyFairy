import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../Store/Zustand/cartStore';
import useCouponStore from '../../Store/Zustand/coupon';
import { useAppliedCoupon } from '../../Store/API/Coupon.API';
import toast from 'react-hot-toast';
import { useCreateSessionCheckoutPaypal } from '../../Store/API/Payment.API';

const Paypal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { cart, total, isCouponApplied } = useCartStore();
  const { coupon, setCoupon } = useCouponStore();
  const [subjectCode, setSubjectCode] = useState("");
  const [copied, setCopied] = useState(false); // Track copy status
  const { mutate: createCheckoutPaypal } = useCreateSessionCheckoutPaypal();
  const { mutateAsync: appliedCoupon } = useAppliedCoupon();
  const [priceUSD, setPriceUSD] = useState(null);
  const paypalName = import.meta.env.VITE_PAYPAL_NAME;

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleConfirmPayment = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.address) {
      toast.error("Please fill in all required shipping details!");
      return;
    }

    setLoading(true);

    try {
      if (coupon?.code) {
        await appliedCoupon({ code: coupon.code }); // Ensure coupon is applied first
      }

      createCheckoutPaypal(
        {
          products: cart,
          couponCode: coupon?.code || null,
          couponDiscountPercentage: coupon?.discountPercentage || 0,
          shippingDetails,
          totalAmount: total,
          Code: subjectCode,
        },
        {
          onSuccess: () => {
            setLoading(false);
            navigate("/products");
          },
          onError: (error) => {
            setLoading(false);
            toast.error(error.message || "Something went wrong!");
          },
        }
      );
    } catch (error) {
      setLoading(false);
      console.error("Error in handleConfirmPayment:", error.message);
    }
  };

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

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/VND");
        const data = await response.json();
        const exchangeRate = data.rates.USD; // VND to USD rate
        setPriceUSD((total * exchangeRate).toFixed(2));
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, [total]);

  const handleCopy = () => {
    navigator.clipboard.writeText(subjectCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Revert to "Copy" after 2 seconds
  };

  const paypalMeUrl = `https://www.paypal.com/paypalme/${paypalName}/${priceUSD}`;
  const qrCodeImage = `https://quickchart.io/qr?text=${encodeURIComponent(paypalMeUrl)}&size=300`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 uppercase tracking-wider text-center">
        Scan to Pay
      </h3>

      <p className="text-gray-600 text-sm mb-4">
        Scan the QR code with your camera to complete your payment.
      </p>

      {/* QR Code Image */}
      <div className="flex justify-center mb-6">
          <a 
              href={qrCodeImage} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  
                  const paypalWebUrl = `https://www.paypal.com/paypalme/${paypalName}/${priceUSD}`;
                  const paypalAppUrl = `paypal://send?recipient=${paypalName}&amount=${priceUSD}&currencyCode=USD`; 

                  if (/Android/i.test(navigator.userAgent)) {
                      window.location.href = paypalAppUrl; // Tries to open the PayPal app
                      setTimeout(() => {
                          window.location.href = paypalWebUrl; // If the app is not installed, fallback to the web
                      }, 1000);
                  } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                      window.location.href = paypalWebUrl; // iOS handles deep linking through the web URL
                  } else {
                      window.open(paypalWebUrl, "_blank"); // Open PayPal in a new tab for desktop users
                  }
              }}
            >
            <img 
                src={qrCodeImage} 
                alt="PayPal QR Code" 
                className="w-40 h-40 border rounded-lg shadow-md" 
            />
          </a>
        </div>
        <p className="text-center text-gray-600 text-sm mt-2">
            Price: ${priceUSD} USD
        </p>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Enter your full name"
            value={shippingDetails.fullName}
            onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            placeholder="Enter your phone number"
            value={shippingDetails.phone}
            onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Street address"
            value={shippingDetails.address}
            onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              placeholder="City"
              value={shippingDetails.city}
              onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              placeholder="Postal Code"
              value={shippingDetails.postalCode}
              onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            placeholder="Country"
            value={shippingDetails.country}
            onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        </div>

        {/* Subject Code Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            Code <span className="text-red-500 ml-1">*</span>
            <span className="ml-2 text-xs text-gray-500">(Please paste this code into description)
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={subjectCode}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800 cursor-default"
            />
            <button
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium transition ${
                copied ? "text-black-600" : "text-gray-500 hover:text-black"
              }`}
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {isCouponApplied ? (
          <p className="text-green-600 text-sm font-medium text-center">✅ Coupon Applied Successfully!</p>
        ) : (
          <input
            readOnly
            placeholder="Coupon Code (Optional)"
            value={coupon.code}
            onChange={(e) => setCoupon({ code: e.target.value })}
            className="w-full px-4 py-3 border bg-gray-100 border-gray-300 text-gray-800 cursor-default rounded-md focus:outline-none focus:ring-1 focus:ring-black transition"
          />
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        <span className="font-semibold">Notice:</span> If you are outside of Vietnam, please ensure all fields are correctly filled.
      </p>

      <button
        onClick={handleConfirmPayment}
        className="mt-6 w-full bg-black text-white py-3 rounded-md text-sm font-medium uppercase tracking-wider transition duration-300 hover:bg-gray-900 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Paypal;
