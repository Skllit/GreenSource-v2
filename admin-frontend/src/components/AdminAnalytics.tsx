import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { 
  Loader2, 
  AlertCircle, 
  Users, 
  UserPlus, 
  Package, 
  ShoppingBag, 
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart
} from "lucide-react";

interface Analytics {
  consumers: {
    total: number;
    activeThisMonth: number;
    newThisMonth: number;
  };
  farmers: {
    total: number;
    verified: number;
    pendingVerification: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
    byCategory: {
      [key: string]: number;
    };
  };
  orders: {
    total: number;
    delivered: number;
    pending: number;
    totalRevenue: number;
    adminCommission: number;
  };
}

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  prefix?: string;
  suffix?: string;
};

function StatCard({ title, value, icon, trend, trendLabel, prefix, suffix }: StatCardProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm font-medium ${
            trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{title}</p>
      {trendLabel && (
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{trendLabel}</p>
      )}
    </div>
  );
}

export default function AdminAnalytics() {
  const { token } = useSelector(selectAuth);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      // Fetch all services in parallel
      const [customersRes, farmersRes, productsRes, ordersRes] =
        await Promise.all([
          axios.get("http://localhost:3800/api/customers/api/customers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3800/api/farmers/api/farmers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3800/api/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3800/api/orders/api/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const customers = customersRes.data.data;
      const farmers = farmersRes.data;
      const products = productsRes.data;
      const orders = ordersRes.data;

      // Date calculations
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Consumer analytics
      const activeCustomers = Array.from(
        new Set(
          orders
            .filter((o: any) => new Date(o.createdAt) >= firstOfMonth)
            .map((o: any) => o.consumerId || o.customerEmail)
        )
      );
      const newCustomers = customers.filter(
        (c: any) => new Date(c.createdAt) >= firstOfMonth
      );

      // Product analytics with correct field
      const totalProducts = products.length;
      const activeProducts = products.filter((p: any) => p.isActive).length;
      const outOfStock = products.filter(
        (p: any) => p.quantityAvailable <= 0
      ).length;
      const byCategory = products.reduce((acc: any, p: any) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});

      // Order analytics
      const totalRevenue = orders.reduce(
        (sum: number, o: any) => sum + (o.totalAmount || 0),
        0
      );
      const adminCommission = totalRevenue * 0.05;

      // Compose analytics
      const analyticsData: Analytics = {
        consumers: {
          total: customers.length,
          activeThisMonth: activeCustomers.length,
          newThisMonth: newCustomers.length,
        },
        farmers: {
          total: farmers.length,
          verified: farmers.filter((f: any) => f.is_verified).length,
          pendingVerification: farmers.filter((f: any) => !f.is_verified)
            .length,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          outOfStock,
          byCategory,
        },
        orders: {
          total: orders.length,
          delivered: orders.filter((o: any) =>
            ["DELIVERED", "delivered"].includes(o.status)
          ).length,
          pending: orders.filter((o: any) =>
            ["PENDING", "pending"].includes(o.status)
          ).length,
          totalRevenue,
          adminCommission,
        },
      };

      setAnalytics(analyticsData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching analytics:", err);
      setError("Failed to fetch analytics data");
      setLoading(false);
    }
  };

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
            onClick={fetchAnalytics}
            className="mt-3 inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of platform performance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Consumers" 
          value={analytics.consumers.total} 
          icon={<Users className="w-6 h-6 text-emerald-500" />} 
          trend={12}
          trendLabel="vs last month"
        />
        <StatCard 
          title="Active Farmers" 
          value={analytics.farmers.verified} 
          icon={<UserPlus className="w-6 h-6 text-emerald-500" />} 
          trend={8}
          trendLabel="vs last month"
        />
        <StatCard 
          title="Total Products" 
          value={analytics.products.total} 
          icon={<Package className="w-6 h-6 text-emerald-500" />} 
          trend={15}
          trendLabel="vs last month"
        />
        <StatCard 
          title="Total Revenue" 
          value={analytics.orders.totalRevenue} 
          icon={<IndianRupee className="w-6 h-6 text-emerald-500" />} 
          trend={20}
          trendLabel="vs last month"
          prefix="₹"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumer Stats */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Consumer Analytics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active This Month</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{analytics.consumers.activeThisMonth}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{analytics.consumers.newThisMonth}</p>
            </div>
          </div>
        </div>

        {/* Farmer Stats */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <UserPlus className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Farmer Analytics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Farmers</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{analytics.farmers.total}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Verification</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{analytics.farmers.pendingVerification}</p>
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Analytics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Products</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{analytics.products.active}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Out of Stock</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{analytics.products.outOfStock}</p>
            </div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Analytics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Delivered Orders</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{analytics.orders.delivered}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{analytics.orders.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-6">
          <PieChart className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(analytics.products.byCategory).map(([cat, cnt]) => (
            <div 
              key={cat} 
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{cat}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{cnt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Total Commission</h2>
            <p className="text-emerald-100">Platform earnings from orders</p>
          </div>
          <div className="text-3xl font-bold">
            ₹{analytics.orders.adminCommission.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
