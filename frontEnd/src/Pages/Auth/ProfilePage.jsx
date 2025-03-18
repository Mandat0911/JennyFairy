import React from "react";
import { User, Mail, Phone, ShoppingBag, Settings, MapPin, Star, Trash } from "lucide-react";

const ProfilePage = () => {
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    address: "123 Fashion St, New York, NY",
    membership: "Gold Member",
    orders: [
      { id: "001", date: "Feb 15, 2024", status: "Delivered", total: "$150.00" },
      { id: "002", date: "Jan 28, 2024", status: "Shipped", total: "$220.00" },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 md:px-10 lg:px-16">
      {/* Profile Section */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6">
        <User className="w-12 h-12 text-gray-700" />
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold uppercase tracking-wide">{user.name}</h2>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Mail className="w-5 h-5" /> {user.email}
          </p>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Phone className="w-5 h-5" /> {user.phone}
          </p>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <MapPin className="w-5 h-5" /> {user.address}
          </p>
          <p className="text-yellow-500 flex items-center gap-2 mt-2 font-semibold">
            <Star className="w-5 h-5" /> {user.membership}
          </p>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" /> Order History
        </h3>
        <ul className="bg-white p-4 rounded-xl shadow-md divide-y">
          {user.orders.map((order) => (
            <li key={order.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center">
              <span className="text-sm md:text-base">Order #{order.id} - {order.date}</span>
              <span className="text-gray-600 text-sm md:text-base">{order.status} - {order.total}</span>
            </li>
          ))}
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