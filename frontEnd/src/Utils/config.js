const API_BE_URL = "http://localhost:5002/api";

export const PRODUCT_API_ENDPOINTS = {
  GET_PRODUCT: `${API_BE_URL}/product`,
  CREATE_PRODUCT: `${API_BE_URL}/product/create-product`,
  DELETE_PRODUCT: (productId) => `${API_BE_URL}/product/delete/${productId}`,
  FEATURE_PRODUCT: (productId) => `${API_BE_URL}/product/toggle/${productId}`
}