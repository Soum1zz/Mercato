import axiosClient from "./axiosClient";

export const getCart = () =>
  axiosClient.get("/api/me/cart");

export const updateCart = (itemData) =>
  axiosClient.put("/api/me/cart", itemData);

export const deleteCart = () =>
  axiosClient.delete("/api/me/cart");

export const deleteCartItem = (productId) =>
  axiosClient.delete(`/api/me/cart/items/${productId}`);

export const checkoutCart = (paymentData) =>
  axiosClient.post("/api/me/cart/checkout", paymentData);

export const placeOrderFromCart = () =>
  axiosClient.post("/api/me/cart/order");