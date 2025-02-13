import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const UserDetails = () => {
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123 456 789",
    address: "123 Đường ABC, TP.HCM",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full transform transition duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Thông tin người dùng
        </h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4 border-b pb-4">
            <FaUser className="text-blue-500 text-xl" />
            <div>
              <p className="text-gray-500">Họ và tên</p>
              <h3 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-b pb-4">
            <FaEnvelope className="text-red-500 text-xl" />
            <div>
              <p className="text-gray-500">Email</p>
              <h3 className="text-lg font-semibold text-gray-800">
                {user.email}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-b pb-4">
            <FaPhone className="text-green-500 text-xl" />
            <div>
              <p className="text-gray-500">Số điện thoại</p>
              <h3 className="text-lg font-semibold text-gray-800">
                {user.phone}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-purple-500 text-xl" />
            <div>
              <p className="text-gray-500">Địa chỉ</p>
              <h3 className="text-lg font-semibold text-gray-800">
                {user.address}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
