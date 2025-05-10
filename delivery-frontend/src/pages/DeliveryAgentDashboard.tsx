import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, logout } from "../store/slices/authSlice";
import {
  Truck,
  ClipboardCheck,
  User,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Package,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import { useState } from "react";

const DeliveryAgentDashboard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Overview",
      path: "/delivery",
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Pending Deliveries",
      path: "/delivery/pending",
    },
    {
      icon: <Truck className="w-5 h-5" />,
      label: "Active Deliveries",
      path: "/delivery/active",
    },
    {
      icon: <ClipboardCheck className="w-5 h-5" />,
      label: "Completed Deliveries",
      path: "/delivery/completed",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "My Profile",
      path: "/delivery/profile",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <span className="text-emerald-500">Green</span>
          <span className="text-teal-500">Source</span>
          <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">Delivery</span>
        </h1>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
        w-72 h-[100dvh]
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
        text-gray-800 dark:text-white
        border-r border-gray-200 dark:border-gray-700
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
              <span className="text-emerald-500">Green</span>
              <span className="text-teal-500">Source</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">Delivery</span>
            </h1>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map((item) => (
              <div key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 mb-2 rounded-lg transition-all duration-200 font-semibold ${
                    item.path === window.location.pathname
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                      : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              </div>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <Package className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+5%</span>
                </div>
                <p className="text-2xl font-bold mt-1">15</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <Truck className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+8%</span>
                </div>
                <p className="text-2xl font-bold mt-1">8</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-gray-900 dark:text-white font-semibold">
                  {user?.username || "Delivery Agent"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Agent</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignout}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 text-gray-900 dark:text-white rounded-lg transition-all border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 mt-16">{children}</main>
      </div>
    </div>
  );
};

export default DeliveryAgentDashboard;
