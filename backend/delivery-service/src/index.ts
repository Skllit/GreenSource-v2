import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { deliveryAgentRoutes } from './routes/deliveryAgentRoutes';
import { deliveryRoutes } from './routes/deliveryRoutes';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';

config();

const app = express();
const PORT = process.env.PORT || 3809;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/delivery-agents', authMiddleware, deliveryAgentRoutes);
app.use('/api/deliveries', authMiddleware, deliveryRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/delivery-service')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Delivery service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 