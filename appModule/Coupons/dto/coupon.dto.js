export const couponDTO = (coupons) => ({
    _id: coupons?._id || null,
    code: coupons?.code || null,
    discountPercentage: coupons?.discountPercentage || null,
    expirationDate: coupons?.expirationDate || null,
    createdAt: coupons?.createdAt || null
})
