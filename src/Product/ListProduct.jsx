import React from "react";
import { useNavigate } from "react-router-dom";
import { addProductToCart } from "./service";
import toast, { Toaster } from "react-hot-toast";

const ProductCard = ({ product }) => {

  const navigate = useNavigate();
  const cartId = sessionStorage.getItem("cartId");

  function handleClickMoreInfo(id){
    navigate(`/detail/${id}`); // more information product
  }

  const handleClickAddToCart = async (productId)=> {
    if(!cartId || !productId){
      toast.error("You must be logged in to add products to cart");
      navigate("/home");
      return;
    }
    const cartResponse = await addProductToCart(cartId,productId);
    if(cartResponse) {
      toast.success("add product success");
    }else{
    toast.error("add product failed");
  }
}

  return (
    <>
    <Toaster/>
      <div
        className="bg-white shadow-lg rounded-lg p-4 text-center transform transition hover:scale-105" //hover:scale-105 when you hover on the card will big more nomarl (transform transition)
      >
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="mx-auto mb-4 rounded-lg"
          onClick={() => handleClickMoreInfo(product.productId)}
        />
        <h4 className="font-bold text-left text-sm">{product.productName}</h4>
        <div className="text-yellow-500 mb-2 flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fas fa-star"></i>
          ))}
        </div>
        <p className="text-red-500 font-semibold mb-4"> ${product.price}</p>
        <button
          className=" bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          onClick={() => handleClickAddToCart(product.productId)}
        >
          Add to cart
        </button>
      </div>
    </>
  );
};

export default ProductCard;
