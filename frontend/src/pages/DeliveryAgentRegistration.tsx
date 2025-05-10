import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DeliveryVehicle } from '../types';

const DeliveryAgentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicles: [] as DeliveryVehicle[],
    availablePincodes: [] as string[],
    currentPincode: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [selectedVehicle, setSelectedVehicle] = useState<DeliveryVehicle>({
    type: 'bike',
    capacity: 0,
    range: 0,
    costPerKm: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors when user types
    if (Object.keys(validationErrors).includes(name)) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleVehicleAdd = () => {
    if (selectedVehicle.capacity > 0 && selectedVehicle.range > 0 && selectedVehicle.costPerKm > 0) {
      setFormData(prev => ({
        ...prev,
        vehicles: [...prev.vehicles, selectedVehicle],
      }));
      setSelectedVehicle({
        type: 'bike',
        capacity: 0,
        range: 0,
        costPerKm: 0,
      });
    }
  };

  const handlePincodeAdd = () => {
    if (formData.currentPincode && formData.currentPincode.length === 6) {
      setFormData(prev => ({
        ...prev,
        availablePincodes: [...prev.availablePincodes, formData.currentPincode],
        currentPincode: '',
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      errors.password = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3800/api/auth/register', {
        email: formData.email,
        password: formData.password,
        role: 'delivery_agent',
      });

      if (response.data) {
        const agentResponse = await axios.post('http://localhost:3809/api/delivery-agents', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          vehicles: formData.vehicles,
          availablePincodes: formData.availablePincodes,
          isAvailable: true,
          rating: 0,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        if (agentResponse.data) {
          navigate('/login/delivery');
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white shadow-lg rounded-2xl p-6 transform hover:scale-[1.01] transition-all duration-300 animate-fadeIn border border-blue-100">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Delivery Agent Registration
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.email ? 'border-red-500' : ''
                  }`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.phone ? 'border-red-500' : ''
                  }`}
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.password ? 'border-red-500' : ''
                  }`}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Vehicles */}
            <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50/50 to-green-50/50">
              <h3 className="text-lg font-medium text-blue-700">Delivery Vehicles</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                  <select
                    value={selectedVehicle.type}
                    onChange={(e) => setSelectedVehicle(prev => ({ ...prev, type: e.target.value as DeliveryVehicle['type'] }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="bike">Bike</option>
                    <option value="auto">Auto</option>
                    <option value="truck">Truck</option>
                    <option value="lorry">Lorry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity (kg)</label>
                  <input
                    type="number"
                    value={selectedVehicle.capacity}
                    onChange={(e) => setSelectedVehicle(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Range (km)</label>
                  <input
                    type="number"
                    value={selectedVehicle.range}
                    onChange={(e) => setSelectedVehicle(prev => ({ ...prev, range: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost per km (₹)</label>
                  <input
                    type="number"
                    value={selectedVehicle.costPerKm}
                    onChange={(e) => setSelectedVehicle(prev => ({ ...prev, costPerKm: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleVehicleAdd}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Vehicle
              </button>

              {/* List of added vehicles */}
              <div className="mt-4 space-y-2">
                {formData.vehicles.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
                    <div>
                      <span className="font-medium capitalize">{vehicle.type}</span>
                      <span className="text-gray-500"> - {vehicle.capacity}kg, {vehicle.range}km</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          vehicles: prev.vehicles.filter((_, i) => i !== index),
                        }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Pincodes */}
            <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50/50 to-green-50/50">
              <h3 className="text-lg font-medium text-blue-700">Available Pincodes</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.currentPincode}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPincode: e.target.value }))}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={handlePincodeAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>

              {/* List of added pincodes */}
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.availablePincodes.map((pincode, index) => (
                  <div key={index} className="flex items-center gap-1 px-3 py-1 bg-white rounded-full shadow-sm">
                    <span>{pincode}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          availablePincodes: prev.availablePincodes.filter((_, i) => i !== index),
                        }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
            >
              Register as Delivery Agent
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryAgentRegistration; 