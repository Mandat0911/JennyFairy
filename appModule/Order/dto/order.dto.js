export const orderDTO = (order) => ({
    _id: order?._id || null,
    user: order.user ? {
        _id: order.user._id,
        name: order.user.name,
        email: order.user.email
    } : null,
    paymentId: order.paymentId ? {
        paymentMethod: order.paymentId.paymentMethod,
        paymentStatus: order.paymentId.paymentStatus,
        couponCode: order.paymentId.couponCode,
        couponDiscountPercentage: order.paymentId.couponDiscountPercentage
    } : null,
    products: order.products.map(productItem => ({
        productId: productItem.product?._id || null,
        name: productItem.product?.name || "N/A",
        quantity: productItem.quantity,
        size: productItem.size,
        price: productItem.price
    })),
    totalAmount: order.totalAmount,
    shippingDetails: {
        fullName: order.shippingDetails?.fullName || "N/A",
        phone: order.shippingDetails?.phone || "N/A",
        address: order.shippingDetails?.address || "N/A",
        city: order.shippingDetails?.city || "",
        postalCode: order.shippingDetails?.postalCode || "",
        country: order.shippingDetails?.country || "",
        deliveryStatus: order.shippingDetails?.deliveryStatus || "pending"
    },
    createdAt: order.createdAt,
})
