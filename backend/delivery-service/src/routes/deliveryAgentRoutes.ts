import { Router } from 'express';
import { DeliveryAgent } from '../models/DeliveryAgent';
import { Delivery } from '../models/Delivery';

const router = Router();

// Get available delivery agents
router.get('/available', async (req, res) => {
  try {
    const { pincode, weight } = req.query;

    if (!pincode || !weight) {
      return res.status(400).json({ message: 'Pincode and weight are required' });
    }

    const agents = await DeliveryAgent.find({
      availablePincodes: pincode,
      isAvailable: true,
      'vehicles.capacity': { $gte: Number(weight) },
    });

    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Error finding available agents' });
  }
});

// Create delivery agent
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, vehicles, availablePincodes } = req.body;

    const agent = new DeliveryAgent({
      userId: req.user?.id,
      name,
      email,
      phone,
      vehicles,
      availablePincodes,
    });

    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating delivery agent' });
  }
});

// Update delivery agent availability
router.patch('/availability', async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const agent = await DeliveryAgent.findOneAndUpdate(
      { userId: req.user?.id },
      { isAvailable },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability' });
  }
});

// Get delivery agent's deliveries
router.get('/deliveries', async (req, res) => {
  try {
    const agent = await DeliveryAgent.findOne({ userId: req.user?.id });

    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }

    const deliveries = await Delivery.find({ agentId: agent._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveries' });
  }
});

// Update delivery agent's vehicles
router.patch('/vehicles', async (req, res) => {
  try {
    const { vehicles } = req.body;

    const agent = await DeliveryAgent.findOneAndUpdate(
      { userId: req.user?.id },
      { vehicles },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating vehicles' });
  }
});

// Update delivery agent's available pincodes
router.patch('/pincodes', async (req, res) => {
  try {
    const { availablePincodes } = req.body;

    const agent = await DeliveryAgent.findOneAndUpdate(
      { userId: req.user?.id },
      { availablePincodes },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pincodes' });
  }
});

export const deliveryAgentRoutes = router; 