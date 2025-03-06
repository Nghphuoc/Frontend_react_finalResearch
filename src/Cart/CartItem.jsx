import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { deleteProductDetail, removeItemOnCart } from "./CartService";
import { CheckCheckIcon } from "lucide-react";
import { useState } from "react";
import { addProductToCart } from "../Product/service";

const CartItem = ({ item, requestDataCart, isChecked, onCheckboxChange }) => {

  const navigate = useNavigate();
  const cartId = sessionStorage.getItem("cartId");
  const [quantity, setQuantity] = useState(1);

  
  function handleClickMoreInfo(id) {
    navigate(`/detail/${id}`); // more information product
  }

  async function deleteProduct(productId) {
    const removeCartResponse = await deleteProductDetail(cartId, productId);
    if (removeCartResponse.data) {
      toast.success("Product removed from cart");
      requestDataCart(); // Gọi lại để cập nhật danh sách sản phẩm
      console.log(removeCartResponse);
    } else {
      toast.error("Error removing product from cart");
    }
    //getCartId(cartId);
    //navigate(`/cart/delete/${productId}`);
  }

  async function removeProduct(productId) {
    const removeCartResponse = await removeItemOnCart(cartId, productId);
    if (removeCartResponse.data) {
      requestDataCart(); // Gọi lại để cập nhật danh sách sản phẩm
      console.log(removeCartResponse);
    } else {
      toast.error("Error removing product from cart");
    }
    //getCartId(cartId);
    //navigate(`/cart/delete/${productId}`);
  }

  const handleClickAddToCart = async (productId) => {
    const cartResponse = await addProductToCart(cartId, productId);
    if (cartResponse) {
      requestDataCart(); // Gọi lại để cập nhật danh sách sản phẩm
    } 
  };

  return (
    <>
      <Toaster />
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex items-center ">
        <input
          type="checkbox"
          className=" mr-5 w-5 h-5 accent-green-600"
          checked={isChecked}
          onChange={() => onCheckboxChange(item.productId)}
        />
        <img
          src={item.imageUrl}
          alt={item.productName}
          className="w-24 h-24 rounded-lg mr-4 transform transition hover:scale-110"
          onClick={() => handleClickMoreInfo(item.productId)}
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{item.productName}</h3>
            <button
              onClick={() => deleteProduct(item.productId)}
              className="text-gray-500"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex items-center mb-2">
            <span className="mr-2">QTY:</span>
            <button
              className="text-xl p-2"
              onClick={() => removeProduct(item.productId)}
            >
              -
            </button>
            <input
              value={item.quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-14 h-8 border rounded-md p-2 text-center"
            />
            <button
              className="text-xl p-2"
              onClick={() => handleClickAddToCart(item.productId)}
            >
              +
            </button>
          </div>
          <div className="text-sm text-gray-500 mb-2">
            <p>
              Product ID:{" "}
              <span className="text-blue-500">{item.productId}</span>
            </p>
            {/* <p>
            Size: <span className="text-blue-500">{item.size}</span> Color:{" "}
            <span className="text-blue-500">{item.color}</span>
          </p> */}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-right">
              <p className="text-lg font-semibold">${item.price.toFixed(2)}</p>
              {/* <p className="text-sm text-gray-500 line-through">
              ${item.originalPrice}
            </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
