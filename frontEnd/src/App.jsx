import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './Store/Zustand/authStore.js';

import FloatingShape from './Components/Other/FloatingShape.jsx';
import LoadingSpinner from './Components/Other/LoadingSpinner.jsx';
import SignUpPage from './Pages/Auth/SignUpPage';
import LoginPage from './Pages/Auth/LoginPage';
import EmailVerificationPage from './Pages/Auth/EmailVerificationPage.jsx';
import DashBoardPage from './Pages/DashBoardPage.jsx';
import ForgotPasswordPage from './Pages/Auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './Pages/Auth/ResetPasswordPage.jsx';
import Navbar from './Components/Other/Navbar.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import ProductPage from './Pages/Product/ProductPage.jsx';
import ProductDetail from './Pages/Product/ProductDetail.jsx';
import CollectionDetail from './Pages/Collection/CollectionDetail.jsx';
import CartPage from './Pages/Cart/CartPage.jsx';

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, account, isCheckingAuth } = useAuthStore();
    if (isCheckingAuth) return <LoadingSpinner />;
    if (isAuthenticated && account?.isVerified) return <Navigate to="/" replace />;
    
    return children;
};

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, account, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!account?.isVerified) return <Navigate to="/verify-email" replace />;

    if(requiredRoles.length > 0 && !requiredRoles.includes(account?.userType)){
        return <Navigate to="/" replace />
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden'>
            <FloatingShape color="bg-pink-300" size="w-64 h-64" top="-5%" left="10%" delay={0} />
            <FloatingShape color="bg-rose-400" size="w-48 h-48" top="70%" left="80%" delay={5} />
            <FloatingShape color="bg-white" size="w-32 h-32" top="40%" left="-10%" delay={2} />
            <Navbar/>
            <Routes>
                <Route path="/" element={
                    //  <ProtectedRoute>
                        <DashBoardPage />
                         // </ProtectedRoute> 
                        } />
                <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
                <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
                <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />

                <Route path="/admin-dashboard" element={<ProtectedRoute requiredRoles={["MANAGER", "ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
                
                <Route path="/products" element={<ProductPage />} />
                <Route path="/product/:productId" element={<ProductDetail />} />

                <Route path="/Collection/:collectionId" element={<CollectionDetail/>} />

                
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <Toaster />
        </div>
    );
}

export default App;
