import axios from "axios"
import api from "../Api"

const API = "http://localhost:8080/api/product"

export const getAllProduct = () =>axios.get(API)

export const AddProduct = (product) => axios.post(API,product)

export const getProduct = (id) => axios.get(API+"/"+id)

export const addProductToCart = (cartId, productId) => api.put("/cart/addProduct/"+cartId+"/" + productId)

export const getAllCategory = () => api.get("/category")