import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import React Router hooks
import {
  FaChartLine,
  FaShoppingCart,
  FaBoxOpen,
  FaUsers,
  FaTachometerAlt,
  FaBullhorn,
  FaCogs,
  FaBars,
  FaAngleDown,
  FaAngleRight,
  FaTimes,
} from "react-icons/fa";

// Define menu data structure - easy to modify
const menuItems = [
  {
    icon: FaChartLine,
    label: "DASHBOARD",
    path: "/dashboard",
  },
  {
    icon: FaShoppingCart,
    label: "SALES",
    path: "/admin/orderPage", // Parent path
    subMenu: [
      { label: "Orders", path: "/admin/orderPage" },
      { label: "Add Product", path: "/admin/add-product" },
      { label: "Invoices", path: "/admin/invoices" },
      { label: "Refunds", path: "/admin/refunds" },
    ],
  },
  {
    icon: FaBoxOpen,
    label: "PRODUCTS",
    path: "/admin/uploadimg",
  },
  {
    icon: FaUsers,
    label: "Lits Product",
    path: "/admin/managementProduct",
  },
  {
    icon: FaTachometerAlt,
    label: "VELOCITY",
    path: "/velocity",
  },
  {
    icon: FaBullhorn,
    label: "MARKETING",
    path: "/marketing",
  },
  {
    icon: FaCogs,
    label: "CMS",
    path: "/cms",
  },
  {
    icon: FaCogs,
    label: "SETTINGS",
    path: "/settings",
  },
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Find active menu based on current path
  const getCurrentMenuFromPath = (path) => {
    // First check for exact matches in main menu
    const mainMatch = menuItems.find((item) => item.path === path);
    if (mainMatch) return mainMatch.label;

    // Then check for parent paths
    const parentMatch = menuItems.find(
      (item) => path.startsWith(item.path) && item.path !== "/"
    );
    if (parentMatch) return parentMatch.label;

    // Then check for submenu matches
    for (const item of menuItems) {
      if (item.subMenu) {
        const subMatch = item.subMenu.find((sub) => sub.path === path);
        if (subMatch) return item.label;
      }
    }

    return null;
  };

  const [activeMenu, setActiveMenu] = useState(() =>
    getCurrentMenuFromPath(location.pathname)
  );

  // Set the initial expanded submenu based on current path
  useEffect(() => {
    const currentMenu = getCurrentMenuFromPath(location.pathname);
    if (currentMenu) {
      setActiveMenu(currentMenu);
      setExpandedSubmenu(currentMenu);
    }
  }, [location.pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (item) => {
    const menuLabel = item.label;

    // Toggle submenu expansion
    if (item.subMenu) {
      if (expandedSubmenu === menuLabel) {
        setExpandedSubmenu(null);
      } else {
        setExpandedSubmenu(menuLabel);
      }
    }

    // Set active menu
    setActiveMenu(menuLabel);

    // Navigate to path if there's no submenu or if we're on mobile
    if (!item.subMenu || isMobile) {
      navigate(item.path);
      if (isMobile) {
        setSidebarCollapsed(true);
      }
    } else if (item.path) {
      // If the menu has both a submenu and a path, navigate to its path
      navigate(item.path);
    }
  };

  const handleSubMenuClick = (subItem, parentLabel) => {
    navigate(subItem.path);
    setActiveMenu(parentLabel);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleMobileClose = () => {
    if (isMobile) setSidebarCollapsed(true);
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={handleMobileClose}
        />
      )}

      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-72"
        } bg-white h-screen shadow-lg transition-all duration-300 ease-in-out z-20 fixed lg:relative
        ${
          isMobile && sidebarCollapsed
            ? "-translate-x-full lg:translate-x-0"
            : "translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div
              className={`${
                sidebarCollapsed ? "mx-auto" : "mr-3"
              } bg-purple-600 text-white rounded-md w-9 h-9 flex items-center justify-center cursor-pointer`}
              onClick={() => navigate("/")}
            >
              <span className="font-bold text-lg">B</span>
            </div>
            {!sidebarCollapsed && (
              <span
                className="text-purple-700 text-xl font-bold tracking-tight cursor-pointer"
                onClick={() => navigate("/")}
              >
                bagisto
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-purple-700 transition-colors duration-200"
          >
            {isMobile && !sidebarCollapsed ? (
              <FaTimes className="text-lg" />
            ) : (
              <FaBars className="text-lg" />
            )}
          </button>
        </div>

        {/* Mobile menu toggler - outside sidebar */}
        {isMobile && sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 bg-white p-2 rounded-md shadow-md z-20"
          >
            <FaBars className="text-purple-600" />
          </button>
        )}

        {/* Sidebar Content */}
        <div className="overflow-y-auto h-[calc(100vh-65px)] pb-20">
          <nav className="mt-3">
            <ul className="space-y-1 px-3">
              {menuItems.map((item, index) => {
                // Check if this item or any of its subitems match the current path
                const isActive =
                  activeMenu === item.label ||
                  (item.subMenu &&
                    item.subMenu.some((sub) => location.pathname === sub.path));

                return (
                  <li key={index}>
                    <div
                      className={`flex items-center justify-between py-3 px-4 rounded-md cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "bg-purple-50 text-purple-700 font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleMenuClick(item)}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={`${
                            sidebarCollapsed
                              ? "mx-auto text-xl"
                              : "mr-3 text-lg"
                          } ${isActive ? "text-purple-700" : "text-gray-500"}`}
                        />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium tracking-wide">
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!sidebarCollapsed && item.subMenu && (
                        <div className="transform transition-transform duration-200">
                          {expandedSubmenu === item.label ? (
                            <FaAngleDown
                              className={`text-gray-500 ${
                                expandedSubmenu === item.label
                                  ? "rotate-0"
                                  : "-rotate-90"
                              }`}
                            />
                          ) : (
                            <FaAngleRight className="text-gray-500" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submenu */}
                    {!sidebarCollapsed &&
                      item.subMenu &&
                      expandedSubmenu === item.label && (
                        <div className="ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-200 max-h-96">
                          {item.subMenu.map((subItem, subIndex) => {
                            const isSubActive =
                              location.pathname === subItem.path;

                            return (
                              <div
                                key={subIndex}
                                className={`p-2.5 text-sm rounded-md cursor-pointer transition-colors duration-200 ${
                                  isSubActive
                                    ? "text-purple-700 bg-purple-50 font-medium"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                                onClick={() =>
                                  handleSubMenuClick(subItem, item.label)
                                }
                              >
                                {subItem.label}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* User profile section */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 p-4 px-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                J
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  Jayki Nguyen
                </p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default SideBar;
