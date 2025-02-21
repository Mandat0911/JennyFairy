import { create } from "zustand";

const useProductStore = create((set) => ({
    product: {
        name: "",
        price: "",
        category: [],   // Changed to array
        description: "",
        sizes: [],      // Changed to array
        images: [],     // Store images as files
    },
    setProduct: (field, value) => set((state) => ({
        product: { ...state.product, [field]: value },
    })),
    resetProduct: () => set({
        product: { 
            name: "", 
            price: "", 
            category: [], 
            description: "", 
            sizes: [],
            images: [],
        }
    })
}));

export default useProductStore;
