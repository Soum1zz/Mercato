import axiosClient, { API_BASE_URL } from "./axiosClient";

export const getUserImageUrl = (userId) =>
  userId ? `${API_BASE_URL}/api/user/${userId}/image` : "";

export const updateCustomerProfile = (data) =>
  axiosClient.put("/api/me", data);

export const updateCustomerImage = (userId, imgUrl) =>
  axiosClient.put(`/api/user/${userId}/image`, { imgUrl });

export const getCustomerWishlist = () =>
  axiosClient.get("/api/me/wishlist");