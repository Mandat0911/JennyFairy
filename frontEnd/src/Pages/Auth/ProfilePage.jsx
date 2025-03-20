import React from "react";
import { User, Mail, Phone, ShoppingBag, Settings, MapPin, Star, Trash } from "lucide-react";
import { useGetUserProfile } from "../../Store/API/Auth.API";
import { formatDate } from "../../Utils/Date";

const ProfilePage = () => {

  const {data: userData} = useGetUserProfile();
  console.log(userData)


  return (
    <div className="max-w-3xl mx-auto py-10 px-6 md:px-10 lg:px-16">
      {/* Profile Section */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6">
        <User className="w-12 h-12 text-gray-700" />
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold uppercase tracking-wide">{userData?.user.name}</h2>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Mail className="w-5 h-5" /> {userData?.user.email}
          </p>

        </div>
      </div>

      {/* Order History */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" /> Order History
        </h3>
        <ul className="bg-white p-4 rounded-xl shadow-md divide-y">
<ul className="bg-white p-4 rounded-xl shadow-md divide-y">
  {userData?.orders.map((order) => (
    <li key={order.id} className="py-4">
      {/* Order Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm md:text-base font-semibold">
          Order #{order.id} - {formatDate(order.createdAt)}
        </span>
        <span className="text-gray-600 text-sm md:text-base">
          {order.shippingDetails.deliveryStatus} - {order.totalAmount}
        </span>
      </div>

      {/* Order Products */}
      <div className="space-y-3">
        {order?.products.map((product) => (
          <div key={product._id} className="flex items-center gap-4">
            {/* Product Image */}
            <img 
              src={product?.product?.img[0]} 
              alt={product?.product?.name} 
              className="w-16 h-16 object-cover rounded-lg"
            />

            {/* Product Details */}
            <div>
              <p className="text-sm md:text-base font-medium">{product?.product?.name}</p>
              <p className="text-gray-600 text-sm">Quantity: {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </li>
  ))}
</ul>


        </ul>
      </div>

      {/* Account Settings */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button className="flex items-center justify-center gap-2 px-5 py-3 w-full md:w-auto bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm md:text-base">
          <Settings className="w-5 h-5" /> Edit Profile
        </button>
        <button className="flex items-center justify-center gap-2 px-5 py-3 w-full md:w-auto bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm md:text-base">
          <Trash className="w-5 h-5" /> Delete account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;