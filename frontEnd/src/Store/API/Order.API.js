import { useQuery } from "@tanstack/react-query";
import { ORDER_API_ENDPOINTS } from "../../Utils/config";

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

            // Ensure it's an array
            return Array.isArray(data) ? data : data.orders || [];
        },
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
};