import axiosClient from "./axiosClient";    

export const getProductComments= (productId)=> axiosClient.get(`/product/${productId}/comments`);

export const getCommentById= (commentId)=> axiosClient.get(`/comment/${commentId}`);

export const getCustomerComments=(customerId)=> axiosClient.get(`/customer/${customerId}/comments`);

export const addComment=(productId, formData)=> axiosClient.post(`/product/${productId}/comments`, formData,
    {
    headers: {
            'Content-Type': 'multipart/form-data',
        }
});

export const updateComment=(commentId, formData)=> axiosClient.post(`/comments/${commentId}`, formData,
    {
    headers: {
            'Content-Type': 'multipart/form-data',
        }
});

export const deleteComment=(commentId)=> axiosClient.delete(`/comment/${commentId}`);