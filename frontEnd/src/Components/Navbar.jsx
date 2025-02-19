import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { useAuthStore } from "../Store/authStore";
import {Link} from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
	const {user, account, logout } = useAuthStore();
	const isAdmin = account?.userType === "ADMIN";
	// const { cart } = useCartStore();

    const handleLogout = () => {
		logout();
	};

	return (
		<header className='fixed top-0 left-0 w-full bg-white bg-opacity-80 backdrop-blur-lg shadow-lg z-50 transition-all duration-300 border-b border-pink-200'>
        <div className='container mx-auto px-6 py-4'>
				<div className='flex flex-wrap justify-between items-center'>
                <Link to='/' className='text-3xl font-extrabold text-pink-500 tracking-wide flex items-center space-x-2'>
        JennyFairy
      </Link>

					<nav className='flex flex-wrap items-center gap-4'>
						<Link
							to={"/"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300
					 ease-in-out'
						>
							Home
						</Link>
						{user && (
							<Link
								to={"/cart"}
								className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
								<span className='hidden sm:inline'>Cart</span>
								{/* {cart.length > 0 && ( */}
									<span
										className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										{/* {cart.length} */}
									</span>
								{/* )} */}
							</Link>
						)} 
						{isAdmin && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center'
								to={"/admin-dashboard"}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}

						{user ? (
                        <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        >
                            <motion.button whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className='w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                                 rounded-lg flex items-center shadow-lg hover:from-green-600 hover:to-emerald-700
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline ml-2">Log Out</span>
                                
                            </motion.button>
                        </motion.div>
							
						 ) : ( 
							<>
								<Link
									to={"/signup"}
									className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
							</>
						 )} 
					</nav>
				</div>
			</div>
		</header>
	);
};
export default Navbar;