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
      <Toaster />
      <div
        className="bg-white shadow-lg rounded-lg p-4 items-center text-center transform transition hover:scale-105 " //hover:scale-105 when you hover on the card will big more nomarl (transform transition)
      >
        {/* <div className="absolute top-2 right-2">
          <span className="font-semibold text-white text-xs bg-red-500 px-2 py-1 rounded">
            sold: {product.number_Of_Purchases}
          </span>
        </div> */}

        {/* Nhãn giảm giá */}
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg">
          Giảm 11%
        </div>

        {/* Số lượt yêu thích */}
        {/* <div className="absolute top-0 right-0 bg-pink-300 text-white text-xs font-bold px-2 py-1 rounded-bl-lg flex items-center space-x-1">
          <span>8</span> ❤️ <span>3</span>
        </div> */}

        <img
          src={product.imageUrl}
          alt={product.productName}
          className=" h-44 object-cover mx-auto mb-4 rounded-lg "
          onClick={() => handleClickMoreInfo(product.productId)}
        />
        <h4 className="font-bold text-left text-sm">{product.productName}</h4>
        <div className="text-yellow-500 mb-2 flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fas fa-star"></i>
          ))}
        </div>
        <p className="text-red-500 font-semibold text-center  mb-4">
          {" "}
          ${product.price}
        </p>
       
      </div>
    </>
  );
};

export default ProductCard;
