import axios from 'axios';
import { DeliveryVehicle } from '../types';

interface DeliveryAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: DeliveryVehicle[];
  availablePincodes: string[];
  isAvailable: boolean;
  rating: number;
}

interface DeliveryRequest {
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPincode: string;
  items: {
    name: string;
    quantity: number;
    weight: number;
  }[];
  totalWeight: number;
}

interface DeliveryAssignment {
  deliveryId: string;
  agentId: string;
  agentName: string;
  vehicle: DeliveryVehicle;
  estimatedDeliveryTime: string;
}

export const deliveryService = {
  async findAvailableAgents(pincode: string, weight: number): Promise<DeliveryAgent[]> {
    try {
      const response = await axios.get(`http://localhost:3809/api/delivery-agents/available`, {
        params: {
          pincode,
          weight,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error finding available agents:', error);
      throw error;
    }
  },

  async assignDeliveryAgent(request: DeliveryRequest): Promise<DeliveryAssignment> {
    try {
      // Find available agents in the customer's pincode
      const availableAgents = await this.findAvailableAgents(
        request.customerPincode,
        request.totalWeight
      );

      if (availableAgents.length === 0) {
        throw new Error('No delivery agents available in this area');
      }

      // Sort agents by rating and find the best matching vehicle
      const sortedAgents = availableAgents.sort((a, b) => b.rating - a.rating);
      let selectedAgent: DeliveryAgent | null = null;
      let selectedVehicle: DeliveryVehicle | null = null;

      for (const agent of sortedAgents) {
        // Find the most suitable vehicle for the order weight
        const suitableVehicle = agent.vehicles.find(
          (vehicle) => vehicle.capacity >= request.totalWeight
        );

        if (suitableVehicle) {
          selectedAgent = agent;
          selectedVehicle = suitableVehicle;
          break;
        }
      }

      if (!selectedAgent || !selectedVehicle) {
        throw new Error('No suitable vehicle found for this order');
      }

      // Calculate estimated delivery time (assuming average speed of 30 km/h)
      const estimatedDeliveryTime = new Date();
      estimatedDeliveryTime.setHours(estimatedDeliveryTime.getHours() + 1); // Add 1 hour for pickup and delivery

      // Create delivery assignment
      const assignment: DeliveryAssignment = {
        deliveryId: Math.random().toString(36).substr(2, 9), // Generate a random ID
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        vehicle: selectedVehicle,
        estimatedDeliveryTime: estimatedDeliveryTime.toISOString(),
      };

      // Save the delivery assignment
      await axios.post('http://localhost:3809/api/deliveries', {
        ...assignment,
        orderId: request.orderId,
        customerName: request.customerName,
        customerAddress: request.customerAddress,
        customerPincode: request.customerPincode,
        items: request.items,
        totalWeight: request.totalWeight,
        status: 'pending',
      });

      return assignment;
    } catch (error) {
      console.error('Error assigning delivery agent:', error);
      throw error;
    }
  },

  async getDeliveryStatus(deliveryId: string) {
    try {
      const response = await axios.get(`http://localhost:3809/api/deliveries/${deliveryId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting delivery status:', error);
      throw error;
    }
  },

  async updateDeliveryStatus(deliveryId: string, status: string) {
    try {
      const response = await axios.patch(`http://localhost:3809/api/deliveries/${deliveryId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating delivery status:', error);
      throw error;
    }
  },

  async rateDeliveryAgent(deliveryId: string, rating: number) {
    try {
      const response = await axios.post(`http://localhost:3809/api/deliveries/${deliveryId}/rate`, {
        rating,
      });
      return response.data;
    } catch (error) {
      console.error('Error rating delivery agent:', error);
      throw error;
    }
  },
}; 