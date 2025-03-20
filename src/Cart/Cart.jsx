import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CartItem from "./CartItem";
import SummaryRow from "./CartSumary";
import NavBar from "../Nav/Navbar";
import Footer from "../Foot/Footer";
import OrderPopup from "./OrderPopup";
import {
  checkStatusPayment,
  getCartId,
  getPayment,
  order,
  deleteProductDetail,
} from "./CartService";
import "./scroll.css";
import {
  FaShoppingCart,
  FaCreditCard,
  FaMoneyBill,
  FaMobileAlt,
  FaUniversity,
} from "react-icons/fa";
import { BsCheckCircleFill, BsExclamationCircleFill } from "react-icons/bs";

const Cart = () => {
  const SHIPPING_FEE = 3.33;
  const navigate = useNavigate();

  // State management
  const [cartData, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [typeBanking, setTypeBanking] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderDataToPopup, setOrderDataToPopup] = useState({});
  const [openPopUp, setOpenPopup] = useState(false);

  // Get stored values
  const userId = sessionStorage.getItem("userId");
  const cartId = sessionStorage.getItem("cartId");
  const userPhone = sessionStorage.getItem("phone");
  const userAddress = sessionStorage.getItem("adrress");
console.log(userAddress)
  useEffect(() => {
    requestDataCart();
    checkPendingPayment();
  }, []);

  const checkPendingPayment = () => {
    if (sessionStorage.getItem("paymentPending")) {
      sessionStorage.removeItem("paymentPending");

      const params = new URLSearchParams(window.location.search);
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
      } else {
        toast.error("Payment failed. Please try again.");
      }
    }
  };

  const requestDataCart = async () => {
    try {
      setIsLoading(true);
      const dataCart = await getCartId(cartId);
      if (dataCart && dataCart.data && dataCart.data.productCartQuantities) {
        setCartData(
          dataCart.data.productCartQuantities.sort(
            (a, b) => a.productId - b.productId
          )
        );
      } else {
        setCartData([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart data", error);
      toast.error("Failed to load your cart. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const calculateTotal = (products, selectedItems) => {
    return products
      .filter((product) => selectedItems.includes(product.productId))
      .reduce((total, product) => total + product.price * product.quantity, 0);
  };

  const sendOrderToBackend = async () => {
    const savedSelectedItems =
      JSON.parse(sessionStorage.getItem("selectedItems"))?.map(Number) || [];
    const savedTypeBanking = sessionStorage.getItem("typeBanking") || "";
    const savedNote = sessionStorage.getItem("note") || "";
    const savedTotalItems =
      parseFloat(sessionStorage.getItem("totalItems")) || 0;
    const cartDataString = sessionStorage.getItem("cartData");
    const savedCartData = cartDataString ? JSON.parse(cartDataString) : [];

    try {
      const dynamicProductQuantities = savedCartData
        .filter((product) => savedSelectedItems.includes(product.productId))
        .map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
        }));

      if (!savedTypeBanking || savedTypeBanking === "0") {
        toast.error("Please select a payment method.");
        return;
      }

      const orderData = {
        status: "Ordered",
        orderName: "Order " + new Date().toISOString().slice(0, 10),
        order_date: new Date().toISOString(),
        note: savedNote,
        statusBanking: savedTypeBanking,
        totalPrice: savedTotalItems,
        user: {
          userId: userId,
        },
        productQuantities: dynamicProductQuantities,
      };

      const response = await order(orderData);
      if (response && response.data) {
        toast.success("Order placed successfully!");
        await deleteProduct(savedSelectedItems);
      }
    } catch (error) {
      console.error("Error sending order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      // Clean up session storage
      sessionStorage.removeItem("selectedItems");
      sessionStorage.removeItem("typeBanking");
      sessionStorage.removeItem("note");
      sessionStorage.removeItem("totalItems");
      sessionStorage.removeItem("cartData");

      requestDataCart();
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const removeCartResponse = await deleteProductDetail(cartId, productId);
      if (removeCartResponse.data) {
        requestDataCart();
      } else {
        toast.error("Error removing product from cart");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to remove product from cart");
    }
  };

  const initiatePayment = async () => {
    const total = calculateTotal(cartData, selectedItems);
    const totalItems = total > 0 ? total + SHIPPING_FEE : 0;

    if(userAddress === null || userPhone === null){
      toast.error("Please update your address and phone number in your profile") 
      return;
    }

    if (total === 0 ) {
      toast.error("Please select at least one product to checkout", {
        icon: <BsExclamationCircleFill className="text-red-500" />,
      });
      return;
    }

    if (!typeBanking || typeBanking === "0") {
      toast.error("Please select a payment method", {
        icon: <BsExclamationCircleFill className="text-red-500" />,
      });
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Save data before redirecting
      sessionStorage.setItem("selectedItems", JSON.stringify(selectedItems));
      sessionStorage.setItem("typeBanking", typeBanking);
      sessionStorage.setItem("note", note);
      sessionStorage.setItem("totalItems", totalItems);
      sessionStorage.setItem("cartData", JSON.stringify(cartData));

      if (typeBanking === "Cash") {
        // For cash payment, directly process the order
        sessionStorage.setItem("paymentPending", "true");
        sendOrderToBackend();
        toast.success("Cash payment selected. Processing your order...");
      } else {
        // For other payment methods, redirect to payment gateway
        const paymentResponse = await getPayment(totalItems);
        if (
          paymentResponse &&
          paymentResponse.data &&
          paymentResponse.data.url
        ) {
          sessionStorage.setItem("paymentPending", "true");
          window.location.href = paymentResponse.data.url;
        } else {
          throw new Error("Invalid payment response");
        }
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Calculate totals
  const subtotal = calculateTotal(cartData, selectedItems);
  const totalAmount = subtotal > 0 ? subtotal + SHIPPING_FEE : 0;
  const itemCount = selectedItems.length;

  const getPaymentIcon = (method) => {
    switch (method) {
      case "Cash":
        return <FaMoneyBill className="text-green-600" />;
      case "Momo":
        return <FaMobileAlt className="text-pink-600" />;
      case "VietComBank":
        return <FaUniversity className="text-blue-600" />;
      case "vnPay":
        return <FaCreditCard className="text-indigo-600" />;
      default:
        return <FaCreditCard className="text-gray-400" />;
    }
  };

  return (
    <>
      <NavBar />
      <Toaster position="top-center" reverseOrder={false} />

      <OrderPopup
        isOpen={openPopUp}
        onClose={() => setOpenPopup(false)}
        order={orderDataToPopup}
      />

      <div className="bg-gray-50 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaShoppingCart className="mr-2" /> Shopping Cart
          </h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : cartData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <FaShoppingCart size={64} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition duration-200 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Cart Items ({cartData.length})
                    </h2>
                    <span className="text-sm text-gray-500">
                      {itemCount} of {cartData.length} selected
                    </span>
                  </div>

                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-1 custom-scrollbar">
                    <div className="space-y-4">
                      {cartData.map((item) => (
                        <CartItem
                          key={item.productId}
                          item={item}
                          requestDataCart={requestDataCart}
                          isChecked={selectedItems.includes(item.productId)}
                          onCheckboxChange={handleCheckboxChange}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="w-full lg:w-1/3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-4">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Order Summary
                    </h2>

                    <div className="mb-6 space-y-3">
                      <SummaryRow label="Items Selected" value={itemCount} />
                      <SummaryRow
                        label="Subtotal"
                        value={`$${subtotal.toFixed(2)}`}
                      />
                      <SummaryRow
                        label="Shipping (Express)"
                        value={
                          subtotal > 0 ? `$${SHIPPING_FEE.toFixed(2)}` : "$0.00"
                        }
                      />

                      <div className="pt-3 mt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                          <span>Total</span>
                          <span>${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes Section */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 resize-none"
                        placeholder="Special instructions or delivery notes..."
                        rows="3"
                      />
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method <span className="text-red-500">*</span>
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "Cash", label: "Cash" },
                          { value: "Momo", label: "Momo" },
                          { value: "VietComBank", label: "VietComBank" },
                          { value: "vnPay", label: "VN Pay" },
                        ].map((method) => (
                          <div
                            key={method.value}
                            className={`border rounded-lg p-3 cursor-pointer transition-all flex items-center gap-2
                              ${
                                typeBanking === method.value
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            onClick={() => setTypeBanking(method.value)}
                          >
                            <div className="flex items-center justify-center w-8 h-8">
                              {getPaymentIcon(method.value)}
                            </div>
                            <span className="font-medium text-sm">
                              {method.label}
                            </span>
                            {typeBanking === method.value && (
                              <BsCheckCircleFill
                                className="ml-auto text-green-500"
                                size={16}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={initiatePayment}
                      disabled={
                        isProcessingPayment || selectedItems.length === 0
                      }
                      className={`w-full py-4 px-6 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                        ${
                          isProcessingPayment || selectedItems.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg"
                        }`}
                    >
                      {isProcessingPayment ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        `Proceed to Checkout • $${totalAmount.toFixed(2)}`
                      )}
                    </button>

                    {selectedItems.length === 0 && (
                      <p className="text-center text-sm text-red-500 mt-2">
                        Please select at least one item to checkout
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      By completing your purchase, you agree to our{" "}
                      <a href="#" className="text-green-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-green-600 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
