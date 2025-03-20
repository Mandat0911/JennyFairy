import { useQuery } from "@tanstack/react-query";
import { AUTH_API_ENDPOINTS } from "../../Utils/config";


export const useGetUserProfile = () => {
    return useQuery({
        queryKey: ['auth'],
        queryFn: async () => {
            const response = await fetch(AUTH_API_ENDPOINTS.GET_USER_PROFILE, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            
            return data;
        },
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
};