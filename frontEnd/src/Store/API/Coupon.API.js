import { COUPON_API_ENDPOINTS } from "../../Utils/config.js"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import useCouponStore from "../Zustand/coupon.js";


export const useCreateCoupon = () => {
    const queryClient = useQueryClient();
    const { resetCoupon, setLoading } = useCouponStore();
    return useMutation({
        mutationFn: async (newCoupon) => {
            const response = await fetch(COUPON_API_ENDPOINTS.CREATE_COUPON, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                 },
                credentials: 'include',
                body: JSON.stringify(newCoupon)
            });
            if (!response.ok) throw new Error('Failed to create Coupon');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['coupons']);
            resetCoupon();
            setLoading(false)
            toast.success('Coupon created successfully!');
        },
        onError: (error) => {
            toast.error(`Error creating Coupon: ${error.message}`);
        }
    })
};


export const useGetAllCoupon = () => {
    return useQuery({
        queryKey: ['coupons'],
        queryFn: async () => {
            try {
                const response = await fetch(COUPON_API_ENDPOINTS.GET_COUPON, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorMessage = `Failed to fetch coupons: ${response.status} ${response.statusText}`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }

                const data = await response.json();

                // Ensure it's always an array
                const coupons = Array.isArray(data) 
                    ? data 
                    : (Array.isArray(data.coupons) ? data.coupons : []);

                return coupons;
            } catch (error) {
                console.error("Error fetching coupons:", error);
                throw new Error("Unable to retrieve coupons. Please try again later.");
            }
        },
    });
};

export const useDeleteCoupon = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (couponId) => {
            const response = await fetch(COUPON_API_ENDPOINTS.DELETE_COUPON(couponId), {
                method: "DELETE",
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete Coupon');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['coupons']); // Refresh the list after deletion
            toast.success('Coupon deleted successfully!');
        },
    })
}