import { PRODUCT_API_ENDPOINTS } from "../../Utils/config.js"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import useProductStore from '../../Store/Zustand/productStore.js';
import toast from 'react-hot-toast';


export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const { resetProduct, setLoading } = useProductStore();
    return useMutation({
        mutationFn: async (newProduct) => {
            console.log(newProduct)
            const response = await fetch(PRODUCT_API_ENDPOINTS.CREATE_PRODUCT, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                 },
                credentials: 'include',
                body: JSON.stringify(newProduct)
            });
            if (!response.ok) throw new Error('Failed to create product');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            resetProduct();
            setLoading(false)
            toast.success('Product created successfully!');
        },
        onError: (error) => {
            toast.error(`Error creating product: ${error.message}`);
        }
    })
};

export const useEditProduct = () => {
    const queryClient = useQueryClient();
    const { resetProduct, setLoading } = useProductStore();

    return useMutation({
        mutationFn: async ({ productId, newProduct }) => {
            console.log("Editing product:", productId, newProduct);
            
            const response = await fetch(PRODUCT_API_ENDPOINTS.EDIT_PRODUCT(productId), {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newProduct), // Ensure data is sent
            });

            if (!response.ok) throw new Error('Failed to edit product');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            resetProduct();
            toast.success('Product updated successfully!');
        },
        onError: (error) => {
            toast.error(`Error editing product: ${error.message}`);
        },
        onSettled: () => {
            setLoading(false); // Ensure loading state is reset
        },
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
};


export const useGetAllProduct = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await fetch(PRODUCT_API_ENDPOINTS.GET_PRODUCT, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();

            // Ensure it's an array
            return Array.isArray(data) ? data : data.products || [];
        },
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
};

export const useGetRecommendedProduct = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await fetch(PRODUCT_API_ENDPOINTS.GET_RECOMMENDED_PRODUCT, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();

            // Ensure it's an array
            return Array.isArray(data) ? data : data.products || [];
        },
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
};

export const useGetProductDetail = () => {
    const { productId } = useParams(); 

    return useQuery({
        queryKey: ['product', productId], // Ensure cache is per product
        queryFn: async () => {
            const response = await fetch(PRODUCT_API_ENDPOINTS.GET_PRODUCT_DETAIL(productId), {
                
            });

            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }

            return response.json();
        },
        enabled: !!productId, // Only run query when productId exists
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
};
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (productId) => {
            const response = await fetch(PRODUCT_API_ENDPOINTS.DELETE_PRODUCT(productId), {
                method: "DELETE",
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete product');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['products']); // Refresh the list after deletion
            toast.success('Product deleted successfully!');
        },
    })
}

export const useToggleFeatureProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (productId) => {
            const response = await fetch(PRODUCT_API_ENDPOINTS.FEATURE_PRODUCT(productId), {
                method: "PATCH",
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to toggle product');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['products']); // Refresh the list after deletion
        },
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    })
}

export const useGetProductByCategory = (category) => {
    return useQuery({
        queryKey: ['products', category],
        queryFn: async () => {
            const response = await fetch(PRODUCT_API_ENDPOINTS.GET_PRODUCT_BY_CATEGORY(category), {
                
            });

            if (!response.ok) {
                throw new Error('Failed to get products');
            }

            return response.json(); // Return JSON data
        },
        enabled: !!category,  // Ensure query runs only if category is provided
        retry: 3, // Retry up to 3 times before failing
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000), // Exponential backoff (1s, 2s, 4s, max 5s)
    });
}