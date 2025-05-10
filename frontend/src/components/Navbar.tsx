import { Menu, X } from "lucide-react";
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
      <div className="w-full h-16 bg-white fixed top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center font-bold text-xl sm:text-2xl">
              <span className="text-green-500">Green</span>
              <span className="text-blue-800">Source</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink 
                to="/" 
                className="hover:text-blue-500 text-lg transition-colors duration-200"
              >
                Home
              </NavLink>
              {user.username ? (
              <NavLink
                  to={user.userType === "consumer" ? "/consumer/profile" : "/farmer/profile"}
                className="hover:text-blue-500 text-lg transition-colors duration-200"
              >
                  {user.username}
                </NavLink>
                ) : (
                <div className="flex items-center gap-4">
                  <NavLink
                    to="/login/consumer"
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 text-lg transition-colors duration-200"
                  >
                    Consumer Login
                  </NavLink>
                  <NavLink
                    to="/login/farmer"
                    className="px-4 py-2 text-green-600 hover:text-green-700 text-lg transition-colors duration-200"
                  >
                    Farmer Login
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                className="block px-3 py-2 text-base hover:text-blue-500 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              {user.username ? (
              <NavLink
                  to={user.userType === "consumer" ? "/consumer/profile" : "/farmer/profile"}
                className="block px-3 py-2 text-base hover:text-blue-500 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                  {user.username}
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/login/consumer"
                    className="block px-3 py-2 text-base text-blue-600 hover:text-blue-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Consumer Login
                  </NavLink>
                  <NavLink
                    to="/login/farmer"
                    className="block px-3 py-2 text-base text-green-600 hover:text-green-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Farmer Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
