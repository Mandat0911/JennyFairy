import { create } from 'zustand';

const useProductStore = create((set) => ({
    product: {
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        quantity: '',
        category: [],
        sizes: [],
        img: []
    },

    setProduct: (updatedFields) => set((state) => ({
        product: {
            ...state.product,
            ...updatedFields, // Allows updating multiple fields at once
        },
    })),

    resetProduct: () => set({
        product: {
            name: '',
            description: '',
            price: '',
            discountPrice: '',
            quantity: '',
            category: [],
            sizes: [],
            img: []
        },
    }),

    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading })
}));

export default useProductStore;
