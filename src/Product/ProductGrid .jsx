import React from "react";
import ProductCard from "./ListProduct";

const ProductGrid = () => {
  const products = Array(10).fill({
    title: "Chrome Watch",
    image: "https://placehold.co/200x200",
    price: "$399",
  });

  

  return (
    <main className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </main>
  );
};

export default ProductGrid;
