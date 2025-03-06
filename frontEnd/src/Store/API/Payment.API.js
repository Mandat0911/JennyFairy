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
                toast.error('Failed to get Stripe checkout URL');
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
            console.log("Calling API with sessionId:", sessionId); // Debugging

            const response = await fetch(PAYMENT_API_ENDPOINTS.SUCCESS_CHECKOUT_SESSION, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ sessionId }),
            });

            let data;
            try {

                const data = await response.json();
                console.log("API Response:", data); // Debugging
            } catch (error) {
                console.error("Error parsing JSON:", error);
                throw new Error("Invalid response from server");
            }

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to verify payment');
            }
            
            return data;
            
        },
        onSuccess: () => {
            toast.success("Payment successful! Your cart has been cleared.");
            clearAllItems();
        },
        onError: (error) => {
            console.log("onError called:", error.message); // Debugging
            toast.error(error.message || "Something went wrong!");
        }
    });
};

export const useCreateSessionCheckoutCod = () => {
    const { mutate: clearAllItems } = useDeleteAllCartItem();
    return useMutation({
        mutationFn: async (checkoutData) => {
            const response = await fetch(PAYMENT_API_ENDPOINTS.COD_CHECKOUT_SESSION, {
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