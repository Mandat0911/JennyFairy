import { create } from "zustand";

const useProductStore = create((set) => ({
    product: {
        name: "",
        price: "",
        category: "",
        description: "",
        size: ""
    }
}))