import { create } from 'zustand';

const useCouponStore = create((set) => ({
    coupon: {
        code: '',
        discountPercentage: '',
        price: '',
        expirationDate: ''
    },

    setCoupon: (updatedFields) => set((state) => ({
        coupon: {
            ...state.coupon,
            ...updatedFields, // Allows updating multiple fields at once
        },
    })),

    resetCoupon: () => set({
        coupon: {
            code: '',
            discountPercentage: '',
            price: '',
            expirationDate: ''
        },
    }),

    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading })
}));

export default useCouponStore;
