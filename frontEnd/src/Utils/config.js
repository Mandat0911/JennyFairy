const API_BE_URL = "https://api.jennyfairy.store/api";

// Product API Endpoints
export const PRODUCT_API_ENDPOINTS = {
  GET_PRODUCT: `${API_BE_URL}/product`,
  GET_RECOMMENDED_PRODUCT: `${API_BE_URL}/product/recommendations/recommendations`,
  GET_PRODUCT_DETAIL: (productId) => `${API_BE_URL}/product/${productId}`,
  CREATE_PRODUCT: `${API_BE_URL}/product/create-product`,
  EDIT_PRODUCT: (productId) => `${API_BE_URL}/product/edit-product/${productId}`,
  DELETE_PRODUCT: (productId) => `${API_BE_URL}/product/delete/${productId}`,
  TOGGLE_FEATURE_PRODUCT: (productId) => `${API_BE_URL}/product/toggle/${productId}`,
  GET_PRODUCT_BY_CATEGORY: (category) => `${API_BE_URL}/product/category/${category}`,
}

// Order API Endpoints
export const ORDER_API_ENDPOINTS = {
  GET_ORDER: `${API_BE_URL}/order`,
  EDIT_ORDER: (orderId) => `${API_BE_URL}/order/edit-order/${orderId}`,
  DELETE_ORDER: (orderId) => `${API_BE_URL}/order/delete/${orderId}`,
  CANCEL_ORDER: (orderId) => `${API_BE_URL}/order/delete/${orderId}`,
}

// Collection API Endpoints
export const COLLECTION_API_ENDPOINTS = {
  GET_COLLECTION: `${API_BE_URL}/collection`,
  GET_COLLECTION_DETAIL: (collectionId) => `${API_BE_URL}/collection/${collectionId}`,
  CREATE_COLLECTION: `${API_BE_URL}/collection/create-collection`,
  DELETE_COLLECTION: (collectionId) => `${API_BE_URL}/collection/delete/${collectionId}`,
  EDIT_COLLECTION: (collectionId) => `${API_BE_URL}/collection/edit-collection/${collectionId}`,
}

// Cart API Endpoints
export const CART_API_ENDPOINTS = {
  GET_CART: `${API_BE_URL}/cart/`,
  ADD_TO_CART: `${API_BE_URL}/cart/addItem`,
  DELETE_ITEM: (productId) => `${API_BE_URL}/cart/removeItem/${productId}`,
  DELETE_ALL_ITEM: `${API_BE_URL}/cart/removeAllItem/`,
  UPDATE_QUANTITY: (productId) => `${API_BE_URL}/cart/update-quantity/${productId}`,
}

// Coupon API Endpoints
export const COUPON_API_ENDPOINTS = {
  GET_COUPON: `${API_BE_URL}/coupon/`,
  CREATE_COUPON: `${API_BE_URL}/coupon/create`,
  DELETE_COUPON: (couponId) => `${API_BE_URL}/coupon/delete/${couponId}`,
  VALIDATE_COUPON: `${API_BE_URL}/coupon/validate/`,
  APPLIED_COUPON: `${API_BE_URL}/coupon/appliedCoupon/`,
}

// Payment API Endpoints
export const PAYMENT_API_ENDPOINTS = {
  CREATE_CHECKOUT_SESSION: `${API_BE_URL}/payment/create-checkout-session`,
  SUCCESS_CHECKOUT_SESSION: `${API_BE_URL}/payment/checkout-success`,
  CREATE_CHECKOUT_SUCCESS_COD: `${API_BE_URL}/payment/create-checkout-cod`,
  CREATE_CHECKOUT_SUCCESS_QRCODE: `${API_BE_URL}/payment/create-checkout-qrcode`,
  CREATE_CHECKOUT_SUCCESS_PAYPAL: `${API_BE_URL}/payment/create-checkout-paypal`,
}

// Analytic API Endpoints
export const ANALYTIC_API_ENDPOINTS = {
  GET_ANALYTIC: `${API_BE_URL}/analytic/`,
}

// Analytic API Endpoints
export const AUTH_API_ENDPOINTS = {
  GET_USER_PROFILE: `${API_BE_URL}/auth/user-profile`,
}
