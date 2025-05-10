import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  AlertCircle, 
  UserPlus, 
  Package, 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Search,
  Filter,
  ChevronRight,
  IndianRupee
} from "lucide-react";

interface Farmer {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_verified: boolean;
  products?: {
    _id: string;
    name: string;
    currentPrice: number;
  }[];
  orders?: {
    _id: string;
    orderDate: string;
    totalAmount: number;
    status: string;
  }[];
}

export default function AdminFarmersView() {
  const { token } = useSelector(selectAuth);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "verified" | "unverified">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: { products: boolean; orders: boolean };
  }>({});

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3800/api/farmers/api/farmers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const farmersWithDetails = await Promise.all(
        response.data.map(async (farmer: Farmer) => {
          const [productsRes, ordersRes] = await Promise.all([
            axios.get(
              `http://localhost:3800/api/farmers/api/farmers/${farmer.email}/get/products`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(
              `http://localhost:3800/api/orders/api/orders/${farmer.email}/farmers`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
          ]);

          return {
            ...farmer,
            products: productsRes.data,
            orders: ordersRes.data,
          };
        })
      );

      setFarmers(farmersWithDetails);
      const initialExpandedState = farmersWithDetails.reduce(
        (acc, farmer) => ({
          ...acc,
          [farmer.email]: { products: false, orders: false },
        }),
        {}
      );
      setExpandedSections(initialExpandedState);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      setError("Failed to fetch farmers data");
      setLoading(false);
    }
  };

  const handleVerifyFarmer = async (email: string, verify: boolean) => {
    try {
      await axios.put(
        `http://localhost:3800/api/farmers/api/farmers/${email}/update/is_verified`,
        { is_verified: verify },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchFarmers();
    } catch (error) {
      console.error("Error updating farmer verification:", error);
    }
  };

  const handleDeleteFarmer = async (email: string) => {
    try {
      await axios.delete(`http://localhost:3800/api/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productsResponse = await axios.get(
        `http://localhost:3800/api/farmers/api/farmers/${email}/get/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const products = productsResponse.data;

      for (const product of products) {
        await axios.delete(`http://localhost:3800/api/products/${product.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await axios.delete(
        `http://localhost:3800/api/orders/api/orders/${email}/farmers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.delete(
        `http://localhost:3800/api/farmers/api/farmers/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchFarmers();
    } catch (error) {
      console.error("Error deleting farmer:", error);
    }
  };

  const toggleSection = (
    farmerEmail: string,
    section: "products" | "orders"
  ) => {
    setExpandedSections((prev) => ({
      ...prev,
      [farmerEmail]: {
        ...prev[farmerEmail],
        [section]: !prev[farmerEmail][section],
      },
    }));
  };

  const calculateTotalEarnings = (orders: any[]) => {
    const val = orders
      .filter((order) => order.status === "DELIVERED")
      .reduce((total, order) => total + order.totalAmount, 0);
    return val - (5 * val) / 100;
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch = 
      farmer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" ||
      (selectedStatus === "verified" && farmer.is_verified) ||
      (selectedStatus === "unverified" && !farmer.is_verified);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p className="font-semibold">Error</p>
          </div>
          <p className="mt-1">{error}</p>
          <button
            onClick={fetchFarmers}
            className="mt-3 inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Farmers Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor farmer accounts</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
            Filter
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${
              isFilterOpen ? "transform rotate-180" : ""
            }`} />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setSelectedStatus("all");
                  setIsFilterOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm ${
                  selectedStatus === "all"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                All Farmers
              </button>
              <button
                onClick={() => {
                  setSelectedStatus("verified");
                  setIsFilterOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm ${
                  selectedStatus === "verified"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => {
                  setSelectedStatus("unverified");
                  setIsFilterOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm ${
                  selectedStatus === "unverified"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Unverified
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer.email}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
                    {farmer.first_name.charAt(0)}
                    {farmer.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {farmer.first_name} {farmer.last_name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{farmer.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {farmer.is_verified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Unverified
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">{farmer.phone}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                    <IndianRupee className="w-4 h-4 mr-0.5" />
                    {calculateTotalEarnings(farmer.orders || []).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Products Section */}
              <div>
                <button
                  onClick={() => toggleSection(farmer.email, "products")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Products</span>
                  </div>
                  {expandedSections[farmer.email]?.products ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections[farmer.email]?.products && (
                  <div className="mt-2 space-y-2">
                    {farmer.products?.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <span className="text-gray-900 dark:text-white">{product.name}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          ₹{product.currentPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Orders Section */}
              <div>
                <button
                  onClick={() => toggleSection(farmer.email, "orders")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Recent Orders</span>
                  </div>
                  {expandedSections[farmer.email]?.orders ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections[farmer.email]?.orders && (
                  <div className="mt-2 space-y-2">
                    {farmer.orders?.slice(0, 3).map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {order.status}
                          </p>
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2">
                {!farmer.is_verified ? (
                  <>
                    <button
                      onClick={() => handleVerifyFarmer(farmer.email, true)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verify
                    </button>
                    <button
                      onClick={() => handleDeleteFarmer(farmer.email)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleDeleteFarmer(farmer.email)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Farmer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
