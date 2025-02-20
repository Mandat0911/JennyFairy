import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './Store/authStore.js';

import FloatingShape from './Components/FloatingShape.jsx';
import LoadingSpinner from './Components/LoadingSpinner.jsx';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import EmailVerificationPage from './Pages/EmailVerificationPage.jsx';
import DashBoardPage from './Pages/DashBoardPage.jsx';
import ForgotPasswordPage from './Pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './Pages/ResetPasswordPage.jsx';
import Navbar from './Components/Navbar.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, account, isCheckingAuth } = useAuthStore();
    console.log(isAuthenticated, account, isCheckingAuth);
    if (isCheckingAuth) return <LoadingSpinner />;
    if (isAuthenticated && account?.isVerified) return <Navigate to="/" replace />;
    
    return children;
};

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, account, isCheckingAuth } = useAuthStore();
    console.log(isAuthenticated, account, isCheckingAuth);

    if (isCheckingAuth) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!account?.isVerified) return <Navigate to="/verify-email" replace />;

    if(requiredRoles.length > 0 && !requiredRoles.includes(account?.userType)){
        return <Navigate to="/unauthorized" replace/>
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
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-pink-200 to-rose-300 flex items-center justify-center relative overflow-hidden">
            <FloatingShape color="bg-pink-300" size="w-64 h-64" top="-5%" left="10%" delay={0} />
            <FloatingShape color="bg-rose-400" size="w-48 h-48" top="70%" left="80%" delay={5} />
            <FloatingShape color="bg-white" size="w-32 h-32" top="40%" left="-10%" delay={2} />
            <Navbar/>
            <Routes>
                <Route path="/" element={
                     <ProtectedRoute>
                        <DashBoardPage />
                         </ProtectedRoute>
                        } />
                <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
                <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
                <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />

                <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole={["MANAGER", "ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <Toaster />
        </div>
    );
}

export default App;
