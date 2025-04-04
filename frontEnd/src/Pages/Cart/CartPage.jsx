import React from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useDeleteAllCartItem, useGetCartItems } from '../../Store/API/Cart.API.js';
import CartItem from '../../Components/Cart/CartItem.jsx';
import GiftCouponCard from '../../Components/Coupon/GiftCouponCard.jsx';
import OrderSummary from '../../Components/Other/OrderSummary.jsx';
import PeopleAlsoBought from '../../Components/Other/PeopleAlsoBought.jsx';

const CartPage = () => {
    const { data: cart } = useGetCartItems();
    const {mutate: clearAllItems} = useDeleteAllCartItem();

	const handleClearAll = (e) => {
		e.preventDefault();
        clearAllItems();
		
	}

    return (
        <div className='py-12 bg-gray-50'>
            <div className='mx-auto mt-10 max-w-6xl px-6 lg:px-12'>
                <h1 className='text-3xl font-semibold tracking-tight text-gray-900 border-b pb-4 mb-2'>Shopping Cart</h1>
                {cart?.length > 0 && (
					<button 
                    onClick={handleClearAll}
                    className="flex items-center justify-center gap-1 rounded-none border border-black bg-transparent px-4 py-1 text-xs font-medium uppercase tracking-wide text-black transition-all hover:bg-black hover:text-white focus:outline-none focus:ring-1 focus:ring-black"
                >
                    <Trash2 className="w-3 h-3" />
                    Clear
                </button>
                
				)}  
				
				<div className='flex flex-col lg:flex-row gap-12'>
					
                    <motion.div
                        className='w-full lg:w-2/3 space-y-8'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
						
                        {cart?.length === 0 ? (
                            
                            <EmptyCartUI />
                        ) : (
                            <div className='divide-y divide-gray-200'>
                                {cart?.map((item) => (
                                    <CartItem key={`${item.productId}-${item.size}`} item={item} />
                                ))}
                            </div>
                        )}
                        {cart?.length > 0 && (
                            <div className="hidden lg:block">
                                <PeopleAlsoBought />
                            </div>
                        )}
                    </motion.div>

                    {cart?.length > 0 && (
                        <motion.div
                            className='w-full lg:w-1/3 space-y-6'
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <GiftCouponCard />
                            <OrderSummary />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default CartPage;

const EmptyCartUI = () => (
    <motion.div
        className='flex flex-col items-center justify-center space-y-6 py-24 text-center'
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }} 
        style={{ willChange: "transform, opacity" }} 
    >
        <ShoppingCart className='h-20 w-20 text-gray-300' />
        <h3 className='text-xl font-medium text-gray-800'>Your shopping bag is empty</h3>
        <p className='text-gray-500 text-sm'>Discover the latest collections and add your favorite pieces.</p>
        <Link
            className='mt-4 text-sm font-medium uppercase tracking-wide border border-gray-900 px-6 py-2 text-gray-900 transition hover:bg-gray-900 hover:text-white'
            to='/products'
        >
            Shop Now
        </Link>
    </motion.div>
);
