

export const getAllProduct = async(req, res) => {
    try {
        
    } catch (error) {
        console.error("Error in getAllProduct controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}