import api from "../Api";

export const getUserInfo =(id)=> api.get("/user/personal/"+id);