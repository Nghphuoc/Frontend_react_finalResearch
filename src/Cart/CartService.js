import api from "../Api";

export const getCartId = (id) => api.get(`/cart/${id}`);

export const removeItemOnCart = (cartId,productId) => api.put(`/cart/removeProduct/${cartId}/${productId}`);