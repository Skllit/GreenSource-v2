import mongoose, { Document, Schema } from 'mongoose';

export interface IDelivery extends Document {
  orderId: string;
  deliveryId: string;
  agentId: string;
  agentName: string;
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
  vehicle: {
    type: 'bike' | 'auto' | 'truck' | 'lorry';
    capacity: number;
    range: number;
    costPerKm: number;
  };
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  customerRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const deliverySchema = new Schema<IDelivery>(
  {
    orderId: {
      type: String,
      required: true,
    },
    deliveryId: {
      type: String,
      required: true,
      unique: true,
    },
    agentId: {
      type: String,
      required: true,
    },
    agentName: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
      required: true,
    },
    customerPincode: {
      type: String,
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
        },
      },
    ],
    totalWeight: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'picked_up', 'delivered'],
      default: 'pending',
    },
    vehicle: {
      type: {
        type: String,
        enum: ['bike', 'auto', 'truck', 'lorry'],
        required: true,
      },
      capacity: {
        type: Number,
        required: true,
      },
      range: {
        type: Number,
        required: true,
      },
      costPerKm: {
        type: Number,
        required: true,
      },
    },
    estimatedDeliveryTime: {
      type: Date,
      required: true,
    },
    actualDeliveryTime: {
      type: Date,
    },
    customerRating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const Delivery = mongoose.model<IDelivery>('Delivery', deliverySchema); 