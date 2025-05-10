import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { 
  Loader2, 
  AlertCircle, 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronDown,
  IndianRupee,
  User,
  Package,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  AlertTriangle,
  Eye
} from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  consumerId: string;
  consumerName: string;
  consumerEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersView() {
  const { token } = useSelector(selectAuth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | Order["status"]>("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<"all" | Order["paymentStatus"]>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3800/api/orders/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders data");
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await axios.put(
        `http://localhost:3800/api/orders/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "CONFIRMED":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400";
      case "SHIPPED":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400";
      case "DELIVERED":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "CANCELLED":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-3.5 h-3.5 mr-1" />;
      case "CONFIRMED":
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case "SHIPPED":
        return <Truck className="w-3.5 h-3.5 mr-1" />;
      case "DELIVERED":
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case "CANCELLED":
        return <XCircle className="w-3.5 h-3.5 mr-1" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
    }
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "FAILED":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.consumerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" || order.status === selectedStatus;
    
    const matchesPaymentStatus = 
      selectedPaymentStatus === "all" || order.paymentStatus === selectedPaymentStatus;

    return matchesSearch && matchesStatus && matchesPaymentStatus;
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
            onClick={fetchOrders}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage customer orders</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search orders..."
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
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Order Status</p>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Order["status"])}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Payment Status</p>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value as Order["paymentStatus"])}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                >
                  <option value="all">All Payment Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.consumerName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <User className="w-4 h-4 mr-1.5 text-emerald-500" />
                    {order.consumerEmail}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-emerald-500" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Items</p>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Package className="w-4 h-4 mr-1.5 text-emerald-500" />
                    {order.items.length} products
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                    <IndianRupee className="w-4 h-4 mr-0.5" />
                    {order.totalAmount}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{item.productName}</span>
                      <span className="text-gray-900 dark:text-white">
                        {item.quantity} x ₹{item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => handleUpdateStatus(order._id, "CONFIRMED")}
                  disabled={order.status !== "PENDING"}
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2 ${
                    order.status === "PENDING"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                  } text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg`}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm
                </button>
                <button
                  onClick={() => handleUpdateStatus(order._id, "SHIPPED")}
                  disabled={order.status !== "CONFIRMED"}
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2 ${
                    order.status === "CONFIRMED"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                  } text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg`}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Ship
                </button>
                <button
                  onClick={() => handleUpdateStatus(order._id, "DELIVERED")}
                  disabled={order.status !== "SHIPPED"}
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2 ${
                    order.status === "SHIPPED"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                  } text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg`}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Deliver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 