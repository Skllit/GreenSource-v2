import { 
  Package, 
  Check, 
  Warehouse, 
  User, 
  Truck,
  ArrowRight,
  Clock
} from "lucide-react";
import { IOrder } from "../types/Order";

interface Order extends IOrder {
  _id: string;
}

interface OrderTrackerProps {
  order: Order;
  status: string;
}

export function OrderTracker({ order, status }: OrderTrackerProps) {
  const steps = [
    {
      status: "PENDING",
      icon: Package,
      label: "Order Placed",
      description: "Order has been placed and waiting for confirmation",
    },
    {
      status: "CONFIRMED",
      icon: User,
      label: "Delivery Agent Assigned",
      description: "A delivery agent has been assigned to your order",
    },
    {
      status: "ONTHEWAY",
      icon: Truck,
      label: "On The Way",
      description: "Order is on the way to the delivery location",
    },
    {
      status: "SHIPPED",
      icon: Warehouse,
      label: "Shipped",
      description: "Order has been shipped successfully",
    },
    {
      status: "DELIVERED",
      icon: Check,
      label: "Delivered",
      description: "Order has been delivered successfully",
    },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.status === status
  );

  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
        <div
          className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.status} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-500
                    ${
                      isCompleted
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                        : isCurrent
                        ? "bg-white dark:bg-gray-800 text-emerald-500 border-2 border-emerald-500"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                    }
                    ${isCurrent ? "ring-4 ring-emerald-500/20" : ""}
                  `}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <div className="mt-4 text-center">
                  <span
                    className={`
                    text-sm font-medium block
                    ${
                      isCompleted || isCurrent
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block max-w-[120px]">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Message */}
      <div className="mt-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
          Current Status:{" "}
              <span className="font-medium text-gray-900 dark:text-white">{order.status}</span>
        </p>
            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              <span>Last updated: {new Date(order.updatedAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
      </div>
    </div>
  );
}
