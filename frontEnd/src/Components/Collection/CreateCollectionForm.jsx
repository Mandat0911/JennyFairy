import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import useCollectionStore from '../../Store/Zustand/collection.Zustand.js';
import { useCreateCollection, useEditCollection } from '../../Store/API/Collection.API.js';

const CreateCollectionForm = ({initialCollection}) => { 
    const isEditing = Boolean(initialCollection);
    const { collection, setCollection, isLoading, setLoading } = useCollectionStore();
    const [imagePreviews, setImagePreviews] = useState(initialCollection?.img || []);

    const { mutate: createCollection } = useCreateCollection();
    const { mutate: editCollection } = useEditCollection();

    // When `initialProduct` true, update form fields
        useEffect(() => {
            if (initialCollection) {
                setCollection({
                    name: initialCollection.name || "",
                    description: initialCollection.description || "",
                    img: initialCollection.img || [],
                });
                setImagePreviews(initialCollection.img || []);
    
                setCollection((prev) => ({
                    ...prev,
                    ...initialCollection, // Populate the store with initial values
                }));
            }
        }, [initialCollection, setCollection]);



    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (isEditing) {
            editCollection(
                { 
                    collectionId: initialCollection._id, 
                    newCollection: collection // Ensure passing the updated product data 
                },
                {
                    onSuccess: () => {
                        setImagePreviews([]);
                        setLoading(false);
                    },
                    onError: () => {
                        setLoading(false);
                    }
                }
            );
        } else {
            createCollection(collection, {
                onSuccess: () => {
                    setImagePreviews([]);
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                }
            });
        }
    };

    const handleImageChange = (e) => {
        const { collection, setCollection } = useCollectionStore.getState(); // Get Zustand state
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            toast.error("You can only upload 5 images at a time!");
            return; // Stop further execution if limit exceeds
        }

        const readFilesAsBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };

        Promise.all(files.map(readFilesAsBase64))
            .then((base64Images) => {
                const updatedImages = [...(collection.img || []), ...base64Images];
                setCollection({ img: updatedImages }); // Update Zustand store properly
                setImagePreviews((prev) => [...prev, ...base64Images]);
            })
            .catch((error) => {
                console.error('Error converting images:', error);
            });
    };
    
    const handleRemoveImage = (index) => {
        const updatedImages = collection.img.filter((_, i) => i !== index);
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

        setCollection({ img: updatedImages });
        setImagePreviews(updatedPreviews);
    };
    
  return (
    <motion.div
                className="bg-white shadow-xl rounded-lg p-6 mb-8 max-w-lg mx-auto border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center uppercase tracking-wide">
                    {isEditing ? "Edit collection" : "New collection"}
                </h2>
        
                <form 
                onSubmit={handleSubmit} 
                className="space-y-5">
                    {/* Collection Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Collection Name</label>
                        <input
                            type="text"
                            value={collection.name}
                            onChange={(e) => setCollection({ ...collection, name: e.target.value })}
                            placeholder="Enter collection name"
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            required
                        />
                    </div>
        
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={collection.description}
                            onChange={(e) => setCollection({ ...collection, description: e.target.value })}
                            rows="3"
                            placeholder="Collection description"
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            required
                        />
                    </div>
        
                    {/* Image Upload */}
                    <div>
                        <input type="file" id="img" className="sr-only" accept="image/*" multiple 
                        onChange={handleImageChange} 
                        />
                        <label htmlFor="img" className="block cursor-pointer bg-gray-100 py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
                            <Upload className="h-5 w-5 inline-block mr-2" /> Upload Images
                        </label>
                        <p className="text-xs text-gray-500 mt-2 italic">Max 5 images</p>
                        <div className="mt-2 grid grid-cols-5 gap-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img src={preview} alt="Preview" className="w-20 h-20 rounded-md object-cover border border-gray-300" />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
        
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
                        {isLoading ? "Loading..." : isEditing ? "Update collection" : "Create collection"}
                    </button>
                </form>
            </motion.div>
        );
}

export default CreateCollectionForm
