import Api from "../Api";

export const getAllOrder = () =>  Api.get("/order");

export const updateStatusOrder = (id,status) => Api.put(`/order/update/${id}`,status);

export const deleteProduct = (id) => Api.delete(`/product/${id}`);

export const UpdateProductSale = (id) => Api.put("/product/sale",id);