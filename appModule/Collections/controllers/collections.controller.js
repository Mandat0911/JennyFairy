import cloudinary from "../../../backend/lib/cloudinary/cloudinary.js";
import Collection from "../model/collections.models.js";

export const getAllCollection = async(req, res) => {
    try {
        const collections = await Collection.find({});
        res.json(collections);
    } catch (error) {
        console.error("Error in getAllCollection controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const getCollectionDetail = async(req, res) => {
    try {
        const {id: collectionId} = req.params;

        const collection = await Collection.findById(collectionId);

        if(!collection) {
            return res.status(404).json({message: "Collection not found!"});
        }
        res.json(collection);
    } catch (error) {
        console.error("Error in getCollectionDetail controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}


export const createCollection = async (req, res) => {
    try {
        const { name, description, img} = req.body;
        
        let imageUrls = [];

        if (!img || !Array.isArray(img) || img.length === 0) {
            return res.status(400).json({ error: "No valid images provided!" });
        }

        const uploadResults = await Promise.allSettled(
            img.map(async (image) => {
                try {
                    const response = await cloudinary.uploader.upload(image, {
                        folder: "collections",
                        quality: "auto", // Automatically adjusts compression
                        fetch_format: "webp", // Converts to optimal format (WebP, etc.)
                        width: 800, // Resize to limit large uploads
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

        if (imageUrls.length === 0) {
            return res.status(400).json({ error: "No images uploaded successfully!" });
        }
        const collection = await Collection.create({
            name,
            description,
            img: imageUrls,
        });

        res.status(201).json(collection);
        
    } catch (error) {
        console.error("Error in createCollection controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const editCollection = async(req, res) => {
    try {
        const {id: collectionId} = req.params;
        const { name, description, img} = req.body;

        let imageUrls = [];

        let collection = await Collection.findById(collectionId);

        if(!collection){
            return res.status(404).json({ message: "Collection not found!" }); 
        };
        // Keep existing img if no new img provide
        let updatedImages = collection.img;

        if(img && Array.isArray(img) && img.length > 0){
            const uploadResults = await Promise.allSettled(
                img.map(async (image) => {
                    try {
                        const response = await cloudinary.uploader.upload(image, {
                            folder: "collections",
                            quality: "auto", // Automatically adjusts compression
                            fetch_format: "webp", // Converts to optimal format (WebP, etc.)
                            width: 800, // Resize to limit large uploads
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
            }
        }

        collection.name = name || collection.name;
        collection.description = description || collection.description;
        collection.img = updatedImages

        await collection.save();
        res.status(201).json(collection);

    } catch (error) {
        console.error("Error in editCollection controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}



export const deleteCollection = async (req, res) => {
    try {
        const { id: collectionId } = req.params;
        
        const collection = await Collection.findById(collectionId);
        
        if (!collection) {
            return res.status(404).json({ message: "Collection not found!" });
        }

        // If product has images, delete them from Cloudinary
        if (collection.img && collection.img.length > 0) {
            try {
                for (const imgUrl of collection.img) {
                    const publicId = imgUrl.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }

        // Delete product from database
        await collection.deleteOne();

        res.json({ message: "Collection deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteCollection controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

