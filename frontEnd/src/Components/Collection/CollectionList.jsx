import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash, Edit, Loader, X } from "lucide-react";
import { useDeleteCollection, useGetAllCollection } from '../../Store/API/Collection.API.js';
import CreateCollectionForm from './CreateCollectionForm.jsx';


const CollectionList = () => {
    const { data: collections } = useGetAllCollection();
    const { mutate: deleteMutation } = useDeleteCollection();
    const [deletingCollectionId, setDeletingCollectionId] = useState(null);
    const [editCollectionData, setEditCollectionData] = useState(null);

  return (
    <motion.div
    className="bg-white shadow-xl rounded-lg overflow-hidden max-w-5xl mx-auto p-4 md:p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
>
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 ">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Collection</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {collections?.length > 0 ? (
                    collections?.map((collection) => (
                        <tr key={collection._id} className="hover:bg-gray-50 transition duration-200">
                            <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                                <img className="h-12 w-12 rounded-lg object-cover" src={collection.img[0]} alt={collection.name} />
                                <span className="text-sm font-medium text-gray-900">{collection.name}</span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => {
                                        setDeletingCollectionId(collection._id);
                                        deleteMutation(collection._id, {
                                            onSettled: () => setDeletingCollectionId(null),
                                        });
                                    }}
                                    className="text-red-500 hover:text-red-400"
                                    disabled={deletingCollectionId === collection._id}
                                    >
                                    {deletingCollectionId === collection._id ? (
                                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <Trash className="h-5 w-5" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setEditCollectionData(collection)}
                                    className="text-green-400 hover:text-green-300 px-2"
                                >
                                    <Edit className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))
                ):(
                    <tr>
                        <td colSpan="5" className="text-center py-4 text-gray-500">
                            No collections found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
    {editCollectionData && (
        <div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50"
            onClick={() => setEditCollectionData(null)}
        >
            <div
                className="max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setEditCollectionData(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>
                <CreateCollectionForm initialCollection={editCollectionData} />
            </div>
        </div>
    )}
</motion.div>
);
}

export default CollectionList
