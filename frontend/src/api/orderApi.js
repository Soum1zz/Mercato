import axiosClient from "./axiosClient";

export const getUserOrders = () =>
  axiosClient.get("/api/me/orders");

export const getOrderById = (id) =>
  axiosClient.get(`/api/orders/${id}`);

export const createOrder = (orderData) =>
  axiosClient.post("/api/me/orders", orderData);