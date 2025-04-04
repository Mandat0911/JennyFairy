import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../../Store/Zustand/authStore.js";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCartItems } from "../../Store/API/Cart.API.js";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const Navbar = () => {
    const { user, account, logout } = useAuthStore();
    const isAdmin = ["ADMIN", "MANAGER"].includes(account?.userType);
    const [isOpen, setIsOpen] = useState(false);
    const { data: cart } = useGetCartItems();

    const handleLogout = () => {
        logout();
        setIsOpen(false); // Close menu on logout
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md shadow-md z-50 border-b border-gray-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-wide uppercase">
                    <img
                        src="\Logo\NavbarLogo.svg"
                        alt="JennyFairy Logo"
                        width="200"
                        height="75"
                        className="h-12 w-auto object-contain"
                    />
                </Link>

                {/* Hamburger Menu */}
                <button className="lg:hidden text-gray-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-6 text-gray-700 font-medium">
                    <Link to="/" className="hover:underline underline-offset-4 transition duration-300">Home</Link>
                    <Link to="/products" className="hover:underline underline-offset-4 transition duration-300">Products</Link>

                    {user && (
                        <Link to="/cart" className="relative text-black tracking-wide text-sm hover:opacity-70 transition duration-300">
                            Cart
                            {cart?.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium shadow-md transition-all duration-300 ease-in-out">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                    )}

                    {user && (
                        <Link to="/profile" className="relative text-black tracking-wide text-sm hover:opacity-70 transition duration-300">
                            Profile
                        </Link>
                    )}
                    
                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        <a href="https://www.instagram.com/jennyfairy_feminine/" target="_blank" rel="noopener noreferrer" title="Instagram" className="text-gray-700 hover:text-pink-600 transition">
                            <FaInstagram size={22} />
                        </a>
                        <a href="https://www.tiktok.com/@jennyfairy.feminine?lang=vi-VN" target="_blank" rel="noopener noreferrer" title="TikTok" className="text-gray-700 hover:text-black transition">
                            <FaTiktok size={22} />
                        </a>
                    </div>

                    {isAdmin && (
                        <Link to="/admin-dashboard" className="bg-black text-white px-5 py-2 rounded-full transition duration-300 hover:bg-gray-800">
                            Dashboard
                        </Link>
                    )}


                    {user ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="px-5 py-2 bg-gray-800 text-white rounded-full transition duration-300 hover:bg-gray-700"
                        >
                            Log Out
                        </motion.button>
                    ) : (
                        <>
                            <Link to="/signup" className="px-5 py-2 border border-gray-800 text-gray-800 rounded-full transition duration-300 hover:bg-gray-800 hover:text-white">
                                Sign Up
                            </Link>
                            <Link to="/login" className="px-5 py-2 bg-gray-800 text-white rounded-full transition duration-300 hover:bg-gray-700">
                                Login
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center space-y-6 shadow-md z-40"
                    >
                        <button className="absolute top-6 right-6 text-gray-700" onClick={() => setIsOpen(false)}>
                            <X size={32} />
                        </button>
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 hover:underline">Home</Link>
                        <Link to="/products" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 hover:underline">Products</Link>

                        {user && (
                            <Link to="/cart" onClick={() => setIsOpen(false)} className="relative text-lg font-medium text-gray-800 hover:underline">
                                Cart
                                {cart?.length > 0 && (
                                    <span className="absolute -top-1 -right-5 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shadow-md transition-all duration-300 ease-in-out">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        {user && (
                            <Link to="/profile" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 hover:underline">Profile</Link>
                        )}
                        {isAdmin && (
                            <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="px-5 py-2 bg-black text-white rounded-full">Dashboard</Link>
                        )}

                        {user ? (
                            <button onClick={handleLogout} className="px-5 py-2 bg-gray-800 text-white rounded-full transition duration-300 hover:bg-gray-700">
                                Log Out
                            </button>
                        ) : (
                            <>
                                <Link to="/signup" onClick={() => setIsOpen(false)} className="px-5 py-2 border border-gray-800 text-gray-800 rounded-full transition duration-300 hover:bg-gray-800 hover:text-white">Sign Up</Link>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="px-5 py-2 bg-gray-800 text-white rounded-full transition duration-300 hover:bg-gray-700">Login</Link>
                            </>
                        )}

                        {/* Mobile Social Icons */}
                        <div className="flex gap-6 mt-2">
                            <a href="https://www.instagram.com/jennyfairy_feminine/" target="_blank" rel="noopener noreferrer" title="Instagram" className="text-gray-700 hover:text-pink-600 transition">
                                <FaInstagram size={26} />
                            </a>
                            <a href="https://www.tiktok.com/@jennyfairy.feminine?lang=vi-VN" target="_blank" rel="noopener noreferrer" title="TikTok" className="text-gray-700 hover:text-black transition">
                                <FaTiktok size={26} />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
