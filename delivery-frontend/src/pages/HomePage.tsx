import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  Truck, 
  MapPin, 
  Smartphone, 
  Package, 
  Route, 
  CheckCircle2, 
  User,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star
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
                <span className="block mt-4 text-white/90">Delivery Portal</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Manage your deliveries, track packages, and optimize routes with our
                comprehensive delivery management system.
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

        {/* Delivery Features Section */}
        <div className="py-24 -mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-6">
                  <Truck className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Delivery Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Efficiently manage your deliveries. Track packages, update delivery status,
                  and optimize your routes.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Real-time Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Get real-time updates on delivery locations, estimated arrival times,
                  and delivery confirmations.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Mobile Access</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Access your delivery dashboard on-the-go, update delivery status,
                  and communicate with customers easily.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Metrics Section */}
        <div className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
              Delivery Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Pending Deliveries</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">15</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Awaiting pickup</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    +8%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Active Deliveries</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">In transit</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    +12%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Completed Today</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Successfully delivered</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    +2%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Average Rating</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">4.8</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Based on customer feedback</p>
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
                    <Package className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">View Pending</span>
                </button>
                <button className="p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200 dark:border-gray-600">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-4">
                    <Route className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Active Routes</span>
                </button>
                <button className="p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200 dark:border-gray-600">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Mark Complete</span>
                </button>
                <button className="p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200 dark:border-gray-600">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">My Profile</span>
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
                <span className="text-white/60 text-sm ml-2">Delivery Portal</span>
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
