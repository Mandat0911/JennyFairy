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

            // Ensure localStorage updates correctly with new cart items
            localStorage.setItem("cart-storage", JSON.stringify(data.cartItems));

            return data.cartItems; // Return updated cart
        },
        onMutate: async (newItem) => {
            // Fetch full product details before adding to Zustand store
            const productResponse = await fetch(PRODUCT_API_ENDPOINTS.GET_PRODUCT_DETAIL(newItem.productId));
            const productData = await productResponse.json();

            if (!productResponse.ok) {
                throw new Error("Failed to fetch product details");
            }

            const detailedItem = {
                ...productData,
                productId: newItem.productId,
                size: newItem.size,
                quantity: newItem.quantity,
            };
            // Update Zustand Store & LocalStorage
            addToCart(detailedItem);
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
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const calculateTotals = useCartStore((state) => state.calculateTotals);
    return useMutation({
        mutationFn: async ({ productId, size }) => {

            const response = await fetch(CART_API_ENDPOINTS.DELETE_ITEM(productId), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ productId, size }), // Send size in request body
            });

            if (!response.ok) throw new Error("Failed to delete cart item");
        },
        onSuccess: (_, { productId, size }) => {
            removeFromCart(productId, size); // Remove from Zustand store
            calculateTotals(); // Ensure total and subtotal update
            queryClient.invalidateQueries(["cart"]); // Refetch cart from API
            toast.success("Cart item deleted successfully!");
        },
    });
};


export const useDeleteAllCartItem = () => {
    const queryClient = useQueryClient();
    const {clearCart} = useCartStore();
    return useMutation({
        mutationFn: async () => {

            const response = await fetch(CART_API_ENDPOINTS.DELETE_ALL_ITEM, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            
            });
            if (!response.ok) throw new Error("Failed to delete cart item");
        },
        onSuccess: () => {
            clearCart();
            queryClient.invalidateQueries(["cart"]); // Refetch cart from API
        },
    });
};



export const useUpdateQuantityCartItem = () => {
    const queryClient = useQueryClient();
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const calculateTotals = useCartStore((state) => state.calculateTotals);

    return useMutation({
        mutationFn: async ({ productId, quantity }) => {
            const response = await fetch(CART_API_ENDPOINTS.UPDATE_QUANTITY(productId), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ quantity }), // Fixed the API request payload
            });

            if (!response.ok) {
                throw new Error("Failed to update cart item");
            }

            return await response.json(); // Ensure a valid return value
        },
        onSuccess: (data) => {
            updateQuantity(data.product, data.size, data.quantity)
            calculateTotals()
            queryClient.invalidateQueries(["cart"]); // Refetch cart from API
            toast.success("Cart item updated successfully!");
        },
        onError: () => {
            toast.error("Failed to update cart item. Please try again.");
        },
    });
};

