import api from "../Api";

export const getInfoUser = (loginRequest) => api.post("/user/info",loginRequest);

export const getUserId = (id) => api.get(`/cart/${id}`);

export const resetPassword = (resetPasswordRequest) => api.put("/user/update/info-user",resetPasswordRequest);