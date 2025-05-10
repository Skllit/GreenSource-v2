import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logout } from "../store/slices/authSlice";
import {
  ShoppingCart,
  User,
  Package,
  Heart,
  Clock,
  Menu,
  Activity,
  X,
  Users,
  LogOut,
  Bell,
  Settings,
  Search,
  Sun,
  Moon,
  ChevronDown,
  MapPin,
  Truck,
  Leaf,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const ConsumerDashboard = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [location, setLocation] = useState("New York, NY");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSignout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    {
      icon: <Package className="w-5 h-5" />,
      label: "Products",
      path: "/consumer/products",
      description: "Browse fresh produce",
      badge: "New",
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Cart",
      path: "/consumer/cart",
      description: "View your cart",
      badge: "2",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Orders",
      path: "/consumer/orders",
      description: "Track your orders",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Saved",
      path: "/consumer/saved",
      description: "Your wishlist",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      path: "/consumer/profile",
      description: "Manage your account",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Market Prices",
      path: "/consumer/market-prices",
      description: "Current market rates",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Find Farmers",
      path: "/consumer/find-farmers",
      description: "Connect with farmers",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (user && user.userType === "farmer") {
    setTimeout(() => {
      navigate("/farmer/profile");
    }, 2000);
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">You are not authorized to access this page</h1>
        <h1 className="text-lg text-gray-600 dark:text-gray-300">Redirecting to farmer profile page...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md text-gray-800 dark:text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold">
          <span className="text-emerald-600 dark:text-emerald-400">Green</span>
          <span className="text-teal-600 dark:text-teal-400">Source</span>
        </h1>
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
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
          <div className="hidden md:block p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                <span className="text-emerald-600 dark:text-emerald-400">Green</span>
                <span className="text-teal-600 dark:text-teal-400">Source</span>
            </h1>
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fresh from farm to table</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-start space-x-4 w-full px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  item.path === window.location.pathname
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className={`${item.path === window.location.pathname ? "text-white" : "text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500"}`}>
                {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center">
                    <span className="font-medium block">{item.label}</span>
                    {item.badge && (
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        item.path === window.location.pathname
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${item.path === window.location.pathname ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                    {item.description}
                  </span>
                </div>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSignout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className={`w-64 px-4 py-2 rounded-lg border ${
                    isSearchFocused 
                      ? "border-emerald-500 dark:border-emerald-400" 
                      : "border-gray-200 dark:border-gray-700"
                  } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <Search className={`w-5 h-5 absolute right-3 top-2.5 transition-colors duration-200 ${
                  isSearchFocused 
                    ? "text-emerald-500 dark:text-emerald-400" 
                    : "text-gray-400 dark:text-gray-500"
                }`} />
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
              </span>
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-medium text-gray-800 dark:text-white">{user?.username || "User"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Consumer</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isProfileMenuOpen ? "transform rotate-180" : ""
                  }`} />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
              <button
                onClick={handleSignout}
                      className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
              </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
