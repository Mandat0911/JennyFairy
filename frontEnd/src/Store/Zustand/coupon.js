import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCouponStore = create(
    persist(
        (set) => ({
            coupon: {
                code: "",
                discountPercentage: 0,
                expirationDate: "",
            },
            setCoupon: (updatedFields) =>
                set((state) => ({
                    coupon: {
                        ...state.coupon,
                        ...updatedFields,
                    },
                })),
            resetCoupon: () =>
                set({
                    coupon: {
                        code: "",
                        discountPercentage: 0,
                        expirationDate: "",
                    },
                }),
            isLoading: false,
            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: "coupon-storage", // Local storage key
            getStorage: () => localStorage, // Store in localStorage
        }
    )
);

export default useCouponStore;
