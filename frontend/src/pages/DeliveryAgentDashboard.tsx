import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DeliveryVehicle } from '../types';

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPincode: string;
  items: {
    name: string;
    quantity: number;
    weight: number;
  }[];
  totalWeight: number;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  assignedVehicle: DeliveryVehicle;
  estimatedDeliveryTime: string;
  createdAt: string;
}

const DeliveryAgentDashboard = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3809/api/delivery-agents/deliveries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeliveries(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:3809/api/delivery-agents/availability',
        { isAvailable: !isAvailable },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsAvailable(!isAvailable);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: Delivery['status']) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3809/api/delivery-agents/deliveries/${deliveryId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Delivery Agent Dashboard
            </h1>
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-lg font-medium ${
                isAvailable
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isAvailable ? 'Available' : 'Unavailable'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{delivery.orderId}</h3>
                      <p className="text-sm text-gray-500">{delivery.customerName}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        delivery.status
                      )}`}
                    >
                      {delivery.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Address:</span> {delivery.customerAddress}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Pincode:</span> {delivery.customerPincode}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Total Weight:</span> {delivery.totalWeight} kg
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Vehicle:</span>{' '}
                      {delivery.assignedVehicle.type.toUpperCase()}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedDelivery(delivery)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      {delivery.status === 'pending' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.id, 'accepted')}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                        >
                          Accept
                        </button>
                      )}
                      {delivery.status === 'accepted' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
                          className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-600"
                        >
                          Mark as Picked Up
                        </button>
                      )}
                      {delivery.status === 'picked_up' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Delivery Details - Order #{selectedDelivery.orderId}
                </h2>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                  <p className="text-gray-600">{selectedDelivery.customerName}</p>
                  <p className="text-gray-600">{selectedDelivery.customerAddress}</p>
                  <p className="text-gray-600">Pincode: {selectedDelivery.customerPincode}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedDelivery.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-gray-600">
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span>{item.weight} kg</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 font-medium">
                      <div className="flex justify-between">
                        <span>Total Weight:</span>
                        <span>{selectedDelivery.totalWeight} kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-gray-900">
                        {selectedDelivery.status.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="text-gray-900">{selectedDelivery.assignedVehicle.type.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="text-gray-900">
                        {new Date(selectedDelivery.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="text-gray-900">
                        {new Date(selectedDelivery.estimatedDeliveryTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DeliveryAgentDashboard; 