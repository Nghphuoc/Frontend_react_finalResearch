import CartItem from "./CartItem";
import React, { useEffect, useState, useRef } from "react";
import SummaryRow from "./CartSumary";
import NavBar from "../Nav/Navbar";
import Footer from "../Foot/Footer";
import {
  checkStatusPayment,
  getCartId,
  getPayment,
  order,
} from "./CartService";
import { useNavigate } from "react-router-dom";
import "./scroll.css";
import { deleteProductDetail } from "./CartService";
import toast, { Toaster } from "react-hot-toast";
import OrderPopup from "./OrderPopup";

const Cart = () => {
  const shipping = 3.33;
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const userId = sessionStorage.getItem("userId");
  const [typeBanking, setTypeBanking] = useState("");
  const cartId = sessionStorage.getItem("cartId");
  const [note, setNote] = useState("");
  const [orderDataToPopup, setOrderDataToPopup] = useState({});
  const [openPopUp, setOpenPopup] = useState(false);

  useEffect(() => {
    requestDataCart();

    if (sessionStorage.getItem("paymentPending")) {
      sessionStorage.removeItem("paymentPending"); // Xóa cờ

      const params = new URLSearchParams(window.location.search);
      console.log("param:" + params);
      const paymentData = {
        amount: params.get("vnp_Amount"),
        bankCode: params.get("vnp_BankCode"),
        orderInfo: params.get("vnp_OrderInfo"),
        responseCode: params.get("vnp_ResponseCode"),
        code: params.get("vnp_TxnRef"),
        date: params.get("vnp_PayDate"),
      };

      setOrderDataToPopup(paymentData);

      setOpenPopup(true);
      if (paymentData.responseCode === "00") {
        sendOrderToBackend();
      }
    }
  }, []);

 
  const requestDataCart = async () => {
    const dataCart = await getCartId(cartId);
    setCartData(
      dataCart.data.productCartQuantities.sort(
        (a, b) => a.productId - b.productId
      )
    );
  };

  // get id to product add order
  const handleCheckboxChange = (productId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    ); // save id product which customer want checkbox to order
  };

  const calculateTotal = (products, selectedItems) => {
    return products
      .filter((product) => selectedItems.includes(product.productId))
      .reduce((total, product) => total + product.price * product.quantity, 0);
  };

  ///
  // const dynamicProductQuantities = cartData
  //   .filter((product) => selectedItems.includes(product.productId))
  //   .map((product) => ({
  //     productId: product.productId,
  //     quantity: product.quantity,
  //   }));

  let total = calculateTotal(cartData, selectedItems);
  let totalItems = total + shipping;
  if (totalItems === 3.33) {
    totalItems = 0;
  }

  //
  const sendOrderToBackend = async () => {
    const savedSelectedItems =
      JSON.parse(sessionStorage.getItem("selectedItems"))?.map(Number) || [];
    const savedTypeBanking = sessionStorage.getItem("typeBanking") || "";
    const savedNote = sessionStorage.getItem("note") || "";
    const savedTotalItems = sessionStorage.getItem("totalItems") || 0;
    const cartDataString = sessionStorage.getItem("cartData");
    const savedCartData = cartDataString ? JSON.parse(cartDataString) : [];
    
    const dynamicProductQuantities = savedCartData
      .filter((product) => savedSelectedItems.includes(product.productId))
      .map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
      }));

  
    const total = calculateTotal(savedCartData, savedSelectedItems);
    let totalItems = total + shipping;
    if (totalItems === 3.33) {
      totalItems = 0;
    }

    if (!savedTypeBanking || savedTypeBanking === "0") {
      toast.error("Please select a payment method.");
      return;
    }

    const orderData = {
      status: "Ordered",
      orderName: "Test Order",
      order_date: new Date().toISOString(),
      note: savedNote,
      statusBanking: savedTypeBanking,
      totalPrice: savedTotalItems,
      user: {
        userId: userId,
      },
      productQuantities: dynamicProductQuantities,
    };

    console.log("Sending order data:", orderData);
    ////// here
    try {
      const response = await order(orderData);
      console.log("Response from backend:", response.data);
      deleteProduct(savedSelectedItems);
    } catch (error) {
      console.error("Error sending order:", error);
    }

    // 🔹 Xóa dữ liệu đã lưu
    sessionStorage.removeItem("selectedItems");
    sessionStorage.removeItem("typeBanking");
    sessionStorage.removeItem("note");
    sessionStorage.removeItem("totalItems");
    sessionStorage.removeItem("cartData");

    requestDataCart();
  };

  async function deleteProduct(productId) {
    const removeCartResponse = await deleteProductDetail(cartId, productId);
    if (removeCartResponse.data) {
      //toast.success("Product removed from cart");
      requestDataCart(); // Gọi lại để cập nhật danh sách sản phẩm
      console.log(removeCartResponse);
    } else {
      toast.error("Error removing product from cart");
    }
  }

  async function paymentCall(amount) {
    if(total === 0){
      toast.error("Please select a product to checkout");
      return;
    }
    const paymentResponse = await getPayment(amount);
    // 🔹 Lưu dữ liệu vào sessionStorage
    sessionStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    sessionStorage.setItem("typeBanking", typeBanking);
    sessionStorage.setItem("note", note);
    sessionStorage.setItem("totalItems", totalItems);
    sessionStorage.setItem("cartData", JSON.stringify(cartData));

    // Chuyển hướng đến trang thanh toán
    sessionStorage.setItem("paymentPending", "true");
    window.location.href = paymentResponse.data.url;
  }

  return (
    <>
      <NavBar />
      <Toaster />

      <OrderPopup
        isOpen={openPopUp}
        onClose={() => setOpenPopup(false)}
        order={orderDataToPopup}
      />

      <div className="bg-white flex justify-center items-start min-h-screen px-4 sm:px-8 md:px-12 lg:px-24 py-8 ">
        
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Cart Items Column with scrollable feature */}

          <div className="w-full lg:w-2/3 flex flex-col gap-6 overflow-y-auto max-h-screen pr-4 scrollbar-hide">
            {cartData.map((item) => (
              <CartItem
                className="w-full"
                key={item.productId}
                item={item}
                requestDataCart={requestDataCart}
                onCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>

          {/* Summary Column fixed */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-auto sticky top-0">
            <h2 className="text-lg font-semibold mb-4">
              added to cart. Make sure all are correct and click to{" "}
              <span className="text-green-500 cursor-pointer">check out</span>{" "}
              for the next step.
            </h2>
            <div className="mb-4 border-t pt-4">
              <SummaryRow label="Item Total" value={`$${total.toFixed(2)}`} />
              {/* <SummaryRow label="Discount" value={`-$${discount.toFixed(2)}`} /> */}

              <SummaryRow
                label="Shipping (Express Shipping)"
                value={`$${shipping.toFixed(2)}`}
              />
              <SummaryRow
                label="Sub total"
                value={`$${totalItems.toFixed(2)}`}
              />
            </div>
            <div className="flex justify-between text-xl font-semibold border-t pt-4 mb-4">
              <span>Total</span>
              <span>${totalItems.toFixed(2)}</span>
            </div>

            {/* Input Note */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mb-2 w-full h-24 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your note here..."
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose Payment Method{" "}
              <label className=" text-sm font-medium text-red-500 ">*</label>
            </label>
            <select
              value={typeBanking}
              onChange={(e) => setTypeBanking(e.target.value)}
              className="text-center mb-5 block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="0">--Select Banking--</option>
              <option value="Cash">Cash</option>
              <option value="Momo">Momo</option>
              <option value="VietComBank">VietComBank</option>
              <option value="vnPay">vnPay</option>
            </select>

            <button
              className=" w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold"
              onClick={(e) => paymentCall(totalItems)}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
