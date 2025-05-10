import { Request, Response } from "express";
import deliveryService from "../services/delivery.service";
import axios from "axios";

class DeliveryController {
  // Delivery Agent Controllers
  async createDeliveryAgent(req: Request, res: Response) {
    try {
      // Ensure required fields are present
      const { name, email, phoneNumber, idProof, vehicle } = req.body;
      if (!name || !email || !phoneNumber || !idProof || !vehicle) {
        return res.status(400).json({
          error:
            "Name, email, phone number, ID proof and vehicle details are required",
        });
      }

      // Validate ID proof type
      if (!["aadhaar", "pan", "voter"].includes(idProof.type)) {
        return res.status(400).json({
          error: "ID proof type must be either aadhaar, pan or voter",
        });
      }

      // Validate vehicle type
      if (!["bike", "van", "truck"].includes(vehicle.type)) {
        return res.status(400).json({
          error: "Vehicle type must be either bike, van or truck",
        });
      }

      // Initialize serviceLocations as empty array if not provided
      const agentData = {
        ...req.body,
        serviceLocations: req.body.serviceLocations || [],
        orderCount: 0,
        deliveredOrders: [],
        isAvailable: true,
      };

      const agent = await deliveryService.createDeliveryAgent(agentData);
      res.status(201).json(agent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delivery Controllers
  async createDelivery(req: Request, res: Response) {
    try {
      const {
        orderId,
        farmerId,
        consumerId,
        deliveryAgentId,
        orderPrice,
        deliveryAddress,
        pickupAddress,
        farmerPhoneNumber,
        consumerPhoneNumber,
        vehicleType,
      } = req.body;

      // Validate required fields
      if (!orderId || !farmerId || !consumerId || !deliveryAgentId || !vehicleType) {
        return res.status(400).json({
          error: "Missing required fields",
        });
      }

      // Validate vehicle type
      if (!["bike", "van", "truck"].includes(vehicleType)) {
        return res.status(400).json({
          error: "Invalid vehicle type",
        });
      }

      // Check if delivery agent exists and has the specified vehicle type
      const agent = await deliveryService.getDeliveryAgentById(deliveryAgentId);
      if (!agent) {
        return res.status(404).json({
          error: "Delivery agent not found",
        });
      }

      if (agent.vehicle.type !== vehicleType) {
        return res.status(400).json({
          error: "Selected delivery agent does not have the specified vehicle type",
        });
      }

      // Create delivery
      const delivery = await deliveryService.createDelivery({
        orderId,
        farmerId,
        consumerId,
        deliveryAgentId,
        orderPrice,
        deliveryAddress,
        pickupAddress,
        farmerPhoneNumber,
        consumerPhoneNumber,
        vehicleType,
        status: "CONFIRMED",
      });

      res.status(201).json(delivery);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // ... rest of the controller methods ...
} 