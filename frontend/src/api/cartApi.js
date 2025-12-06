import axiosClient from "./axiosClient";

export const getCart = (customerId ) => axiosClient.get(`/customer/${customerId}/cart`,);

export const updateCart = (customerId, formData ) => axiosClient.put(`/customer/${customerId}/cart/items`, formData);

export const deleteCart = (customerId) => axiosClient.delete(`/customer/${customerId}/cart`);

export const deleteCartItem = (customerId, productId)=> axiosClient.delete(`/customer/${customerId}/cart/items/${productId}`);