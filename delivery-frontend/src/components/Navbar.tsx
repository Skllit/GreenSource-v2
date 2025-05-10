import { Menu, X, User, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { useState } from "react";

export default function Navbar() {
  const { user } = useSelector(selectAuth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="w-full h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed top-0 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center font-bold text-xl sm:text-2xl">
              <span className="text-emerald-500">Green</span>
              <span className="text-teal-600">Source</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">Delivery</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {user.username && (
                <>
                  <NavLink 
                    to="/delivery" 
                    className={({ isActive }) => 
                      `text-lg transition-all duration-200 ${
                        isActive 
                          ? "text-emerald-500 font-semibold" 
                          : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                      }`
                    }
                  >
                    Overview
                  </NavLink>
                  <NavLink 
                    to="/delivery/pending" 
                    className={({ isActive }) => 
                      `text-lg transition-all duration-200 ${
                        isActive 
                          ? "text-emerald-500 font-semibold" 
                          : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                      }`
                    }
                  >
                    Pending
                  </NavLink>
                  <NavLink 
                    to="/delivery/active" 
                    className={({ isActive }) => 
                      `text-lg transition-all duration-200 ${
                        isActive 
                          ? "text-emerald-500 font-semibold" 
                          : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                      }`
                    }
                  >
                    Active
                  </NavLink>
                  <NavLink 
                    to="/delivery/completed" 
                    className={({ isActive }) => 
                      `text-lg transition-all duration-200 ${
                        isActive 
                          ? "text-emerald-500 font-semibold" 
                          : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                      }`
                    }
                  >
                    Completed
                  </NavLink>
                </>
              )}
              <NavLink
                to={user.username ? "/delivery/profile" : "/login"}
                className={({ isActive }) => 
                  `flex items-center gap-2 text-lg transition-all duration-200 ${
                    isActive 
                      ? "text-emerald-500 font-semibold" 
                      : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                  }`
                }
              >
                {user.username ? (
                  <>
                    <User className="w-5 h-5" />
                    <span>{user.username}</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    <span>Login</span>
                  </>
                )}
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user.username && (
                <>
                  <NavLink
                    to="/delivery"
                    className={({ isActive }) => 
                      `block px-3 py-2 text-base rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-900/20" 
                          : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Overview
                  </NavLink>
                  <NavLink
                    to="/delivery/pending"
                    className={({ isActive }) => 
                      `block px-3 py-2 text-base rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-900/20" 
                          : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pending Deliveries
                  </NavLink>
                  <NavLink
                    to="/delivery/active"
                    className={({ isActive }) => 
                      `block px-3 py-2 text-base rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-900/20" 
                          : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Active Deliveries
                  </NavLink>
                  <NavLink
                    to="/delivery/completed"
                    className={({ isActive }) => 
                      `block px-3 py-2 text-base rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-900/20" 
                          : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Completed Deliveries
                  </NavLink>
                </>
              )}
              <NavLink
                to={user.username ? "/delivery/profile" : "/login"}
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 text-base rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-900/20" 
                      : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {user.username ? (
                  <>
                    <User className="w-5 h-5" />
                    <span>{user.username}</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    <span>Login</span>
                  </>
                )}
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
