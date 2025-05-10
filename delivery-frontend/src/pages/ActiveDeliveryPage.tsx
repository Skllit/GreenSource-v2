import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { IDelivery } from "../types/Delivery";
import { 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  Package, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  XCircle
} from "lucide-react";

interface Delivery extends IDelivery {
  _id: string;
}

export default function ActiveDeliveryPage() {
  const { user, token } = useSelector(selectAuth);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const agent = await axios.get(
          `http://localhost:3800/api/delivery/agent/email/${user?.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(agent);
        const response = await axios.get(
          `http://localhost:3800/api/delivery/agents/${agent?.data?._id}/activeDeliveries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setDeliveries(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch deliveries");
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const handleCancel = async (deliveryId: string) => {
    try {
      await axios.patch(
        `http://localhost:3800/api/delivery/${deliveryId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh deliveries after cancellation
      const updatedDeliveries = deliveries.map((delivery) =>
        delivery._id === deliveryId
          ? { ...delivery, status: "CANCELLED" }
          : delivery
      ) as Delivery[];
      setDeliveries(updatedDeliveries);
    } catch (err) {
      setError("Failed to cancel delivery");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Deliveries</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your current delivery assignments</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Active:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">{deliveries.length}</span>
          </div>
        </div>
      </div>

      {deliveries.length === 0 ? (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Active Deliveries</h3>
          <p className="text-gray-600 dark:text-gray-400">You don't have any active deliveries at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order #{delivery.orderId}
                  </h2>
                    <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                    {new Date(delivery.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                    delivery.status === "DELIVERED"
                        ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400"
                      : delivery.status === "CANCELLED"
                        ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                        : "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400"
                  }`}
                >
                  {delivery.status}
                </span>
              </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Pickup Location</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {delivery.pickupAddress}
                  </p>
                        <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4 mr-1" />
                          {delivery.farmerId}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4 mr-1" />
                          {delivery.farmerPhoneNumber}
                        </div>
                  </div>
                </div>

                    <div className="flex justify-center">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Delivery Location</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {delivery.deliveryAddress}
                  </p>
                        <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4 mr-1" />
                          {delivery.consumerId}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4 mr-1" />
                          {delivery.consumerPhoneNumber}
                        </div>
                      </div>
                  </div>
                </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                      onClick={() => window.location.href = `/delivery/${delivery._id}`}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                  </button>
                    {delivery.status !== "CANCELLED" && delivery.status !== "DELIVERED" && (
                      <button
                        onClick={() => handleCancel(delivery._id)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
