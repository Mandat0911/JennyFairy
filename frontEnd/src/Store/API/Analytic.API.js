import { useQuery } from "@tanstack/react-query";
import { ANALYTIC_API_ENDPOINTS } from "../../Utils/config";

export const useGetAnalytic = () => {
    return useQuery({
        queryKey: ['analytic'],
        queryFn: async () => {
            const response = await fetch(ANALYTIC_API_ENDPOINTS.GET_ANALYTIC, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch analytic data');
            }

            const data = await response.json();
            
            return data;
        },
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
};