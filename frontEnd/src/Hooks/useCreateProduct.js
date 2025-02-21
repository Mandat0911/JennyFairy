// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "../lib/axios.lib.js";

// const uploadImageToCloudinary = async (imageFile) => {
//     const formData = new FormData();
//     formData.append("file", imageFile);
//     formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary preset

//     const response = await axios.post("https://api.cloudinary.com/v1_1/dfewsut9x/image/upload", formData);
//     return response.data.secure_url; // Return uploaded image URL
// };

// export const useCreateProduct = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (newProduct) => {
//             // Upload all images to Cloudinary first
//             const imageUploadPromises = newProduct.img.map(uploadImageToCloudinary);
//             const uploadedImageUrls = await Promise.all(imageUploadPromises);

//             // Create final product object
//             const finalProduct = {
//                 name: newProduct.name,
//                 price: newProduct.price,
//                 description: newProduct.description,
//                 category: newProduct.category,
//                 sizes: newProduct.sizes,
//                 img: uploadedImageUrls, // Send URLs, not files
//             };

//             // Send product data to backend
//             const response = await axios.post("/product/create-product", finalProduct);
//             return response.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(["products"]);
//         },
//     });
// };
