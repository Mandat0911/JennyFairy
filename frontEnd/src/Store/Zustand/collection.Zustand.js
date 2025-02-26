import { create } from 'zustand';

const useCollectionStore = create((set) => ({
    collection: {
        name: '',
        description: '',
        img: []
    },

    setCollection: (updatedFields) => set((state) => ({
        collection: {
            ...state.collection,
            ...updatedFields, // Allows updating multiple fields at once
        },
    })),

    resetCollection: () => set({
        collection: {
            name: '',
            description: '',
            img: []
        },
    }),

    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading })
}));

export default useCollectionStore;
