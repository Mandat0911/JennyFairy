import { create } from 'zustand';

const useOrderStore = create((set) => ({
    order: {
        user:'',
        paymentId:'',
        Code: '',
        name: '',
        email: '',
        products: [],
        totalAmount: '',
        shippingDetails: {
            fullName: '',
            phone: '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
            deliveryStatus: "pending",
        },
    },

    setOrder: (updatedFields) => set((state) => ({
        order: {
            ...state.order,
            ...updatedFields, // Allows updating multiple fields at once
        },
    })),

    resetProduct: () => set({
        order: {
            user:'',
            paymentId:'',
            Code: '',
            products: [],
            totalAmount: 0,
            shippingDetails: {
                fullName: '',
                phone: '',
                address: '',
                city: '',
                postalCode: '',
                country: '',
                deliveryStatus: "pending",
            },
        },
    }),

    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading })
}));

export default useOrderStore;
