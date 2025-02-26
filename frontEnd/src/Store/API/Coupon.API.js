import { COUPON_API_ENDPOINTS } from "../../Utils/config.js"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import useCouponStore from "../Zustand/coupon.js";


export const useCreateCollection = () => {
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
