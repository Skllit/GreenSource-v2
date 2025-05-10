# Delivery Service

This is the delivery service for the GreenSource platform, handling delivery agent management and order deliveries.

## Features

- Delivery agent registration and management
- Vehicle management (bike, auto, truck, lorry)
- Pincode-based delivery area management
- Order delivery tracking
- Rating system for delivery agents

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3809
MONGODB_URI=mongodb://localhost:27017/delivery-service
JWT_SECRET=your-secret-key-here
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start the production server:
```bash
npm start
```

## API Endpoints

### Delivery Agents

- `GET /api/delivery-agents/available` - Get available delivery agents for a pincode and weight
- `POST /api/delivery-agents` - Create a new delivery agent
- `PATCH /api/delivery-agents/availability` - Update delivery agent availability
- `GET /api/delivery-agents/deliveries` - Get delivery agent's deliveries
- `PATCH /api/delivery-agents/vehicles` - Update delivery agent's vehicles
- `PATCH /api/delivery-agents/pincodes` - Update delivery agent's available pincodes

### Deliveries

- `POST /api/deliveries` - Create a new delivery
- `GET /api/deliveries/:id` - Get delivery by ID
- `PATCH /api/deliveries/:id` - Update delivery status
- `POST /api/deliveries/:id/rate` - Rate a delivery

## Models

### DeliveryAgent

```typescript
{
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
}
```

### Delivery

```typescript
{
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
}
``` 