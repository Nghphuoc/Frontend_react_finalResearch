import React from "react";

const ProductCard = ({ product }) => {

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 text-center transform transition hover:scale-105">
      <img
        src={product.image}
        alt={product.title}
        className="mx-auto mb-4 rounded-lg"
      />
      <h2 className="font-bold text-lg">{product.title}</h2>
      <div className="text-yellow-500 mb-2 flex justify-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
      </div>
      <p className="text-gray-700 mb-4"> {product.price}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Add to cart
      </button>
    </div>
    
  );
};

export default ProductCard;
