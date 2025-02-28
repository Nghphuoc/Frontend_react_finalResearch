import { Bell, MoreVertical, Settings } from "lucide-react";

const Sidebar = () => (
  <aside className="w-64 bg-blue-600 text-white flex flex-col">
    <div className="p-6 text-2xl font-bold">eProduct</div>
    <nav className="flex-1">
      {["Dashboard", "Order", "Statistic", "Product", "Stock", "Offer"].map(
        (item) => (
          <li key={item} className="p-4 hover:bg-blue-700 cursor-pointer">
            {item}
          </li>
        )
      )}
    </nav>
    <div className="p-6 flex justify-around">
      {["Facebook", "Twitter", "Google"].map((social) => (
        <a key={social} href="#" className="hover:text-gray-300">
          {social}
        </a>
      ))}
    </div>
  </aside>
);

const OrderTable = ({ orders }) => (
  <table className="w-full text-left">
    <thead>
      <tr className="text-gray-600">
        {["Id", "Name", "Address", "Date", "Price", "Status", "Action"].map(
          (header) => (
            <th key={header} className="py-2">
              {header}
            </th>
          )
        )}
      </tr>
    </thead>
    <tbody>
      {orders.map(({ id, name, address, date, price, status }) => (
        <tr key={id} className="bg-gray-100">
          <td className="py-2">#{id}</td>
          <td className="py-2">{name}</td>
          <td className="py-2">{address}</td>
          <td className="py-2">{date}</td>
          <td className="py-2">${price}</td>
          <td className={`py-2 ${status.color}`}>{status.label}</td>
          <td className="py-2">
            <MoreVertical />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Pagination = () => (
  <div className="flex space-x-2">
    {[1, 2, 3, 4, 5].map((num) => (
      <button key={num} className="px-3 py-1 bg-gray-200 rounded">
        {num}
      </button>
    ))}
  </div>
);

const CheckOrderPage = () => {
  const orders = [
    {
      id: "2632",
      name: "Brooklyn Zoo",
      address: "VT, 05701",
      date: "31 Jul 2020",
      price: 64,
      status: { label: "Pending", color: "text-red-500" },
    },
    {
      id: "2633",
      name: "John McCormick",
      address: "IA, 52132",
      date: "01 Aug 2020",
      price: 35,
      status: { label: "Dispatch", color: "text-green-500" },
    },
    {
      id: "2634",
      name: "Sandra Pugh",
      address: "GA, 98108",
      date: "02 Aug 2020",
      price: 74,
      status: { label: "Completed", color: "text-gray-500" },
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order</h1>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600" />
            <img
              src="https://placehold.co/40x40"
              alt="User avatar"
              className="rounded-full w-10 h-10"
            />
          </div>
        </header>
        <div className="bg-white p-6 rounded-lg shadow">
          <OrderTable orders={orders} />
          <div className="flex justify-between items-center mt-4">
            <div className="text-gray-600">Showing 1-3 of 28</div>
            <Pagination />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckOrderPage;
