import axiosClient from "./axiosClient";

export const getAdminStats = () =>
  axiosClient.get("/admin/stats");

export const getSellerRequests = () =>
  axiosClient.get("/admin/seller/requests");

export const getSellerCertificate = (sellerId) =>
  axiosClient.get(`/admin/seller/${sellerId}/certificate`);

export const approveSeller = (sellerId) =>
  axiosClient.put(`/admin/sellers/${sellerId}/approve`);

export const getAllUsers = () =>
  axiosClient.get("/admin/users");

export const getUserById = (userId) =>
  axiosClient.get(`/admin/user/${userId}`);
