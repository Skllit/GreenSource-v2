import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import {
  ShoppingCart,
  User,
  Package,
  Heart,
  Clock,
  Activity,
  Users,
  Leaf,
  ArrowRight,
  Truck,
  MapPin,
  Search,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";

const HomePage = () => {
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [location, setLocation] = useState("New York, NY");

  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Fresh Produce",
      description: "Direct from local farmers to your table",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery service",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Local Farmers",
      description: "Support your local farming community",
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Market Prices",
      description: "Get the best prices for fresh produce",
    },
  ];

  const categories = [
    {
      name: "Vegetables",
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      name: "Fruits",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      name: "Dairy",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      name: "Grains",
      image: "https://images.unsplash.com/photo-1608198093002-ad4e505484ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Fresh from Farm to
                <span className="text-emerald-600 dark:text-emerald-400"> Your</span>
                <span className="text-teal-600 dark:text-teal-400"> Table</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Connect with local farmers and get fresh produce delivered right to your doorstep
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search for fresh produce..."
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isSearchFocused 
                        ? "border-emerald-500 dark:border-emerald-400" 
                        : "border-gray-200 dark:border-gray-700"
                    } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200`}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <Search className={`w-5 h-5 absolute right-3 top-3.5 transition-colors duration-200 ${
                    isSearchFocused 
                      ? "text-emerald-500 dark:text-emerald-400" 
                      : "text-gray-400 dark:text-gray-500"
                  }`} />
                </div>
                <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-gray-700 dark:text-gray-300">{location}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              <button
                  onClick={() => navigate("/consumer/products")}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                  <span>Browse Products</span>
                  <ArrowRight className="w-5 h-5" />
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Browse by Category
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
                <div
                key={index}
                className="group relative h-64 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/consumer/products?category=${category.name.toLowerCase()}`)}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center text-white/80">
                    <span>Browse Products</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join our community of conscious consumers and support local farmers while getting the freshest produce delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <button
                  onClick={() => navigate("/consumer/products")}
                  className="w-full sm:w-auto px-8 py-3 bg-white text-emerald-600 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  Browse Products
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full sm:w-auto px-8 py-3 bg-white text-emerald-600 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
