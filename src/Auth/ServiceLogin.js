import api from "../Api";

export const getInfoUser = (loginRequest) => api.post("/user/info",loginRequest);

export const getUserId = (id) => api.get(`/cart/${id}`);