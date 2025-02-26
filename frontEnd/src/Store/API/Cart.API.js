import { CART_API_ENDPOINTS } from "../../Utils/config.js"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';

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