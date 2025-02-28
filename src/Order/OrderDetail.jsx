import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderDetails = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;
if (!data || !data.productQuantities) {
  return <p className="text-gray-500">No order data available.</p>;
}
  const navigate = useNavigate();
  const order = {
    id: "1222528743",
    date: "2025-02-22T12:00:00.000+00:00",
    product: {
      name: "Headphones Bose 35 II",
      quantity: 1,
      price: 299,
      paymentMethod: "COD",
      image: "https://placehold.co/150x150",
    },
    tracking: {
      placed: true,
      shipped: true,
      delivered: false,
    },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };


  function productDetail (id){
    navigate(`/detail/${id}`);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-lg mx-4 p-6 bg-white rounded-2xl shadow-xl border border-gray-300">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Order Information */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
          <p className="text-gray-600">
            Order ID: <span className="font-medium">#096{data.orderId}</span>
          </p>
          <p className="text-gray-600">
            Placed On:{" "}
            <span className="font-medium">{formatDate(data.order_date)}</span>
          </p>
          <p className="text-gray-600">
            Ship To Address:{" "}
            <span className="font-medium">{data.user.address}</span>
          </p>
          <p className="text-gray-600">
            Phone:{" "}
            <span className="font-medium">{data.user.phone}</span>
          </p>
        </div>

        {/* Product Details */}
        {data?.productQuantities && data.productQuantities.length > 0 ? (
          data.productQuantities.map((item, index) => (
            <div
              key={item.productId}
              className="flex items-center bg-gray-100 p-4 rounded-xl mb-6"
            >
              <img
                src={item.imageUrl}
                alt="Product"
                className="w-24 h-24 rounded-lg mr-4 cursor-pointer"
                onClick={() => productDetail(item.productId)}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.productName}
                </h3>
                <p className="text-gray-600">Qty: {item.quantity}</p>
                <p className="text-xl font-bold text-blue-600">${item.price}</p>
                <p className="text-gray-600">Payment: {data.statusBanking}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}

        {/* Tracking Progress */}
        <div className="flex justify-between items-center mb-6">
          {[
            { icon: FaBox, label: "PLACED", status: order.tracking.placed },
            { icon: FaTruck, label: "SHIPPED", status: order.tracking.shipped },
            {
              icon: FaCheckCircle,
              label: "DELIVERED",
              status: order.tracking.delivered,
            },
          ].map(({ icon: Icon, label, status }, index) => (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg ${
                  status ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <Icon />
              </div>
              <p
                className={`mt-2 text-sm ${
                  status ? "text-blue-600 font-semibold" : "text-gray-500"
                }`}
              >
                {label}
              </p>
              {index < 2 && <div className="h-1 w-full bg-gray-300 mt-2"></div>}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Track
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Cancel
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Pre-pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
