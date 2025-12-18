import axiosClient from "./axiosClient";

export const getCustomers=()=> axiosClient.get('/customers');

export const getCustomerById= (id)=> axiosClient.get(`/customer/${id}`);

export const getCustomerOrders= (id)=> axiosClient.get(`/customer/${id}/orders`);

export const getCustomerComments= (id)=> axiosClient.get(`/customer/${id}/comments`);

export const addCustomer= (formData)=> axiosClient.post(`/customers`, formData,
    {
    headers: {
            'Content-Type': 'multipart/form-data',
        }
});

export const updateCustomer= (id, formData)=> axiosClient.put(`/customer/${id}`, formData,
    {
    headers: {
            'Content-Type': 'multipart/form-data',
        }
});

export const deleteCustomer= (id)=> axiosClient.delete(`/customer/${id}`);