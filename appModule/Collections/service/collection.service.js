import cloudinary from "../../../backend/lib/cloudinary/cloudinary.js";
import { collectionDTO } from "../dto/collection.dto.js";
import Collection from "../model/collections.models.js";

export const getAllCollectionService = async () => {
    try {
        const collections = await Collection.find({});
        const formattedCollections = collections.map((collection) => collectionDTO(collection))
        return formattedCollections;
    } catch (error) {
        console.error("Error in getAllCollectionService:", error.message);
        throw error; 
    }
};

export const getCollectionDetailService = async (collectionId) => {
    try {
        const collection = await Collection.findById(collectionId);
        if(!collection) { throw { status: 404, message: "Collection not found!" }}
        return collectionDTO(collection);
    } catch (error) {
        console.error("Error in getCollectionDetailService:", error.message);
        throw error; 
    }
};

export const deleteCollectionService = async (collectionId) => {
    try {
        const collection = await Collection.findById(collectionId);
        if(!collection) {throw { status: 404, message: "Collection not found!" }}

        // If product has images, delete them from Cloudinary
        if (collection.img && collection.img.length > 0) {
            try {
                for (const imgUrl of collection.img) {
                    const publicId = imgUrl.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`collections/${publicId}`);
                }
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }
        await collection.deleteOne();
    } catch (error) {
        console.error("Error in deleteCollectionService:", error.message);
        throw error; 
    }
};

export const createCollectionService = async (name, description, img) => {
    try {
        let imageUrls = [];
        if (!img || !Array.isArray(img) || img.length === 0) {throw { status: 400, message: "No valid images provided!" }}
        const uploadResults = await Promise.allSettled(
            img.map(async (image) => {
                try {
                    const response = await cloudinary.uploader.upload(image, {
                        folder: "collections",
                        quality: "auto",
                        fetch_format: "webp", 
                        width: 1000, 
                        height: 1000,
                        crop: "fill",
                        gravity: "auto",
                    });
                    return { status: "fulfilled", url: response.secure_url };
                } catch (error) {
                    console.error("Upload error:", error.message);
                    return { status: "rejected", reason: error.message };
                }
            })
        );
        imageUrls = uploadResults
            .filter(result => result.status === "fulfilled")
            .map(result => result.value.url);

        if (imageUrls.length === 0) { throw { status: 400, message: "No images uploaded successfully!" }}

        const collection = await Collection.create({name, description, img: imageUrls});

        return collectionDTO(collection);
    } catch (error) {
        console.error("Error in createCollectionService:", error.message);
        throw error; 
    }
};

export const editCollectionService = async (collectionId, name, description, img) => {
    try {
        let imageUrls = [];
        
        let collection = await Collection.findById(collectionId);
        if(!collection){throw { status: 404, message: "Collection not found!" }};

        // Keep existing img if no new img provide
        let updatedImages = collection.img;
        
        if(img && Array.isArray(img) && img.length > 0){
            const uploadResults = await Promise.allSettled(
                img.map(async (image) => {
                    try {
                        const response = await cloudinary.uploader.upload(image, {
                            folder: "collections",
                            quality: "auto",
                            fetch_format: "webp",
                            width: 800, 
                            height: 800,
                            crop: "limit",
                        });
                        return { status: "fulfilled", url: response.secure_url };
                    } catch (error) {
                        console.error("Upload error:", error.message);
                        return { status: "rejected", reason: error.message };
                    }
                })
            );
            imageUrls = uploadResults
            .filter(result => result.status === "fulfilled")
            .map(result => result.value.url);

            if (imageUrls.length > 0) {
                updatedImages = imageUrls; // Replace with new images
            }};

        collection.name = name || collection.name;
        collection.description = description || collection.description;
        collection.img = updatedImages

        await collection.save();

        return collectionDTO(collection);
    } catch (error) {
        console.error("Error in createCollectionService:", error.message);
        throw error; 
    }
};