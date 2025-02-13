import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {

  const navigate = useNavigate();

  function handleClickMoreInfo(id){
    navigate(`/detail/${id}`); // more information product
  }

  function handleClickAddToCart(id){
    console.log(id);
    navigate(`/home/${id}`); // buy now
  }

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 text-center transform transition hover:scale-105" //hover:scale-105 when you hover on the card will big more nomarl
      onClick={() => handleClickMoreInfo(product.productId)}
    >
      <img
        src={product.imageUrl}
        alt={product.productName}
        className="mx-auto mb-4 rounded-lg"
      />
      <h2 className="font-bold text-sm">{product.productName}</h2>
      <div className="text-yellow-500 mb-2 flex justify-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
      </div>
      <p className="text-red-500 mb-4"> ${product.price}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        onClick={() => handleClickAddToCart(product.productId)}
      >
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
