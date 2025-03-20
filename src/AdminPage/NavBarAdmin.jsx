import {
  FaBars,
  FaBell,
  FaAngleRight,
} from "react-icons/fa";
const NavBarAdmin = (toggleSidebar) => {
  return (
    <>
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => toggleSidebar()}
              className="lg:hidden mr-4 text-gray-600"
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Orders Management
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaBell className="text-gray-600 hover:text-purple-700 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                3
              </span>
            </div>

            <div className="flex items-center border-l pl-4">
              <img
                src="https://scontent.fhan3-4.fna.fbcdn.net/v/t39.30808-1/464854665_1255720698909260_4834054255726113702_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGa44z5iDkU_l7-yYJ_5zjKsK8T3WU-_6OwrxPdZT7_o0JJt26n30sLDcHuEd_3a3I2HAxmkcSUrNJDe4lsrTL9&_nc_ohc=Z4yfGv7-cUkQ7kNvgFd4_e1&_nc_oc=AdiYfWbR0V_6sIC4dxciXSbdcFvZ229dWeQkDq0u6zt5rf3BE4NyAq89aA61pUYP-vw&_nc_zt=24&_nc_ht=scontent.fhan3-4.fna&_nc_gid=gJtL7N665WG5kxBubBWRmg&oh=00_AYGJIRyaGz6tahQZLB9XSk86ASpwznuioTvs10ssA9HqbA&oe=67DD637C"
                alt="Admin"
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium">Jayki Nguyen </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <span className="hover:text-purple-700 cursor-pointer">
              Dashboard
            </span>
            <FaAngleRight className="mx-2 text-gray-400 text-xs" />
            <span className="hover:text-purple-700 cursor-pointer">Sales</span>
            <FaAngleRight className="mx-2 text-gray-400 text-xs" />
            <span className="text-purple-700 font-medium">Orders</span>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBarAdmin;
