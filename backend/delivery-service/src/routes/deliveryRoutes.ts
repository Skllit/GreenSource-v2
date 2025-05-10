import { Router } from 'express';
import { Delivery } from '../models/Delivery';
import { DeliveryAgent } from '../models/DeliveryAgent';

const router = Router();

// Create a new delivery
router.post('/', async (req, res) => {
  try {
    const {
      orderId,
      deliveryId,
      agentId,
      agentName,
      customerName,
      customerAddress,
      customerPincode,
      items,
      totalWeight,
      vehicle,
      estimatedDeliveryTime,
    } = req.body;

    const delivery = new Delivery({
      orderId,
      deliveryId,
      agentId,
      agentName,
      customerName,
      customerAddress,
      customerPincode,
      items,
      totalWeight,
      vehicle,
      estimatedDeliveryTime,
    });

    await delivery.save();

    // Update delivery agent's total deliveries
    await DeliveryAgent.findByIdAndUpdate(agentId, {
      $inc: { totalDeliveries: 1 },
    });

    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Error creating delivery' });
  }
});

// Get delivery by ID
router.get('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery' });
  }
});

// Update delivery status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'delivered' && { actualDeliveryTime: new Date() }),
      },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status' });
  }
});

// Rate delivery
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (delivery.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate delivered orders' });
    }

    delivery.customerRating = rating;
    await delivery.save();

    // Update delivery agent's rating
    const agent = await DeliveryAgent.findById(delivery.agentId);
    if (agent) {
      const newRating =
        (agent.rating * agent.totalDeliveries + rating) / (agent.totalDeliveries + 1);
      agent.rating = newRating;
      await agent.save();
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Error rating delivery' });
  }
});

export const deliveryRoutes = router; 