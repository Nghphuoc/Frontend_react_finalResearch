import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaBars,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getUserInfo } from "./UserService";
import NavBar from "../Nav/Navbar";
import "../Cart/scroll.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import OrderDetails from "../Order/OrderDetail";
import { getOrderDetail } from "./UserService";
import { IoSettingsOutline } from "react-icons/io5";
const UserDetails = () => {
  const [user, setUser] = useState({});
  const [orderList, setOrderList] = useState([]);
  const userId = sessionStorage.getItem("userId");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [dataOrder, setDataOrder] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserInfo(userId);
      setUser(response.data);
      setOrderList(response.data.orders);
    };
    fetchUserData();
  }, []);


  const [isModalOpen, setIsModalOpen] = useState(false);


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
     const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    "All Order (50)",
    "Pending (10)",
    "Completed (8)",
    "Cancelled (22)",
  ];


  const handleOrderDetail = async (id) => {
    const data = await getOrderDetail(id);
     setDataOrder(data.data);
    setIsModalOpen(true);
  };

  return (
    <>
      <NavBar />

      <OrderDetails
        data={dataOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{ zIndex: 100 }} // Đảm bảo nó nổi lên trên
      />

      <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gray-100 p-4 lg:p-6 gap-4 lg:gap-6 mt-14">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 w-full bg-white shadow-lg rounded-2xl p-6 transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 lg:block lg:w-1/3 w-1/4 sm:w-1/3 h-full lg:min-h-screen`}
          style={{ zIndex: isModalOpen ? 1 : 50 }}
          // className={` bg-white shadow-lg rounded-2xl p-5 w-1/3`}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full z-10 lg:hidden"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>

          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <IoSettingsOutline className="text-xl" />
            Setting
          </button>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Infomation User
          </h2>
          <div className="space-y-4">
            {[
              { icon: FaUser, label: "Họ và tên", value: user.fullName },
              { icon: FaEnvelope, label: "Email", value: user.email },
              { icon: FaPhone, label: "Số điện thoại", value: user.phone },
              { icon: FaMapMarkerAlt, label: "Địa chỉ", value: user.address },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 border-b pb-3"
              >
                <item.icon className="text-xl text-blue-500" />
                <div>
                  <p className="text-gray-500">{item.label}</p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.value || "Chưa cập nhật"}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 flex-1 w-full">
          <button
            className="mb-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition lg:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarOpen
              ? "Đóng thông tin người dùng"
              : "Mở thông tin người dùng"}
          </button>
          <h1 className="text-2xl font-bold mb-4">Order History</h1>
          <div className="flex items-center justify-between border-b pb-2 mb-4 text-gray-500 overflow-x-auto">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b pb-2 mb-4 text-gray-500 overflow-x-auto">
              <div className="flex space-x-4">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`pb-2 text-lg font-medium transition duration-300 ${
                      activeTab === index
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "hover:text-indigo-400"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto h-96 scrollbar-hide">
            <table className="min-w-full bg-white border rounded-lg ">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 px-4 pl-10">Order</th>
                  <th className="py-2 px-4 pl-10">Order Time</th>
                  <th className="py-2 px-4 pl-10">Status</th>
                  <th className="py-2 px-4 pl-10">Total</th>
                  <th className="py-2 px-4 pl-10">Methond bank</th>

                  <th className="py-2 px-4 pl-10">Detail</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {orderList.map((order) => (
                  <tr key={order.orderId} className="border-b">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img
                        src="https://cdn-icons-png.freepik.com/256/2435/2435326.png?semt=ais_hybrid"
                        alt={order.orderName}
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <div className="text-gray-600">#096{order.orderId}</div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-gray-600">
                        {format(
                          new Date(order.order_date),
                          "dd/MM/yyyy HH:mm",
                          { locale: vi }
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`${order.statusColor} font-semibold`}>
                        {order.status}
                      </span>
                      {order.daysLeft && (
                        <span className="text-gray-400 ml-2">
                          - {order.daysLeft}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ${order.totalPrice}
                    </td>
                    <td className="py-3 px-4">{order.statusBanking}</td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                        onClick={() => handleOrderDetail(order.orderId)}
                      >
                        Order Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;




// import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";
// import { useEffect, useState } from "react";
// import { getUserInfo } from "./UserService";
// import NavBar from "../Nav/Navbar";

// const UserDetails = () => {
//   const [user, setUser] = useState({});
//   const userId = sessionStorage.getItem("userId");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const response = await getUserInfo(userId);
//       setUser(response.data);
//     };
//     fetchUserData();
//   }, []);

//   const [activeTab, setActiveTab] = useState(0);
//   const orders = [
//     {
//       id: 1,
//       name: "Adventure Story Book",
//       quantity: 1,
//       status: "Pending",
//       statusColor: "text-orange-500",
//       daysLeft: "5d left",
//       image: "https://placehold.co/50x50",
//       price: "$452.23",
//     },
//     {
//       id: 2,
//       name: "Travelling Backpack",
//       quantity: 2,
//       status: "Delivered",
//       statusColor: "text-green-500",
//       image: "https://placehold.co/50x50",
//       price: "$452.23",
//     },
//   ];

//   const tabs = [
//     "All Order (50)",
//     "Pending (10)",
//     "Completed (8)",
//     "Cancelled (22)",
//   ];

//   return (
//     <>
//       <NavBar />
//       <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gray-100 p-6 gap-6">
//         {/* User Info Section */}
//         <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-6 transition transform duration-300 hover:scale-105">
//           <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
//             Thông tin người dùng
//           </h2>
//           <div className="space-y-4">
//             {[
//               { icon: FaUser, label: "Họ và tên", value: user.fullName },
//               { icon: FaEnvelope, label: "Email", value: user.email },
//               { icon: FaPhone, label: "Số điện thoại", value: user.phone },
//               { icon: FaMapMarkerAlt, label: "Địa chỉ", value: user.address },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 className="flex items-center space-x-4 border-b pb-3"
//               >
//                 <item.icon className="text-xl text-blue-500" />
//                 <div>
//                   <p className="text-gray-500">{item.label}</p>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {item.value || "Chưa cập nhật"}
//                   </h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Order History Section */}
//         <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg">
//           <h1 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h1>

//           {/* Tabs */}
//           <div className="flex items-center justify-between border-b pb-2 mb-4 text-gray-500 overflow-x-auto">
//             <div className="flex space-x-4">
//               {tabs.map((tab, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveTab(index)}
//                   className={`pb-2 text-lg font-medium transition duration-300 ${
//                     activeTab === index
//                       ? "text-indigo-600 border-b-2 border-indigo-600"
//                       : "hover:text-indigo-400"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Orders Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border rounded-lg">
//               <thead>
//                 <tr className="border-b text-left">
//                   <th className="py-2 px-4">Mặt hàng</th>
//                   <th className="py-2 px-4">Trạng thái</th>
//                   <th className="py-2 px-4">Tổng tiền</th>
//                   <th className="py-2 px-4">Chi tiết</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order.id} className="border-b">
//                     <td className="py-3 px-4 flex items-center space-x-3">
//                       <img
//                         src={order.image}
//                         alt={order.name}
//                         className="w-12 h-12 rounded"
//                       />
//                       <div>
//                         <div className="font-bold">{order.name}</div>
//                         <div className="text-gray-600">
//                           Số lượng: {order.quantity}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className={`${order.statusColor} font-semibold`}>
//                         {order.status}
//                       </span>
//                       {order.daysLeft && (
//                         <span className="text-gray-400 ml-2">
//                           - {order.daysLeft}
//                         </span>
//                       )}
//                     </td>
//                     <td className="py-3 px-4 font-semibold">{order.price}</td>
//                     <td className="py-3 px-4">
//                       <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
//                         Chi tiết đơn hàng
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserDetails;