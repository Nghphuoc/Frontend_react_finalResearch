import api from "../Api";

export const getCartId = (id) => api.get(`/cart/${id}`);

export const removeItemOnCart = (cartId,productId) => api.put(`/cart/removeProduct/${cartId}/${productId}`);

export const order = (orderData) => api.post('/order',orderData);

export const deleteProductDetail = (cartId,productId) => api.put(`/cart/removeProductDetail/${cartId}/${productId}`)