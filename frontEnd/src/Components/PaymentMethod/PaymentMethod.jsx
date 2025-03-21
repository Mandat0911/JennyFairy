const PaymentMethod = ({ onChange, selected }) => {
    return (
        <div className="flex justify-between gap-4">
            {[
                // { id: "stripe", label: "💳 Card Payment" },
                { id: "paypal", label: "💳 Paypal" },
                { id: "qrcode", label: "📷 QR Code" },
                { id: "cod", label: "🏠 Cash on Delivery" },
            ].map((method) => (
                <button
                    key={method.id}
                    className={`flex-1 py-3 text-sm md:text-base font-medium border border-gray-300 rounded-lg 
                    transition-all duration-300 ease-in-out tracking-wide
                    ${
                        selected === method.id
                            ? "bg-black text-white border-black shadow-md"
                            : "bg-white text-gray-800 hover:bg-gray-100"
                    }`}
                    onClick={() => onChange(method.id)}
                >
                    {method.label}
                </button>
            ))}
        </div>
    );
};

  
  export default PaymentMethod;
  