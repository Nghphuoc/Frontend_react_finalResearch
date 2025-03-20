import api from "../Api";

export const getUserInfo =(id)=> api.get("/user/personal/"+id);

export const getOrderDetail = (id) => api.get("/order/"+id);

export const updateUserProfile = (id, user) => api.put("/user/personal/"+id, user);