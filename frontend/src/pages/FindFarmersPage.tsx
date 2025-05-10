import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Filter, Search, Star, Truck, Package } from 'lucide-react';
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
  distance?: number;
}

interface FilterState {
  category: string;
  minQuantity: number;
  maxDistance: number;
  minRating: number;
  sortBy: 'distance' | 'rating' | 'quantity';
}

const FindFarmersPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector(selectAuth);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; postal_code?: string } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minQuantity: 0,
    maxDistance: 50,
    minRating: 0,
    sortBy: 'distance'
  });

  // Fetch farmers data
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        console.log('Fetching farmers data...');
        if (!token) {
          setError('Please log in to view farmers');
          return;
        }

        const response = await axios.get('http://localhost:3805/api/farmers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Raw farmers data:', response.data);
        
        // Fetch addresses for each farmer
        const farmersWithAddresses = await Promise.all(response.data.map(async (farmer: any) => {
          let addressData = null;
          if (farmer.addresses && farmer.addresses.length > 0) {
            try {
              const addressResponse = await axios.get(`http://localhost:3805/api/address/${farmer.addresses[0]}`);
              addressData = addressResponse.data;
            } catch (error) {
              console.error('Error fetching address:', error);
            }
          }

          return {
            id: farmer._id || farmer.id,
            firstName: farmer.first_name || '',
            lastName: farmer.last_name || '',
            specialties: farmer.specialties || [],
            dailyProductionCapacity: farmer.dailyProductionCapacity || {},
            deliveryRadius: farmer.deliveryRadius || 10,
            rating: farmer.rating || 0,
            address: addressData || {
              city: '',
              state: '',
              postal_code: '',
              lat: 0,
              lng: 0
            },
            phone: farmer.phone || '',
            email: farmer.email || '',
            is_verified: farmer.is_verified || false,
            operatingHours: farmer.operatingHours || {
              start: '08:00',
              end: '18:00'
            }
          };
        }));

        // Calculate distances based on postal codes if available
        if (userLocation) {
          farmersWithAddresses.forEach((farmer: Farmer) => {
            if (farmer.address?.postal_code && userLocation.postal_code) {
              farmer.distance = calculateDistanceByPostalCode(
                userLocation.postal_code,
                farmer.address.postal_code
              );
            } else if (farmer.address?.lat && farmer.address?.lng) {
              farmer.distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                farmer.address.lat,
                farmer.address.lng
              );
            }
          });
        }

        console.log('Processed farmers data:', farmersWithAddresses);
        setFarmers(farmersWithAddresses);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching farmers:', err);
        if (err.response) {
          console.error('Error response:', err.response.data);
          setError(err.response.data.message || 'Failed to fetch farmers data. Please try again later.');
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('No response from server. Please check your connection.');
        } else {
          console.error('Error setting up request:', err.message);
          setError('Failed to fetch farmers data. Please try again later.');
        }
        setLoading(false);
      }
    };

    if (token) {
      fetchFarmers();
    } else {
      setError('Please log in to view farmers');
      setLoading(false);
    }
  }, [userLocation, token]);

  // Get user's location with better error handling
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Don't show error to user, just continue without location
          setUserLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setUserLocation(null);
    }
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Update the distance calculation function
  const calculateDistanceByPostalCode = (postalCode1: string, postalCode2: string) => {
    // For now, return a more reasonable random distance
    return Math.floor(Math.random() * 20) + 1; // Random distance between 1-20km
  };

  // Filter and sort farmers
  const filteredFarmers = farmers
    .filter(farmer => {
      if (filters.category && !farmer.specialties?.some(s => s.category === filters.category)) {
        return false;
      }
      if (filters.minQuantity > 0) {
        const hasEnoughQuantity = Object.values(farmer.dailyProductionCapacity || {}).some(
          capacity => capacity.quantity >= filters.minQuantity
        );
        if (!hasEnoughQuantity) return false;
      }
      if (filters.maxDistance < 50 && farmer.distance && farmer.distance > filters.maxDistance) {
        return false;
      }
      if (filters.minRating > 0 && (farmer.rating || 0) < filters.minRating) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return ((a.distance || 0) - (b.distance || 0));
        case 'rating':
          return ((b.rating || 0) - (a.rating || 0));
        case 'quantity':
          const aMaxQuantity = Math.max(...Object.values(a.dailyProductionCapacity || {}).map(c => c.quantity || 0));
          const bMaxQuantity = Math.max(...Object.values(b.dailyProductionCapacity || {}).map(c => c.quantity || 0));
          return bMaxQuantity - aMaxQuantity;
        default:
          return 0;
      }
    });

  console.log('Current farmers state:', farmers);
  console.log('Filtered farmers:', filteredFarmers);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Find Local Farmers</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Filter size={20} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="dairy">Dairy</option>
                <option value="poultry">Poultry</option>
                <option value="meat">Meat</option>
                <option value="seafood">Seafood</option>
                <option value="grains">Grains</option>
                <option value="spices">Spices</option>
                <option value="oils">Oils</option>
                <option value="pickles">Pickles</option>
                <option value="honey">Honey</option>
                <option value="organic">Organic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Quantity (kg)
              </label>
              <input
                type="number"
                value={filters.minQuantity}
                onChange={(e) => handleFilterChange('minQuantity', Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Distance (km)
              </label>
              <input
                type="number"
                value={filters.maxDistance}
                onChange={(e) => handleFilterChange('maxDistance', Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                min="1"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <input
                type="number"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleFilterChange('sortBy', 'distance')}
                className={`px-4 py-2 rounded-lg ${
                  filters.sortBy === 'distance'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Distance
              </button>
              <button
                onClick={() => handleFilterChange('sortBy', 'rating')}
                className={`px-4 py-2 rounded-lg ${
                  filters.sortBy === 'rating'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rating
              </button>
              <button
                onClick={() => handleFilterChange('sortBy', 'quantity')}
                className={`px-4 py-2 rounded-lg ${
                  filters.sortBy === 'quantity'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Production Capacity
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {farmer.firstName} {farmer.lastName}
                  </h2>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={20} />
                    <span className="font-semibold">{(farmer.rating || 0).toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>
                      {farmer.address?.city ? `${farmer.address.city}, ${farmer.address.state}` : 'Location not specified'}
                      {farmer.distance !== undefined && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({farmer.distance.toFixed(1)} km away)
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Truck size={18} />
                    <span>Delivery radius: {farmer.deliveryRadius || 0} km</span>
                  </div>

                  {farmer.specialties && farmer.specialties.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package size={18} />
                      <div className="flex flex-wrap gap-2">
                        {farmer.specialties.map((specialty: any, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {specialty.category || 'Uncategorized'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.keys(farmer.dailyProductionCapacity || {}).length > 0 && (
                    <div className="pt-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Production Capacity:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(farmer.dailyProductionCapacity || {}).map(([category, capacity]: [string, any]) => (
                          <div key={category} className="text-sm text-gray-600">
                            {category}: {capacity.quantity || 0} {capacity.unit || 'units'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/farmer/${farmer.id}/products`)}
                  className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredFarmers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No farmers found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
};

export default FindFarmersPage; 