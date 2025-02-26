import { COLLECTION_API_ENDPOINTS } from "../../Utils/config.js"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import useProductStore from '../productStore.js';
import toast from 'react-hot-toast';
import useCollectionStore from "../Zustand/collection.Zustand.js";


export const useCreateCollection = () => {
    const queryClient = useQueryClient();
    const { resetCollection, setLoading } = useCollectionStore();
    return useMutation({
        mutationFn: async (newCollection) => {
            const response = await fetch(COLLECTION_API_ENDPOINTS.CREATE_COLLECTION, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                 },
                credentials: 'include',
                body: JSON.stringify(newCollection)
            });
            if (!response.ok) throw new Error('Failed to create collection');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['collections']);
            resetCollection();
            setLoading(false)
            toast.success('Collection created successfully!');
        },
        onError: (error) => {
            toast.error(`Error creating collection: ${error.message}`);
        }
    })
};

export const useEditCollection = () => {
    const queryClient = useQueryClient();
    const { resetCollection, setLoading } = useCollectionStore();

    return useMutation({
        mutationFn: async ({ collectionId, newCollection }) => {
            
            const response = await fetch(COLLECTION_API_ENDPOINTS.EDIT_COLLECTION(collectionId), {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newCollection), // Ensure data is sent
            });

            if (!response.ok) throw new Error('Failed to edit collection');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['collections']);
            resetCollection();
            toast.success('Collection updated successfully!');
        },
        onError: (error) => {
            toast.error(`Error editing collection: ${error.message}`);
        },
        onSettled: () => {
            setLoading(false); // Ensure loading state is reset
        }
    });
};

export const useGetAllCollection = () => {
    return useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            try {
                const response = await fetch(COLLECTION_API_ENDPOINTS.GET_COLLECTION, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorMessage = `Failed to fetch collections: ${response.status} ${response.statusText}`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }

                const data = await response.json();

                // Ensure it's always an array
                const collections = Array.isArray(data) 
                    ? data 
                    : (Array.isArray(data.collections) ? data.collections : []);

                return collections;
            } catch (error) {
                console.error("Error fetching collections:", error);
                throw new Error("Unable to retrieve collections. Please try again later.");
            }
        },
    });
};


export const useGetCollectionDetail = () => {
    const { collectionId } = useParams(); 

    return useQuery({
        queryKey: ['collections', collectionId], // Ensure cache is per product
        queryFn: async () => {
            const response = await fetch(COLLECTION_API_ENDPOINTS.GET_COLLECTION_DETAIL(collectionId), {
                
            });

            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }

            return response.json();
        },
        enabled: !!collectionId, // Only run query when productId exists
    });
};
export const useDeleteCollection = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (collectionId) => {
            const response = await fetch(COLLECTION_API_ENDPOINTS.DELETE_COLLECTION(collectionId), {
                method: "DELETE",
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete collection');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['collections']); // Refresh the list after deletion
            toast.success('Collection deleted successfully!');
        },
    })
}

