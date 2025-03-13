export const cartProductDTO = (cartItem, product) => ({
    cartItemId: cartItem._id,  
    productId: product._id,
    name: product.name,
    img: product.img, 
    price: product.price,
    size: cartItem.size, 
    quantity: cartItem.quantity, 
    totalPrice: cartItem.totalPrice, 
});
