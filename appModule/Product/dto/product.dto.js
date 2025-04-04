export const productDTO = (product) => ({
    _id: product?._id || null,
    name: product?.name || null,
    description: product?.description || null,
    price: product?.price || null,
    discountPrice: product?.discountPrice || null,
    img: product?.img || [],
    quantity: product?.quantity || null,
    category: product?.category || [],
    sizes: product?.sizes || [],
    isFeatured: product?.isFeatured || null,
})
