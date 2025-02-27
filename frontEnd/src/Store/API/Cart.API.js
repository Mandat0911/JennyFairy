import { CART_API_ENDPOINTS } from "../../Utils/config.js"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import { useCartStore } from "../Zustand/cartStore.js";

export const useGetCartItems = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            try {
                const response = await fetch(CART_API_ENDPOINTS.GET_CART, {
                    credentials: 'include',
                });
                

                if (!response.ok) {
                    const errorMessage = `Failed to fetch collections: ${response.status} ${response.statusText}`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                
                // Ensure it's always an array
                const cartItem = Array.isArray(data) 
                    ? data 
                    : (Array.isArray(data.cartItem) ? data.cartItem : []);

                return cartItem;
            } catch (error) {
                console.error("Error fetching cartItem:", error);
                throw new Error("Unable to retrieve cartItem. Please try again later.");
            }
        },
    });
};

export const useAddItemToCart = () => {
    const { addToCart } = useCartStore();

    return useMutation({
        mutationFn: async (newItem) => {
            const response = await fetch(CART_API_ENDPOINTS.ADD_TO_CART, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure authentication
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Failed to add item to cart');
            }

            return response.json();
        },
        onMutate: async (newItem) => {
           
            addToCart(newItem);
        },
        onSuccess: (data) => {
            toast.success('Item added to cart successfully!');
        },
        onError: (error) => {
            toast.error(`Error adding item to cart: ${error.message}`);
        }
    });
};
