import { useMutation} from "@tanstack/react-query";
import { PAYMENT_API_ENDPOINTS } from "../../Utils/config";
import toast from "react-hot-toast";
import { useDeleteAllCartItem } from "./Cart.API";

export const useCreateSessionCheckoutStripe = () => {
    return useMutation({
        mutationFn: async (checkoutData) => {
            const response = await fetch(PAYMENT_API_ENDPOINTS.CREATE_CHECKOUT_SESSION, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(checkoutData),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data?.error||'Failed to create checkout session');
            }
        
            return data;
        },
        onSuccess: (data) => {
            
            if (data.id) {
                localStorage.setItem('sessionId', data.id); // Store sessionId in localStorage
                window.location.href = data.url; // Redirect to Stripe checkout
            } else {
                // toast.error('Failed to get Stripe checkout URL');
            }
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong!");
        }
    });
};
// checkoutSuccess

export const useCheckSuccessStripe = () => {
    const { mutate: clearAllItems } = useDeleteAllCartItem();
    
    return useMutation({
        mutationFn: async (sessionId) => {
            const response = await fetch(PAYMENT_API_ENDPOINTS.SUCCESS_CHECKOUT_SESSION, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ sessionId }),
            });

            let data;
            try {

                const data = await response.json();
            } catch (error) {
                throw new Error("Invalid response from server");
            }

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to verify payment');
            }
            
            return data;
            
        },
        onSuccess: () => {
            clearAllItems();
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong!");
        }
    });
};

export const useCreateSessionCheckoutCod = () => {
    const { mutate: clearAllItems } = useDeleteAllCartItem();
    return useMutation({
        mutationFn: async (checkoutData) => {
            const response = await fetch(PAYMENT_API_ENDPOINTS.CREATE_CHECKOUT_SUCCESS_COD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(checkoutData),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data?.error||'Failed to create checkout COD');
            }
        
            return data;
        },
        onSuccess: () => {
            toast.success("Order placed successfully!");  
            clearAllItems();
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong!");
        }
    });
};

export const useCreateSessionCheckoutQrCode = () => {
    const { mutate: clearAllItems } = useDeleteAllCartItem();
    return useMutation({
        mutationFn: async (checkoutData) => {
            const response = await fetch(PAYMENT_API_ENDPOINTS.CREATE_CHECKOUT_SUCCESS_QRCODE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(checkoutData),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data?.error||'Failed to create checkout QrCode');
            }
        
            return data;
        },
        onSuccess: () => {
            toast.success("Order placed successfully!");  
            clearAllItems();
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong!");
        }
    });
};