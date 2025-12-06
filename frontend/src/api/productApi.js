
import axiosClient from "./axiosClient";

export const getProducts = () => axiosClient.get("/products");

export const getProductById = (id) => axiosClient.get(`/product/${id}`);

export const searchProducts = (keyWord) => axiosClient.get(`/products/search?keyword=${keyWord}`);

// export const filterProductsByCategory = (categoryId) => axiosClient.get(`/products/category/${categoryId}`);

export const updateProduct = (id, formData) => axiosClient.put(`/product/${id}`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
);

export const createProduct =(formData) => axiosClient.post('/products', formData,
      {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });

export const deleteProduct = (id) => axiosClient.delete(`/product/${id}`);

export const imageData = (id) => axiosClient.get(`/product/${id}/image`
    ,{
      responseType: 'arraybuffer',
    }
);