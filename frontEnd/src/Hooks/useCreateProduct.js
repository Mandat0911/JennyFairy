import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios.lib.js";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newProduct) => {
            const formData = new FormData();

            // Append non-image fields
            formData.append("name", newProduct.name);
            formData.append("price", newProduct.price);
            formData.append("description", newProduct.description);

            // Append categories
            newProduct.category.forEach((cat) => {
                formData.append("category", cat);
            });

            // Append sizes
            newProduct.sizes.forEach((size) => {
                formData.append("sizes", size);
            });

            // Append images
            newProduct.images.forEach((image) => {
                formData.append("img", image);
            });

            // Debugging: Log FormData contents
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await axios.post("/product/create-product", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
        },
    });
};
