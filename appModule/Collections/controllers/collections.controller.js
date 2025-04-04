import { createCollectionService, deleteCollectionService, editCollectionService, getAllCollectionService, getCollectionDetailService } from "../service/collection.service.js";

export const getAllCollection = async(req, res) => {
    try {
        res.json(await getAllCollectionService());
    } catch (error) {
        console.error("Error in getAllCollection controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const getCollectionDetail = async(req, res) => {
    try {
        const {id: collectionId} = req.params;
        res.json(await getCollectionDetailService(collectionId));
    } catch (error) {
        console.error("Error in getCollectionDetail controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
}

export const createCollection = async (req, res) => {
    try {
        const { name, description, img} = req.body;
        res.json(await createCollectionService(name, description, img));
    } catch (error) {
        console.error("Error in createCollection controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const editCollection = async(req, res) => {
    try {
        const {id: collectionId} = req.params;
        const { name, description, img} = req.body;
        res.json(await editCollectionService(collectionId, name, description, img));
    } catch (error) {
        console.error("Error in editCollection controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const deleteCollection = async (req, res) => {
    try {
        const { id: collectionId } = req.params;
    
        await deleteCollectionService(collectionId);

        res.json({ message: "Collection deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteCollection controller:", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

