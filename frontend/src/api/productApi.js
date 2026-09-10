import axiosClient from "./axiosClient";

export const getProducts = () =>
  axiosClient.get("/api/product");

export const getProductById = (id) =>
  axiosClient.get(`/api/product/${id}`);

export const getProductRating = (id) =>
  axiosClient.get(`/api/product/${id}/rating`);

export const getProductComments = (id) =>
  axiosClient.get(`/api/product/${id}/comments`);

export const addProductComment = (id, commentData) =>
  axiosClient.post(`/api/product/${id}/comments`, commentData);

export const updateProductComment = (id, commentData) =>
  axiosClient.put(`/api/product/${id}`, commentData);

export const getUserCommentOnProduct = (id) =>
  axiosClient.get(`/api/product/${id}/user/comment`);

export const checkWishlistStatus = (productId) =>
  axiosClient.get(`/api/me/product/${productId}/wishlist`);

export const addToWishlist = (productId) =>
  axiosClient.put(`/api/me/product/${productId}/wishlist`);

export const removeFromWishlist = (productId) =>
  axiosClient.delete(`/api/me/product/${productId}/wishlist`);

export const toggleWishlist = (productId, isWishlisted) =>
  isWishlisted ? removeFromWishlist(productId) : addToWishlist(productId);

export const searchProducts = (keyword, category) => {
  let url = "/api/product/search";
  const params = [];
  if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  if (params.length > 0) url += `?${params.join("&")}`;
  return axiosClient.get(url);
};

export const getProductsByCategory = (category) =>
  axiosClient.get(`/api/product/category/${encodeURIComponent(category)}`);