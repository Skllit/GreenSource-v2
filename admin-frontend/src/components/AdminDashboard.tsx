import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, logout } from "../store/slices/authSlice";
import {
  Users,
  ShoppingBag,
  Activity,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  PackageCheck,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";

const AdminDashboard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);

  const handleSignout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Overview",
      path: "/admin/dashboard",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Users",
      path: "/admin/users",
      subItems: [
        {
          label: "Farmers",
          path: "/admin/users/farmers",
        },
        {
          label: "Consumers",
          path: "/admin/users/consumers",
        },
        {
          label: "Delivery Agents",
          path: "/admin/users/delivery-agents",
        },
        {
          label: "Admins",
          path: "/admin/users/admins",
        }
      ],
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Products",
      path: "/admin/products",
    },
    {
      icon: <PackageCheck className="w-5 h-5" />,
      label: "Orders",
      path: "/admin/orders",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Analytics",
      path: "/admin/analytics",
    },
    // {
    //   icon: <Settings className="w-5 h-5" />,
    //   label: "Settings",
    //   path: "/admin/settings",
    // },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUsers = () => {
    setIsUsersOpen(!isUsersOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md text-gray-800 dark:text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <span className="text-emerald-600 dark:text-emerald-400">Green</span>
          <span className="text-teal-600 dark:text-teal-400">Source</span>
        </h1>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed md:sticky md:top-0
        w-64 h-[100dvh]
        bg-white/80 dark:bg-gray-800/80
        backdrop-blur-sm
        text-gray-800 dark:text-white
        shadow-lg
        transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }
        z-50
      `}
      >
        <div className="flex flex-col h-full">
          <div className="hidden md:block p-5 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">Green</span>
              <span className="text-teal-600 dark:text-teal-400">Source</span>
            </h1>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map((item) => (
              <div key={item.path}>
                <button
                  onClick={() => {
                    if (item.subItems) {
                      toggleUsers();
                    } else {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 mb-2 rounded-xl transition-all duration-200 font-semibold ${
                    item.path === window.location.pathname ||
                    (item.subItems &&
                      item.subItems.some(
                        (sub) => sub.path === window.location.pathname
                      ))
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.subItems &&
                    (isUsersOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </button>

                {item.subItems && isUsersOpen && (
                  <div className="ml-8">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() => {
                          navigate(subItem.path);
                          setIsSidebarOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 mb-2 rounded-xl transition-all duration-200 font-semibold ${
                          subItem.path === window.location.pathname
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                            : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Welcome back,
                </h2>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {user?.username || "Admin"}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignout}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </header>

        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
