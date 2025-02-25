const API_BE_URL = "http://localhost:5002/api";

export const PRODUCT_API_ENDPOINTS = {
  GET_PRODUCT: `${API_BE_URL}/product`,
  GET_PRODUCT_DETAIL: (productId) => `${API_BE_URL}/product/${productId}`,
  CREATE_PRODUCT: `${API_BE_URL}/product/create-product`,
  EDIT_PRODUCT: (productId) => `${API_BE_URL}/product/edit-product/${productId}`,
  DELETE_PRODUCT: (productId) => `${API_BE_URL}/product/delete/${productId}`,
  FEATURE_PRODUCT: (productId) => `${API_BE_URL}/product/toggle/${productId}`,
  GET_PRODUCT_BY_CATEGORY: (category) => `${API_BE_URL}/product/category/${category}`,
}