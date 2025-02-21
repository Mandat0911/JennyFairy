import { create } from 'zustand';

const useProductStore = create((set) => ({
    product: {
        name: '',
        description: '',
        price: '',
        category: [],
        sizes: [],
        img: []
    },
    
    setProduct: (key, value) => set((state) => ({
        product: {
            ...state.product,
            [key]: value,
        },
    })),
    
    resetProduct: () => set({
        product: {
            name: '',
            description: '',
            price: '',
            category: [],
            sizes: [],
            img: []
        },
    }),
    
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading })
}));

export default useProductStore;


