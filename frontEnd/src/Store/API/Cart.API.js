import { CART_API_ENDPOINTS, PRODUCT_API_ENDPOINTS } from "../../Utils/config.js"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useCartStore from "../Zustand/cartStore.js";


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
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newItem) => {
            const response = await fetch(CART_API_ENDPOINTS.ADD_TO_CART, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newItem),
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add item to cart');
            }

            // Ensure cartItems is an array
            const cartItems = Array.isArray(data.cartItems) ? data.cartItems : [];
            return cartItems;
        },
        onMutate: async (newItem) => {
            // Optimistically update Zustand store before server response
            const { productId, size, quantity } = newItem;

            // Fetch full product details before adding to Zustand store
            const productResponse = await fetch(PRODUCT_API_ENDPOINTS.GET_PRODUCT_DETAIL(productId));
            const productData = await productResponse.json();

            if (!productResponse.ok) {
                throw new Error("Failed to fetch product details");
            }

            const detailedItem = {
                ...productData,  // Include full product details (name, price, image)
                productId,
                size,
                quantity,
            };

            addToCart(detailedItem);
            console.log("Adding item with details to Zustand store:", detailedItem);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
            toast.success('Item added to cart successfully!', { id: "added" });
        },
        onError: (error) => {
            toast.error(`Error adding item to cart: ${error.message}`);
        }
    });
};

export const useDeleteCartItem = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (cartItemId) => {
            const response = await fetch(CART_API_ENDPOINTS.DELETE_ITEM(cartItemId), {
                method: "DELETE",
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete cart item');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']); // Refresh the list after deletion
            toast.success('Cart item deleted successfully!');
        },
    })
}

