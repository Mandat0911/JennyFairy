import { useState } from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X, Shirt } from "lucide-react";
import { useAuthStore } from "../Store/authStore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const { user, account, logout } = useAuthStore();
    const isAdmin = account?.userType === "ADMIN";
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsOpen(false); // Close menu on logout
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white bg-opacity-80 backdrop-blur-lg shadow-md z-50 border-b border-gray-300">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    
                    {/* Logo */}
                    <Link to="/" className="text-2xl sm:text-3xl font-bold text-pink-500 tracking-wide">
                        JennyFairy
                    </Link>

                    {/* Hamburger Menu (Mobile & Tablet) */}
                    <button className="lg:hidden text-gray-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        <Link to="/products" className="flex items-center text-gray-600 hover:text-emerald-500 transition">
                            <Shirt size={22} className="mr-1" />
                            <span className="hidden sm:inline">Products</span>
                        </Link>
                        {user && (
                            <Link to="/cart" className="flex items-center text-gray-600 hover:text-emerald-500 transition">
                                <ShoppingCart size={22} className="mr-1"/>
                                <span className="hidden sm:inline">Cart</span>
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                to="/admin-dashboard"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center transition"
                            >
                                <Lock size={18} className="mr-2" />
                                <span>Dashboard</span>
                            </Link>
                        )}
                        {user ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md flex items-center shadow-md transition hover:from-green-600 hover:to-emerald-700"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline ml-2">Log Out</span>
                            </motion.button>
                        ) : (
                            <>
                                <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition">
                                    <UserPlus size={18} className="mr-2" />
                                    Sign Up
                                </Link>
                                <Link to="/login" className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition">
                                    <LogIn size={18} className="mr-2" />
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
                            className="lg:hidden mt-4 bg-white shadow-md rounded-lg p-4 space-y-4"
                        >
                            <Link
                                to="/products"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center text-gray-600 hover:text-emerald-500 transition"
                            >
                                <Shirt size={22} className="mr-2" />
                                Products
                            </Link>
                            {user && (
                                <Link
                                    to="/cart"
                                    onClick={() => setIsOpen(false)}  // Close menu on click
                                    className="flex items-center text-gray-600 hover:text-emerald-500 transition"
                                >
                                    <ShoppingCart size={22} className="mr-2" />
                                    Cart
                                </Link>
                            )}
                            {isAdmin && (
                                <Link
                                    to="/admin-dashboard"
                                    onClick={() => setIsOpen(false)}  // Close menu on click
                                    className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition"
                                >
                                    <Lock size={18} className="mr-2" />
                                    Dashboard
                                </Link>
                            )}
                            {user ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);  // Close menu on logout
                                    }}
                                    className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md flex items-center justify-center shadow-md hover:from-green-600 hover:to-emerald-700"
                                >
                                    <LogOut size={18} />
                                    <span className="ml-2">Log Out</span>
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsOpen(false)}  // Close menu on click
                                        className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md text-center"
                                    >
                                        Sign Up
                                    </Link>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}  // Close menu on click
                                        className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-center"
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Navbar;
