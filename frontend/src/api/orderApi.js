import axiosClient from "./axiosClient";

export const getCustomerOrders= (id)=> axiosClient.get(`/customer/${id}/orders`);

export const placeorder= (id, FormData)=> axiosClient.post(`/customer/${id}/orders`, FormData);

export const getOrderById= (id)=> axiosClient.get(`/orders/${id}`);

export const deleteOrder= (id)=> axiosClient.delete(`/orders/${id}`);