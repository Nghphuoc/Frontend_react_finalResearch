// import CartItem from "./CartItem";
// import React, { useEffect, useState } from "react";
// import SummaryRow from "./CartSumary";
// import NavBar from "../Nav/Navbar";
// import Footer from "../Foot/Footer";
// import { getCartId } from "./CartService";
// import { useNavigate } from "react-router-dom";



// //const [productList, setProductList] = useState([]);

// //setProductList(dataCart.data.products);

// const Cart = () => {
//   const [cart, setCart] = useState([]);

//   const removeItem = (id) => {
//     setCart(cart.filter((item) => item.id !== id));
//   };

//   const updateQuantity = (id, quantity) => {
//     setCart(
//       cart.map((item) =>
//         item.id === id ? { ...item, quantity: Number(quantity) } : item
//       )
//     );
//   };

//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//   const subtotal = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   const discount = 50.0;
//   const shipping = 14.33;
//   const total = subtotal - discount + shipping;

//   const [cartData, setCartData] = useState([]);
//   const navigate = useNavigate();
//   useEffect(() => {
//     requestDataCart();
//   }, []);

//   const requestDataCart = async () => {
//     const cartId = localStorage.getItem("cartId");
//     const dataCart = await getCartId(cartId);
//     setCartData(dataCart.data.products);
//     console.log(dataCart.data.products);
//     //const name = localStorage.getItem("userName");
//   };


//   return (
//     <>
//       <NavBar />

//       <div className="bg-white flex justify-center items-center min-h-screen pl-[80px] pr-[80px] pb-[80px] ">
//         <div className=" w-full mx-auto p-6 flex flex-col lg:flex-row gap-6">
//           <div className="w-full lg:w-2/3">
//             {cartData.map((item) => (
//               <CartItem
//                 className="max-w-[100px] max-h-[250]"
//                 key={item.productId}
//                 item={item}
//                 removeItem={removeItem}
//                 updateQuantity={updateQuantity}
                
//               />
//             ))}
//           </div>

//           <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-96">
//             <h2 className="text-lg font-semibold mb-4">
//               {totalItems} product added to cart, Make sure all are correct and
//               click to{" "}
//               <span className="text-blue-500 cursor-pointer">check out</span>{" "}
//               for next step.
//             </h2>
//             <div className="mb-4 border-t pt-4">
//               <SummaryRow
//                 label="Item Total"
//                 value={`$${subtotal.toFixed(2)}`}
//               />
//               <SummaryRow label="Discount" value={`-$${discount.toFixed(2)}`} />
//               <SummaryRow label="Sub total" value={`$${subtotal.toFixed(2)}`} />
//               <SummaryRow
//                 label="Shipping (Express Shipping)"
//                 value={`$${shipping.toFixed(2)}`}
//               />
//             </div>
//             <div className="flex justify-between text-xl font-semibold border-t pt-4 mb-4">
//               <span>Total</span>
//               <span>${total.toFixed(2)}</span>
//             </div>
//             <button className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold">
//               Checkout
//             </button>
//             <div className="mt-4 text-center">
//               {/* <span className="text-blue-500 cursor-pointer">
//                 Add your promo code
//               </span> */}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Cart;


import CartItem from "./CartItem";
import React, { useEffect, useState } from "react";
import SummaryRow from "./CartSumary";
import NavBar from "../Nav/Navbar";
import Footer from "../Foot/Footer";
import { getCartId } from "./CartService";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 50.0;
  const shipping = 14.33;
  const total = subtotal - discount + shipping;

  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    requestDataCart();
  }, []);

  const requestDataCart = async () => {
    const cartId = localStorage.getItem("cartId");
    const dataCart = await getCartId(cartId);
    
    setCartData(dataCart.data.products);
    console.log(dataCart.data.products);
  };

  return (
    <>
      <NavBar />

      <div className="bg-white flex justify-center items-center min-h-screen px-4 sm:px-8 md:px-12 lg:px-24 py-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Cart Items Column */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {cartData.map((item) => (
              <CartItem
                className="w-full"
                key={item.productId}
                item={item}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* Summary Column */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-auto">
            <h2 className="text-lg font-semibold mb-4">
              {totalItems} product{totalItems !== 1 && "s"} added to cart. Make
              sure all are correct and click to{" "}
              <span className="text-blue-500 cursor-pointer">check out</span>{" "}
              for the next step.
            </h2>
            <div className="mb-4 border-t pt-4">
              <SummaryRow
                label="Item Total"
                value={`$${subtotal.toFixed(2)}`}
              />
              <SummaryRow label="Discount" value={`-$${discount.toFixed(2)}`} />
              <SummaryRow label="Sub total" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow
                label="Shipping (Express Shipping)"
                value={`$${shipping.toFixed(2)}`}
              />
            </div>
            <div className="flex justify-between text-xl font-semibold border-t pt-4 mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold">
              Checkout
            </button>
            <div className="mt-4 text-center">
              {/* Optional: Add your promo code */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
