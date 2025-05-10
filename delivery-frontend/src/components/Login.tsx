import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginFailure } from "../store/slices/authSlice";
import axios from "axios";
import type { RootState } from "../store";
import Navbar from "./Navbar";
import { LogIn, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    identifier: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear validation errors when user starts typing
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const emailError = validateEmail(formData.identifier);

    setValidationErrors({
      identifier: emailError,
      password: "",
    });

    if (emailError) {
      return;
    }

    dispatch(loginStart());

    const loginData = {
      email: formData.identifier,
      password: formData.password,
      role: "delivery_agent"
    };

    try {
      const response = await axios.post(
        "http://localhost:3800/api/auth/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const validateResponse = await axios.get(
        "http://localhost:3800/api/auth/validate",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response.data.token}`,
          },
        }
      );

      console.log(response.data, validateResponse.data);
      
      if (response.data && response.data.token) {
        dispatch({
          type: "auth/loginSuccess",
          payload: response.data,
        });
        navigate("/delivery");
      }
    } catch (error) {
      dispatch(
        loginFailure(error instanceof Error ? error.message : "Login failed")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mt-10"></div>
        <div className="container mx-auto px-4 max-w-md pt-20">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl p-8 transform hover:scale-[1.01] transition-all duration-300 animate-fadeIn border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 bg-clip-text text-transparent">
                Delivery Agent Login
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Access your delivery dashboard
              </p>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 shadow-lg animate-shake">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="transform transition-all duration-200 hover:translate-x-1">
                  <input
                    type="email"
                    id="identifier"
                    name="identifier"
                    required
                    autoFocus
                    value={formData.identifier}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border ${
                      validationErrors.identifier ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Email"
                  />
                  {validationErrors.identifier && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{validationErrors.identifier}</p>
                  )}
                </div>
                <div className="transform transition-all duration-200 hover:translate-x-1">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white py-3 px-6 rounded-lg font-medium text-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform transition-all duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20"
                }`}
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Signing in...
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">
                <span className="text-emerald-200">Green</span>
                <span className="text-teal-200">Source</span>
                <span className="text-white/60 text-sm ml-2">Delivery</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-sm">
                Delivery agent portal for GreenSource marketplace deliveries.
              </p>
            </div>
            
            <div className="border-t border-white/10 mt-4 pt-4 text-center">
              <p className="text-white/60 text-sm">
                © 2024 GreenSource Marketplace. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
