import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { MapPin, Users, ShoppingBag, Truck, Loader2, AlertCircle, TrendingUp, UserPlus, Package, Truck as TruckIcon } from "lucide-react";
import { fetchStats, fetchOrdersList } from "../store/slices/adminSlice";
import { RootState, useAppDispatch } from "../store";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
};

function StatCard({ title, value, icon, trend, trendLabel }: StatCardProps) {
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
            <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'transform rotate-180' : ''}`} />
            {trend}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-gray-600 dark:text-gray-400">{title}</p>
      {trendLabel && (
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{trendLabel}</p>
      )}
    </div>
  );
}

export default function AdminOverview() {
  const dispatch = useAppDispatch();
  const {
    orders, customers, farmers, deliveryAgents,
    ordersList, loading, error
  } = useSelector((s: RootState) => s.admin);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchOrdersList());
  }, [dispatch]);

  const monthlyIncomeData = useMemo(() => {
    const arr = Array.isArray(ordersList) ? ordersList : [];
    const delivered = arr.filter(o => o.status.toLowerCase() === "delivered");

    const sums = new Array<number>(12).fill(0);
    delivered.forEach(o => {
      const dt = new Date(o.createdAt);
      if (isNaN(dt.getTime())) return;
      const m = dt.getMonth();
      const amt = Number(o.totalAmount) || 0;
      sums[m] += amt;
    });

    const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return labels.map((mon, i) => ({ month: mon, income: sums[i] }));
  }, [ordersList]);

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
            onClick={() => { dispatch(fetchStats()); dispatch(fetchOrdersList()); }}
            className="mt-3 inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const locations = [
    "Bangalore Urban", "Bangalore Rural", "Mysore",
    "Hassan", "Tumkur", "Mandya"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to your admin dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders" 
          value={orders} 
          icon={<ShoppingBag className="w-6 h-6 text-emerald-500" />} 
          trend={12}
          trendLabel="vs last month"
        />
        <StatCard 
          title="Total Customers" 
          value={customers} 
          icon={<Users className="w-6 h-6 text-emerald-500" />} 
          trend={8}
          trendLabel="vs last month"
        />
        <StatCard 
          title="Active Farmers" 
          value={farmers} 
          icon={<UserPlus className="w-6 h-6 text-emerald-500" />} 
          trend={5}
          trendLabel="vs last month"
        />
        <StatCard 
          title="Delivery Agents" 
          value={deliveryAgents} 
          icon={<TruckIcon className="w-6 h-6 text-emerald-500" />} 
          trend={3}
          trendLabel="vs last month"
        />
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly Income</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Revenue overview for the year</p>
          </div>
        </div>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyIncomeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                domain={[0, "dataMax"]}
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={2} 
                activeDot={{ r: 8 }}
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Locations We Serve</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Current service areas</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc, i) => (
            <div 
              key={i} 
              className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">{loc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
