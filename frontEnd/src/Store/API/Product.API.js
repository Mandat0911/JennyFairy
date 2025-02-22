import { PRODUCT_API_ENDPOINTS } from "../../Utils/config.js"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useProductStore from '../../Store/productStore.js';
import toast from 'react-hot-toast';


export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const { resetProduct, setLoading } = useProductStore();
    return useMutation({
        mutationFn: async (newProduct) => {
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
    });
};
