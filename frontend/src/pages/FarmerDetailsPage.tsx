import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Phone, Mail, Clock, Package } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';

interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  specialties: Array<{
    category: string;
    subCategory: string;
    description: string;
  }>;
  dailyProductionCapacity: Record<string, { quantity: number; unit: string }>;
  deliveryRadius: number;
  rating: number;
  address: {
    city: string;
    state: string;
    postal_code: string;
    lat: number;
    lng: number;
  };
  phone: string;
  email: string;
  is_verified: boolean;
  operatingHours: {
    start: string;
    end: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  quantity: number;
  unit: string;
  image: string;
}

const FarmerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useSelector(selectAuth);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3800/api/farmers/api/farmers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFarmer(response.data);

        // Fetch farmer's products
        const productsResponse = await axios.get(`http://localhost:3800/api/farmers/api/farmers/${id}/products`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(productsResponse.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching farmer details:', err);
        setError('Failed to fetch farmer details. Please try again later.');
        setLoading(false);
      }
    };

    if (token && id) {
      fetchFarmerDetails();
    }
  }, [token, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error || 'Farmer not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Farmer Header */}
        <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">
                {farmer.firstName} {farmer.lastName}
                {farmer.is_verified && (
                  <span className="ml-2 text-sm bg-white text-green-600 px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </h1>
              <div className="flex items-center mt-2">
                <Star className="text-yellow-300" size={20} />
                <span className="ml-1 font-semibold">{farmer.rating.toFixed(1)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/farmer/${farmer.id}/edit`)}
              className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Farmer Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-green-600" size={20} />
              <span>
                {farmer.address?.city || 'City not specified'}, {farmer.address?.state || 'State not specified'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-green-600" size={20} />
              <span>{farmer.phone || 'Phone not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-green-600" size={20} />
              <span>{farmer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-green-600" size={20} />
              <span>
                Operating Hours: {farmer.operatingHours.start} - {farmer.operatingHours.end}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {farmer.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {specialty.category} - {specialty.subCategory}
                </span>
              ))}
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-4">Production Capacity</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(farmer.dailyProductionCapacity).map(([category, capacity]) => (
                <div key={category} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-700">{category}</div>
                  <div className="text-sm text-gray-600">
                    {capacity.quantity} {capacity.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-green-600 font-semibold">${product.price.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetailsPage; 