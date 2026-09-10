import axiosClient from "./axiosClient";

export const getSellerProducts = (sellerId) =>
  axiosClient.get(`/seller/${sellerId}/products`);

export const getSellerDetails = (sellerId) =>
  axiosClient.get(`/seller/${sellerId}/details`);

export const submitSellerDetails = (sellerId, data) =>
  axiosClient.post(`/seller/${sellerId}/details`, data);

export const createSellerProduct = (productData) =>
  axiosClient.post("/seller/products", productData);

export const updateSellerProduct = (productId, productData) =>
  axiosClient.put(`/seller/product/${productId}`, productData);

export const deleteSellerProduct = (productId) =>
  axiosClient.delete(`/seller/product/${productId}`);
