import { useState } from "react";
import {  Menu, X} from "lucide-react";
import { useAuthStore } from "../../Store/Zustand/authStore.js";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCartItems } from "../../Store/API/Cart.API.js";

const Navbar = () => {
    const { user, account, logout } = useAuthStore();
    const isAdmin = account?.userType === "ADMIN";
    const [isOpen, setIsOpen] = useState(false);
    const { data: cart} = useGetCartItems();

    const handleLogout = () => {
        logout();
        setIsOpen(false); // Close menu on logout
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md shadow-md z-50 border-b border-gray-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-wide uppercase">
                    JennyFairy
                </Link>

                {/* Hamburger Menu (Mobile & Tablet) */}
                <button className="lg:hidden text-gray-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-8 text-gray-700 font-medium">
                    <Link to="/products" className="hover:underline underline-offset-4 transition duration-300">
                        Products
                    </Link>
                    {user && (
                        <Link 
                        to="/cart" 
                        className="relative text-black tracking-wide text-sm hover:opacity-70 transition duration-300"
                    >
                        Cart
                        {cart?.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-black text-white rounded-full 
                            w-4 h-4 flex items-center justify-center text-xs font-medium shadow-md 
                            transition-all duration-300 ease-in-out">
                                {cart.length}
                            </span>
                        )}
                    </Link>
                    
                    )}
                    {isAdmin && (
                        <Link
                            to="/admin-dashboard"
                            className="bg-black text-white px-5 py-2 rounded-full transition duration-300 hover:bg-gray-800"
                        >
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
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center space-y-6 shadow-md"
                    >
                        <button className="absolute top-6 right-6 text-gray-700" onClick={() => setIsOpen(false)}>
                            <X size={32} />
                        </button>
                        <Link to="/products" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 hover:underline">Products</Link>
                        {user && (
                            <Link to="/cart" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 hover:underline">Cart</Link>
                        )}
                        {isAdmin && (
                            <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="px-5 py-2 bg-black text-white rounded-full">Dashboard</Link>
                        )}
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 bg-gray-800 text-white rounded-full transition duration-300 hover:bg-gray-700"
                            >
                                Log Out
                            </button>
                        ) : (
                            <>
                                <Link to="/signup" onClick={() => setIsOpen(false)} className="px-5 py-2 border border-gray-800 text-gray-800 rounded-full transition duration-300 hover:bg-gray-800 hover:text-white">Sign Up</Link>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="px-5 py-2 bg-gray-800 text-white rounded-full transition duration-300 hover:bg-gray-700">Login</Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
