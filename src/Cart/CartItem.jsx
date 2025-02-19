import { FaTimes } from "react-icons/fa";
import { useNavigate} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getCartId, removeItemOnCart } from "./CartService";

const CartItem = ({ item, updateQuantity }) => {
  const navigate = useNavigate();
  const cartId = localStorage.getItem("cartId");

  function handleClickMoreInfo(id) {
    navigate(`/detail/${id}`); // more information product
  }

 async function removeProduct (productId){
    const removeCartResponse = await removeItemOnCart(cartId,productId);
    if(removeCartResponse.data){
      toast.success('Product removed from cart')
      
    console.log(removeCartResponse);
    }else{
      toast.error('Error removing product from cart')
    }
    //getCartId(cartId);
    //navigate(`/cart/delete/${productId}`);
  }

  return (
    <>
      <Toaster />
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex items-center mb-4">
        <img
          src={item.imageUrl}
          alt={item.productName}
          className="w-24 h-24 rounded-lg mr-4"
          onClick={() => handleClickMoreInfo(item.productId)}
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{item.productName}</h3>
            <button
              onClick={() => removeProduct(item.productId)}
              className="text-gray-500"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex items-center mb-2">
            <span className="mr-2">QTY:</span>
            <select
              className="border border-gray-300 rounded p-1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, e.target.value)}
            >
              {[1, 2, 3, 4].map((qty) => (
                <option key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>
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
