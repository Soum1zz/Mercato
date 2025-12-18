
import axiosClient from "./axiosClient";

export const getProducts = () => axiosClient.get("/products");

export const getProductById = (id) => axiosClient.get(`/product/${id}`);

export const searchProducts = (keyWord) => axiosClient.get(`/products/search?keyword=${keyWord}`);

// export const filterProductsByCategory = (categoryId) => axiosClient.get(`/products/category/${categoryId}`);

export const createProduct = (formData) =>
  axiosClient.post("/products", formData);

export const updateProduct = (id, formData) =>
  axiosClient.put(`/product/${id}`, formData);


export const deleteProduct = (id) => axiosClient.delete(`/product/${id}`);

export const imageData = (id) => axiosClient.get(`/product/${id}/image`
    ,{
      responseType: 'arraybuffer',
    }
);