import mongoose, { Document, Schema } from 'mongoose';

export interface IDeliveryAgent extends Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  vehicles: {
    type: 'bike' | 'auto' | 'truck' | 'lorry';
    capacity: number;
    range: number;
    costPerKm: number;
  }[];
  availablePincodes: string[];
  isAvailable: boolean;
  rating: number;
  totalDeliveries: number;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryAgentSchema = new Schema<IDeliveryAgent>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    vehicles: [
      {
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
    ],
    availablePincodes: [
      {
        type: String,
        required: true,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const DeliveryAgent = mongoose.model<IDeliveryAgent>('DeliveryAgent', deliveryAgentSchema); 