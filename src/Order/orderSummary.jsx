import { useState } from "react";

export default function OrderSummary() {

    

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition duration-500 hover:scale-105">
        <h2 className="text-lg font-semibold text-purple-600 mb-4">
          ORDER SUMMARY
        </h2>
        <p className="text-gray-700 mb-4">Order #ORD-12345</p>

        {/* Order Items */}
        <div className="border-t border-b py-4 mb-4">
          {[
            {
              name: "Product 1",
              qty: 2,
              price: "$19.99",
              img: "https://placehold.co/50x50",
            },
            {
              name: "Product 2",
              qty: 1,
              price: "$29.99",
              img: "https://placehold.co/50x50",
            },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-12 h-12 mr-4 rounded"
                />
                <div>
                  <p className="text-gray-700">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.qty}</p>
                </div>
              </div>
              <p className="text-gray-700">{item.price}</p>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-gray-700">Subtotal</p>
            <p className="text-gray-700">$69.97</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-700">Shipping</p>
            <p className="text-gray-700">Free</p>
          </div>
          <div className="flex justify-between font-semibold">
            <p className="text-gray-700">Total</p>
            <p className="text-gray-700">$69.97</p>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div className="mb-4">
          <h3 className="text-gray-700 font-semibold mb-2">Delivery Address</h3>
          <p className="text-gray-700">123 Main St.</p>
          <p className="text-gray-700">Anytown, 12345</p>
          <p className="text-gray-700">USA</p>
        </div>
        <div className="mb-4">
          <h3 className="text-gray-700 font-semibold mb-2">Payment Method</h3>
          <p className="text-gray-700">💳 Credit Card</p>
        </div>

        <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300">
          Confirm Order
        </button>
      </div>
    </div>
  );
}
