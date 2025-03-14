export const cartProductDTO = (cartItem, product) => ({
    cartItemId: cartItem._id || null,  
    productId: product._id || null,
    name: product.name || null,
    img: product.img || null, 
    price: product.price || null,
    size: cartItem.size || null, 
    quantity: cartItem.quantity || null, 
    totalPrice: cartItem.totalPrice || null, 
});
