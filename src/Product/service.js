import axios from "axios"

const API = "http://localhost:8080/api/product"

export const getAllProduct = () =>axios.get(API)

export const AddProduct = (product) => axios.post(API+"/"+product)

export const getProduct = (id) => axios.get(API+"/"+id)

