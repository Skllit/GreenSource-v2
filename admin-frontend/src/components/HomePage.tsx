import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  Users, 
  BarChart3, 
  Settings, 
  Package, 
  ShoppingBag, 
  IndianRupee, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  Truck
} from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 mt-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 py-20 min-h-[30rem] flex items-center justify-center">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="inline-block">
                  <span className="text-emerald-200">Green</span>
                  <span className="text-teal-200">Source</span>
                </span>{" "}
                <span className="block mt-4 text-white/90">Admin Portal</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Manage your marketplace, monitor transactions, and ensure smooth operations
                with our comprehensive admin dashboard.
              </p>
              <button
                className="bg-white/10 backdrop-blur-sm text-white px-12 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl border border-white/20"
                onClick={handleGetStarted}
              >
                Access Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Admin Features Section */}
        <div className="py-24 -mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  User Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Efficiently manage farmers and consumers. Control access, verify accounts,
                  and maintain user database.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Analytics Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Track platform metrics, monitor transactions, and analyze market trends
                  in real-time.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-6">
                  <Settings className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">System Controls</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Manage platform settings, moderate listings, and ensure quality control
                  across the marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
              Platform Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    +12%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Active Users</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">From last month</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    +8%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Total Sales</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">₹45,678</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last 30 days</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    +5%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Active Listings</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">567</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Across all categories</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
                    -3%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Support Tickets</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">23</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending resolution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button className="p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200 dark:border-gray-600">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Review Verifications</span>
                </button>
                <button className="p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200 dark:border-gray-600">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Manage Products</span>
                </button>
                <button className="p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200 dark:border-gray-600">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Support Tickets</span>
                </button>
                <button className="p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200 dark:border-gray-600">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">View Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                <span className="text-emerald-200">Green</span>
                <span className="text-teal-200">Source</span>
                <span className="text-white/60 text-sm ml-2">Admin Portal</span>
              </h2>
              <p className="text-white/60 text-sm">
                © 2024 GreenSource Marketplace. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
