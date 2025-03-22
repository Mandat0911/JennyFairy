import React, { useState } from "react";
import OrderSummary from "../../Components/Other/OrderSummary";
import Stripe from "../../Components/PaymentMethod/Stripe";
import QRCode from "../../Components/PaymentMethod/QRCode";
import COD from "../../Components/PaymentMethod/COD";
import PaymentMethod from "../../Components/PaymentMethod/PaymentMethod";
import GiftCouponCard from "../../Components/Coupon/GiftCouponCard";
import Paypal from "../../Components/PaymentMethod/Paypal";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("paypal");

  return (
    <div className="max-w-4xl mx-auto my-12 bg-white p-10 shadow-lg rounded-xl">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold text-center uppercase tracking-wide text-gray-900 mb-8">
        Checkout
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Order Summary */}
        <div className=" items-center border-gray-300 =">
          <h3 className="text-lg font-medium text-gray-800 mb-4 tracking-wider">Order Summary</h3>
          <div className="mb-2">
            <OrderSummary />
            </div>
          <GiftCouponCard  />
        </div>
        
        {/* Right: Payment Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4 tracking-wider">Payment Method</h3>
          <PaymentMethod onChange={setPaymentMethod} selected={paymentMethod} />

          <div className="mt-6  border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
            {paymentMethod === "stripe" && <Stripe />}
            {paymentMethod === "paypal" && <Paypal />}
            {paymentMethod === "qrcode" && <QRCode />}
            {paymentMethod === "cod" && <COD />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
