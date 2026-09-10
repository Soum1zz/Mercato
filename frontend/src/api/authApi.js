import axiosClient from "./axiosClient";

export const loginUser = (credentials) =>
  axiosClient.post("/auth/login", credentials);

export const registerUser = (userData) =>
  axiosClient.post("/auth/register", userData);

export const getMe = () =>
  axiosClient.get("/auth/me");

export const checkValidEmail = (email) =>
  axiosClient.get(`/api/valid-email?email=${encodeURIComponent(email)}`);

export const requestOtp = (email) =>
  axiosClient.post("/api/request-otp", { email });

export const verifyOtp = (email, otp) =>
  axiosClient.post("/api/verify-otp", { email, otp });

export const requestResetLink = (email) =>
  axiosClient.post("/api/link-req", { email });

export const resetPassword = (data) =>
  axiosClient.post("/api/reset-password", data);
