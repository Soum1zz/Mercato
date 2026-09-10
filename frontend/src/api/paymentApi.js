import axiosClient from "./axiosClient";

export const createPaymentOrder = (amount, currency = "INR") =>
  axiosClient.post(`/api/payment/create-order?amt=${amount}&cur=${currency}`);

export const verifyPaymentSignature = (data) =>
  axiosClient.post("/api/payment/verify", data);
