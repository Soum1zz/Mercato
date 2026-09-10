import axiosClient from "./axiosClient";

export const updateCustomerProfile = (data) =>
  axiosClient.put("/api/me", data);

export const updateCustomerImage = (userId, imgUrl) =>
  axiosClient.put(`/api/user/${userId}/image`, { imgUrl });

export const getCustomerWishlist = () =>
  axiosClient.get("/api/me/wishlist");