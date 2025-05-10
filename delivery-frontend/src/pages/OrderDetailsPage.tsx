import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  MapPin, 
  Package, 
  Clock, 
  User, 
  Phone,
  Truck,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from "lucide-react";
import { OrderTracker } from "./OrderTracker";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { IOrder, IOrderItem } from "../types/Order";

interface DeliveryLocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface Order extends IOrder {
  _id: string;
}

interface Delivery {
  _id: string;
  orderId: string;
  farmerId: string;
  customerId: string;
  deliveryAgentId?: string;
  status: "PENDING" | "CONFIRMED" | "ONTHEWAY" | "SHIPPED" | "DELIVERED";
  deliveryLocation: DeliveryLocation;
  pickupAddress?: string;
  deliveryAddress?: string;
  farmerPhoneNumber?: string;
  consumerPhoneNumber?: string;
}

interface DeliveryStatusUpdate {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "ONTHEWAY"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
}

export default function OrderDetailsPage() {
  const { deliveryId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [productNames, setProductNames] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useSelector(selectAuth);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const deliveryRes = await axios.get(
          `http://localhost:3800/api/delivery/${deliveryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const deliveryResData = await deliveryRes.data;
        setDelivery(deliveryResData);

        const orderId = deliveryResData.orderId;

        // Fetch order details from order service
        const orderResponse = await axios.get(
          `http://localhost:3800/api/orders/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const orderData = await orderResponse.data;
        setOrder(orderData);

        // Fetch delivery details from delivery service
        const deliveryResponse = await axios.get(
          `http://localhost:3800/api/delivery/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const deliveryData = await deliveryResponse.data;
        setDelivery(deliveryData);

        // Fetch product names for all items
        const names: { [key: string]: string } = {};
        for (const item of orderData.items) {
          const response = await axios.get(
            `http://localhost:3800/api/products/${item.productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          names[item.productId] = response.data?.name || "Unknown Product";
        }
        setProductNames(names);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };

    if (deliveryId) {
      fetchOrderDetails();
    }
  }, [deliveryId, token]);

  const updateDeliveryStatus = async (statusUpdate: DeliveryStatusUpdate) => {
    try {
      // Update delivery status
      const deliveryResponse = await axios.put(
        `http://localhost:3800/api/delivery/${delivery?._id}/status`,
        statusUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (statusUpdate.status === "DELIVERED") {
        const orderCountUpdate = await axios.put(
          `http://localhost:3809/agents/${delivery?.deliveryAgentId}/orderCount/decrease`
        );
        const addedDeliveryId = await axios.put(
          `http://localhost:3809/add/${delivery?.deliveryAgentId}/delivery/${delivery?._id}`
        );
        console.log(addedDeliveryId);
        console.log(orderCountUpdate);
      }
      setDelivery(deliveryResponse.data);

      // Update order status to match delivery status
      if (order) {
        let orderStatus = statusUpdate.status;
        if (statusUpdate.status === "ONTHEWAY") {
          orderStatus = "CONFIRMED";
        }

        await axios.put(
          `http://localhost:3800/api/orders/api/orders/${order._id}`,
          { status: orderStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Refresh order data
        const orderResponse = await axios.get(
          `http://localhost:3800/api/orders/api/orders/${order._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(orderResponse.data);
      }
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  const renderDeliveryAgentControls = (delivery: Delivery) => {
    return (
      <div className="mt-8 space-y-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          Delivery Controls
        </h3>
        <div className="flex flex-wrap gap-4">
          {delivery.status === "CONFIRMED" && (
            <button
              onClick={() => updateDeliveryStatus({ status: "ONTHEWAY" })}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Truck className="w-5 h-5" />
              <span>Mark as Picked Up</span>
            </button>
          )}
          {delivery.status === "ONTHEWAY" && (
            <button
              onClick={() => updateDeliveryStatus({ status: "SHIPPED" })}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>Start Delivery</span>
            </button>
          )}
          {delivery.status === "SHIPPED" && (
            <button
              onClick={() => updateDeliveryStatus({ status: "DELIVERED" })}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Mark as Delivered</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
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

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Package className="w-12 h-12 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400">The requested order could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Order #{order._id}
                </h2>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === "DELIVERED"
                    ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400"
                    : order.status === "CANCELLED"
                    ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                    : "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <OrderTracker order={order} status={delivery?.status as string} />

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Details
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                          <Package className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {productNames[item.productId] || "Unknown Product"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Delivery Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Pickup Location</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {delivery?.pickupAddress}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4 mr-1" />
                        {delivery?.farmerId}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-1" />
                        {delivery?.farmerPhoneNumber}
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
                      <h4 className="font-medium text-gray-900 dark:text-white">Delivery Location</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {delivery?.deliveryAddress}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4 mr-1" />
                        {delivery?.customerId}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-1" />
                        {delivery?.consumerPhoneNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {delivery && renderDeliveryAgentControls(delivery)}
        </div>
      </div>
    </div>
  );
}
