import React from "react";
import ProductCard from "./ListProduct";
import { getAllProduct } from "./service";
import { useState, useEffect } from "react";

const ProductGrid = () => {
  const products = Array(10).fill({
    title: "Chrome Watch",
    image: "https://placehold.co/200x200",
    price: "$399",
  });

  const [allProduct, setAllProduct] = useState([]); // Initialize as an empty array

  useEffect(() => {
    getAllProduct()
      .then((response) => {
        setAllProduct(response.data); // Set the fetched data to state
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <main className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {allProduct.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </main>
  );
};

export default ProductGrid;
