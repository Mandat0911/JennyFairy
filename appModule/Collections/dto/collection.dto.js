export const collectionDTO = (collection) => ({
    _id: collection._id || null,
    name: collection.name || null,
    description: collection.description || null,
    img: collection.img || []
});