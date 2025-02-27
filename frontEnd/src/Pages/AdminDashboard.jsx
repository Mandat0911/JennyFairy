import { BarChart, PlusCircle, ShoppingBasket, Image, Ticket } from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import CreateProductForm from '../Components/Product/CreateProductForm.jsx';
import ProductList from '../Components/Product/ProductList.jsx';
import AnalyticsView from '../Components/Analytic/AnalyticsView.jsx';
import CreateCollectionForm from '../Components/Collection/CreateCollectionForm.jsx';
import CollectionList from '../Components/Collection/CollectionList.jsx';
import CouponList from '../Components/Coupon/CouponList.jsx';
import CreateCouponForm from '../Components/Coupon/CreateCouponForm.jsx';


const tabs = [
    {id: "create", label: "Create Product", icon: PlusCircle},
    {id: "products", label: "View Products", icon: ShoppingBasket},
    {id: "collections", label: "Create Collection", icon: PlusCircle},
    {id: "View collections", label: "View Collection", icon: Image},
    {id: "Coupon", label: "Coupon", icon: Ticket},
    {id: "analytics", label: "Analytics", icon: BarChart},
]
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("create");

  return (
    <div className='min-h-screen relative overflow-hidden'>
        <div className='relative z-10 container mx-auto px-4 py-16'>
            <motion.h1
                        className='mt-6 text-4xl font-bold mb-8 text-gray-800 text-center uppercase tracking-wide'
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Admin Dashboard
                    </motion.h1>
            <div className='flex flex-wrap justify-center gap-3 sm:gap-4 mb-8'>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 sm:px-6 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base 
                            ${
                            activeTab === tab.id
                            ? "bg-gray-800 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        <tab.icon className='mr-2 h-5 w-5' />
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>
                <AnimatePresence mode="wait">
                    {activeTab === "create" && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CreateProductForm />
                        </motion.div>
                    )}
                    
                    {activeTab === "products" && (
                        <motion.div
                            key="products"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductList />
                        </motion.div>
                    )}
                    {activeTab === "collections" && (
                        <motion.div
                            key="collections"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CreateCollectionForm />
                        </motion.div>
                    )}
                    {activeTab === "View collections" && (
                        <motion.div
                            key="View collections"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CollectionList />
                        </motion.div>
                    )}
                    {activeTab === "Coupon" && (
                        <motion.div
                            key="Coupon"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CreateCouponForm />
                        </motion.div>
                    )}
                    {activeTab === "analytics" && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AnalyticsView />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        
        </div>
      
    </div>
  )
}

export default AdminDashboard
