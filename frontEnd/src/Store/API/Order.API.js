import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ORDER_API_ENDPOINTS } from "../../Utils/config";
import toast from "react-hot-toast";
import useOrderStore from "../Zustand/orderStore";

export const useGetAllOrder = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['orders',  page, limit],
        queryFn: async () => {
            const response = await fetch(`${ORDER_API_ENDPOINTS.GET_ORDER}?page=${page}&limit=${limit}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            return data;
        },
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    const { resetProduct, setLoading } = useOrderStore();

    return useMutation({
        mutationFn: async ({ orderId, newOrder }) => {            
            const response = await fetch(ORDER_API_ENDPOINTS.EDIT_ORDER(orderId), {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newOrder), // Ensure data is sent
            });

            if (!response.ok) throw new Error('Failed to edit order');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']);
            resetProduct();
            toast.success('Order updated successfully!');
        },
        onError: (error) => {
            toast.error(`Error editing order: ${error.message}`);
        },
        onSettled: () => {
            setLoading(false); // Ensure loading state is reset
        },
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
};


export const useDeleteOrder = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (orderId) => {
            const response = await fetch(ORDER_API_ENDPOINTS.DELETE_ORDER(orderId), {
                method: "DELETE",
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete order');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']); // Refresh the list after deletion
            toast.success('Order deleted successfully!');
        },
    })
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (orderId) => {
            const response = await fetch(ORDER_API_ENDPOINTS.CANCEL_ORDER(orderId), {
                method: "PUT",
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to canceled order');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']); // Refresh the list after deletion
            toast.success('Order canceled successfully!');
        },
    })
}